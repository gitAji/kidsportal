"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

// This guard verifies that the user is registered in the 'teachers' collection.
export default function TeacherAdminGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        console.log("TeacherAdminGuard: Monitoring auth state...");
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("TeacherAdminGuard: No user, redirecting to login.");
                router.replace("/teacher-admin/login");
            } else {
                console.log("TeacherAdminGuard: User detected:", user.email);
                try {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const { db } = await import("@/firebase/config");

                    const teacherDoc = await getDoc(doc(db, "teachers", user.email.toLowerCase()));

                    console.log("TeacherAdminGuard: Teacher record exists:", teacherDoc.exists());

                    if (!teacherDoc.exists()) {
                        console.warn("TeacherAdminGuard: Access denied for", user.email);
                        router.replace("/teacher-admin/login?error=unauthorized");
                    } else if (teacherDoc.data().status !== 'active') {
                        console.warn("TeacherAdminGuard: Account not active for", user.email);
                        router.replace("/teacher-admin/login?error=pending");
                    } else {
                        console.log("TeacherAdminGuard: Access granted to teacher.");
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

    return children;
}
