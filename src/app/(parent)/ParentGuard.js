"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

// Routes that require a logged-in parent account. /pricing is intentionally
// excluded: it's linked from the public marketing site (CurriculumShowcase,
// InteractiveLesson) for visitors who haven't signed up yet, and its own
// "Subscribe" button already redirects to /login if no one is signed in —
// gating the whole page here just blocked prospects from ever seeing prices
// before creating an account.
const WORKSPACE_PATHS = [
    '/dashboard', '/analytics', '/child-dashboard', '/profile',
    '/billing', '/child-profile', '/child-settings',
    '/subscription-management', '/avatar-customizer', '/avatar-shop',
    '/sticker-book', '/payment', '/grades'
];

/**
 * ParentGuard ensures:
 * 1. User is authenticated.
 * 2. User exists in the 'users' collection (where Parents are stored).
 * 3. Redirects to login if either condition is not met.
 *
 * Public marketing/content pages (home, about, pricing, etc.) are never
 * gated: `checking` starts false for them so they render immediately on the
 * server, instead of every page on the site shipping nothing but a loading
 * spinner until a client-side Firebase check resolves.
 */
export default function ParentGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const isWorkspace = WORKSPACE_PATHS.some(path => pathname?.startsWith(path));
    const [checking, setChecking] = useState(isWorkspace);

    useEffect(() => {
        if (!isWorkspace) {
            return;
        }

        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("ParentGuard: No user, redirecting to login.");
                router.replace("/login?role=parent&redirect=" + encodeURIComponent(pathname));
                return;
            }

            try {
                // Check if user exists in 'users' collection (Parents)
                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (userDoc.exists()) {
                    console.log("ParentGuard: Access granted to parent.");
                    setChecking(false);
                } else {
                    // Check if they are a teacher
                    const teacherDoc = await getDoc(doc(db, "teachers", user.email?.toLowerCase()));
                    if (teacherDoc.exists() && teacherDoc.data().status === 'active') {
                        console.log("ParentGuard: Teacher detected on parent route, redirecting to teacher-admin");
                        router.replace("/teacher-admin");
                    } else {
                        console.warn("ParentGuard: Access denied. User not found in 'users' collection.");
                        router.replace("/login?error=unauthorized_parent");
                    }
                }
            } catch (error) {
                console.error("ParentGuard Error:", error);
                router.replace("/login?error=system");
            }
        });

        return () => unsub();
    }, [router, pathname, isWorkspace]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Verifying Parent Access...</p>
                </div>
            </div>
        );
    }

    return children;
}
