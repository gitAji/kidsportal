"use client";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import TeacherSidebar from "@/app/components/layout/TeacherSidebar";
import TeacherAdminGuard from "./TeacherAdminGuard";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";
import EmailVerificationBanner from "@/app/components/ui/EmailVerificationBanner";

export default function TeacherAdminLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/teacher-admin/login";
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
    }, []);

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <TeacherAdminGuard>
            <div className="flex bg-slate-50 h-screen overflow-hidden">
                <TeacherSidebar />
                <div className="flex-grow flex flex-col h-full overflow-hidden">
                    <main className="flex-grow overflow-y-auto bg-slate-50/50">
                        <EmailVerificationBanner user={user} />
                        <Suspense fallback={<DashboardSkeleton />}>
                            {children}
                        </Suspense>
                    </main>
                </div>
            </div>
        </TeacherAdminGuard>
    );
}

