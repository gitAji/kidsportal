"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaArrowRight, FaLock, FaHome } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/firebase/auth";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function TeacherLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam === "unauthorized") setError("Access Denied: You are not authorized.");
        if (errorParam === "pending") setError("PENDING_REVIEW");
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            const user = result.user;

            const teacherDoc = await getDoc(doc(db, "teachers", user.email.toLowerCase()));

            if (teacherDoc.exists()) {
                const data = teacherDoc.data();
                if (data.status === 'active') {
                    router.push("/teacher-admin");
                } else if (data.status === 'pending') {
                    setError("PENDING_REVIEW");
                } else {
                    setError("ACCESS_SUSPENDED");
                }
            } else {
                // New teacher application
                await setDoc(doc(db, "teachers", user.email.toLowerCase()), {
                    name: user.displayName || "New Educator",
                    email: user.email.toLowerCase(),
                    role: 'teacher',
                    createdAt: serverTimestamp(),
                    status: 'pending'
                });
                setError("APPLICATION_RECEIVED");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = () => {
        if (error === "PENDING_REVIEW") return "Your educator account is currently pending authorization from the Superadmin.";
        if (error === "ACCESS_SUSPENDED") return "Your access has been suspended. Please contact support.";
        if (error === "APPLICATION_RECEIVED") return "Welcome! Your application has been received. Please wait for Superadmin authorization.";
        return error;
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-12 shadow-3xl shadow-black/50 overflow-hidden relative z-10"
            >
                <div className="mb-8 items-center justify-center flex">
                    <button
                        onClick={() => router.push("/")}
                        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black uppercase tracking-[2px] text-[10px] transition-colors"
                    >
                        <FaHome /> Home
                    </button>
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center text-4xl text-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <FaChalkboardTeacher />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-2">Educator Portal</h2>
                    <p className="text-slate-400 text-sm font-medium">
                        Log in with your registered school Google account.
                    </p>
                </div>

                {error && (
                    <div className={`p-4 rounded-2xl flex gap-3 items-center font-bold text-sm mb-6 ${error.includes("_") || error.includes("RECEIVED")
                        ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                        : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
                        }`}>
                        <FaLock className="flex-shrink-0" />
                        <span>{getErrorMessage()}</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full h-16 bg-white rounded-2xl font-black text-slate-800 shadow-xl transition-all flex items-center justify-center gap-3 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    <FcGoogle className="text-2xl" />
                    {loading ? "Authenticating..." : "Sign in with Google"}
                </button>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[2px]">
                        Need help accessing?
                        <a href="mailto:support@kidsportal.com" className="text-indigo-500 ml-2 hover:underline">Contact Support</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
