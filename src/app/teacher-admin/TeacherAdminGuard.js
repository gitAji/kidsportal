"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

import { TeacherProvider } from "@/context/TeacherContext";

const SUPER_ADMIN_EMAILS = ["kontaktaone@gmail.com"];

// This guard verifies that the user is registered in the 'teachers' collection.
export default function TeacherAdminGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log("TeacherAdminGuard: COMPLETELY BYPASSING AUTH FOR TESTING IN DEV");
            setProfile({
                name: "Test Teacher Admin",
                email: "teacher_test@example.com",
                status: "active",
                isCurriculumAdmin: true,
                assignments: [
                    { grade: 'all', subject: 'all' }
                ]
            });
            setChecking(false);
            return;
        }

        console.log("TeacherAdminGuard: Monitoring auth state...");
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("TeacherAdminGuard: No user, redirecting to login.");
                router.replace("/teacher-admin/login");
            } else {
                console.log("TeacherAdminGuard: User detected:", user.email);
                const email = user.email?.toLowerCase();
                try {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const { db } = await import("@/firebase/config");

                    const teacherDoc = await getDoc(doc(db, "teachers", email));

                    console.log("TeacherAdminGuard: Teacher record exists:", teacherDoc.exists());

                    if (SUPER_ADMIN_EMAILS.includes(email)) {
                        console.log("TeacherAdminGuard: Super Admin Access Granted");
                        setProfile({
                            id: 'super_admin',
                            name: "Super Admin",
                            email: email,
                            status: "active",
                            isCurriculumAdmin: true,
                            assignments: [{ grade: 'all', subject: 'all' }]
                        });
                        setChecking(false);
                    } else if (process.env.NODE_ENV === 'development' && email === 'teacher_test@example.com') {
                        console.log("TeacherAdminGuard: BYPASS ENABLED FOR TESTING");
                        setProfile({
                            id: teacherDoc.id || 'test_teacher',
                            name: teacherDoc.data()?.name || "Test Teacher",
                            email: email,
                            status: "active",
                            ...teacherDoc.data(),
                            isCurriculumAdmin: true,
                            assignments: [{ grade: 'all', subject: 'all' }]
                        });
                        setChecking(false);
                    } else if (!teacherDoc.exists()) {
                        console.warn("TeacherAdminGuard: Access denied for", user.email);
                        router.replace("/teacher-admin/login?error=unauthorized");
                    } else if (teacherDoc.data().status !== 'active') {
                        console.warn("TeacherAdminGuard: Account not active for", user.email);
                        router.replace("/teacher-admin/login?error=pending");
                    } else {
                        console.log("TeacherAdminGuard: Access granted to teacher.");
                        setProfile({
                            id: teacherDoc.id,
                            ...teacherDoc.data()
                        });
                        setChecking(false);
                    }
                } catch (error) {
                    console.error("TeacherAdminGuard Error:", error);
                    router.replace("/teacher-admin/login?error=system");
                }
            }
        });
        return () => unsub();
    }, [router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="text-white text-lg font-semibold animate-pulse">
                    Verifying access...
                </div>
            </div>
        );
    }

    return (
        <TeacherProvider profile={profile}>
            {children}
        </TeacherProvider>
    );
}
