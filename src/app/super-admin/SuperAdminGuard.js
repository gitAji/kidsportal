"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

// Super Admin Whitelist — only these emails can access the admin panel
const SUPER_ADMIN_EMAILS = [
    "kontaktaone@gmail.com",
];

export default function SuperAdminGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace("/super-admin/login");
            } else {
                if (!SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
                    router.replace("/super-admin/login");
                } else {
                    setChecking(false);
                }
            }
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

    return children;
}
