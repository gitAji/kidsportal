"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

// Fallback super admin email (always has access)
const SUPER_ADMIN_EMAILS = [
    "kontaktaone@gmail.com",
];

/**
 * SuperAdminGuard checks:
 * 1. User is authenticated
 * 2. User email is in SUPER_ADMIN_EMAILS whitelist, OR
 * 3. User has an entry in the 'admins' collection with an active status
 *
 * Provides the user's roles to children via context-like prop drilling.
 */
export default function SuperAdminGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [adminRoles, setAdminRoles] = useState([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace("/super-admin/login");
                return;
            }

            const email = user.email?.toLowerCase();

            // Check if super admin by whitelist
            if (SUPER_ADMIN_EMAILS.includes(email)) {
                setAdminRoles(["super_admin"]);
                setChecking(false);
                return;
            }

            // Check Firestore admins collection for role-based access
            try {
                const adminSnap = await getDoc(doc(db, "admins", user.uid));
                if (adminSnap.exists()) {
                    const data = adminSnap.data();
                    if (data.status === "active" && data.roles?.length > 0) {
                        setAdminRoles(data.roles);
                        setChecking(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Error checking admin roles:", err);
            }

            // Not authorized
            router.replace("/super-admin/login");
        });
        return () => unsub();
    }, [router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-blue-400 text-sm font-black animate-pulse uppercase tracking-[3px]">
                        Verifying Access
                    </span>
                </div>
            </div>
        );
    }

    // Pass roles down to children
    return typeof children === 'function' ? children(adminRoles) : children;
}
