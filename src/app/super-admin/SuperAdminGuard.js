"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

// Super Admin Whitelist
const SUPER_ADMIN_EMAILS = [
    "kontaktaone@gmail.com",
];

export default function SuperAdminGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        console.log("SuperAdminGuard: Monitoring auth state...");
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("SuperAdminGuard: No user, redirecting to home.");
                router.replace("/");
            } else {
                console.log("SuperAdminGuard: User detected:", user.email);
                if (!SUPER_ADMIN_EMAILS.includes(user.email)) {
                    console.warn("SuperAdminGuard: Access denied for", user.email);
                    router.replace("/");
                } else {
                    console.log("SuperAdminGuard: Access granted to Super Admin.");
                    setChecking(false);
                }
            }
        });
        return () => unsub();
    }, [router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-blue-500 text-lg font-black animate-pulse flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                    SUPER ADMIN ACCESS: VERIFYING...
                </div>
            </div>
        );
    }

    return children;
}
