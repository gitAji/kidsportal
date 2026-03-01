"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import TeacherSidebar from "@/app/components/layout/TeacherSidebar";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";

export default function TeacherAdminLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/teacher-admin/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex bg-slate-50 h-screen overflow-hidden">
            <TeacherSidebar />
            <div className="flex-grow flex flex-col h-full overflow-hidden">
                <main className="flex-grow overflow-y-auto bg-slate-50/50">
                    <Suspense fallback={<DashboardSkeleton />}>
                        {children}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

