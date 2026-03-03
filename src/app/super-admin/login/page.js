"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserShield, FaLock, FaHome, FaShieldAlt, FaFingerprint, FaChalkboardTeacher, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/firebase/auth";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

const SUPER_ADMIN_EMAILS = [
    "kontaktaone@gmail.com",
];

export default function SuperAdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const email = user.email?.toLowerCase();
                // Check whitelist
                if (SUPER_ADMIN_EMAILS.includes(email)) {
                    router.replace("/super-admin");
                    setVerifying(false);
                    return;
                }
                // Check admins collection
                try {
                    const adminSnap = await getDoc(doc(db, "admins", user.uid));
                    if (adminSnap.exists() && adminSnap.data().status === "active" && adminSnap.data().roles?.length > 0) {
                        router.replace("/super-admin");
                        setVerifying(false);
                        return;
                    }
                } catch { }
            }
            setVerifying(false);
        });
        return () => unsub();
    }, [router]);

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithGoogle(null, true);
            const user = auth.currentUser;

            if (!user) {
                setError("Authentication failed. Please try again.");
                setLoading(false);
                return;
            }

            // Check if they are a teacher — block from admin panel
            try {
                const teacherDoc = await getDoc(doc(db, "teachers", user.email.toLowerCase()));
                if (teacherDoc.exists()) {
                    await auth.signOut();
                    setError("TEACHER_PROHIBITED");
                    setLoading(false);
                    return;
                }
            } catch { }

            // Check admin access: whitelist OR admins collection
            if (SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
                router.push("/super-admin");
                return;
            }

            try {
                const adminSnap = await getDoc(doc(db, "admins", user.uid));
                if (adminSnap.exists() && adminSnap.data().status === "active" && adminSnap.data().roles?.length > 0) {
                    router.push("/super-admin");
                    return;
                }
            } catch { }

            await auth.signOut();
            setError("ACCESS_DENIED");
        } catch (err) {
            console.error("Super Admin auth error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-blue-400 font-black uppercase tracking-[3px] text-sm animate-pulse">
                        Verifying clearance...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 rounded-full blur-[150px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-600/3 rounded-full blur-[120px]" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMDAsMTE2LDE0MCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Top Badge */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 px-6 py-2 rounded-full flex items-center gap-2">
                        <FaFingerprint className="text-blue-500 text-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
                            Restricted Access Zone
                        </span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative">
                    {/* Subtle gradient border effect */}
                    <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 pointer-events-none" />

                    {/* Home Link */}
                    <button
                        onClick={() => router.push("/")}
                        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-blue-400 font-black uppercase tracking-[2px] text-[9px] transition-colors z-20"
                    >
                        <FaHome /> Home
                    </button>

                    {/* Icon + Branding */}
                    <div className="text-center mb-10 relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center text-4xl text-white shadow-2xl shadow-blue-900/40 border border-blue-500/20">
                                    <FaUserShield />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Super Admin</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Authenticate with your authorized Google account
                        </p>
                    </div>

                    {/* Error/Status Messages */}
                    {error === "ACCESS_DENIED" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 relative z-10"
                        >
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FaShieldAlt className="text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-rose-400 font-black text-sm mb-1">Access Denied</p>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">
                                            Your Google account is not authorized for Super Admin access. This incident has been logged.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {error === "TEACHER_PROHIBITED" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 relative z-10"
                        >
                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FaChalkboardTeacher className="text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-amber-400 font-black text-sm mb-1">Educator Account Detected</p>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                                            Educators are not permitted in the Super Admin zone. Please use your dedicated portal.
                                        </p>
                                        <button
                                            onClick={() => router.push('/teacher-admin/login')}
                                            className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-2"
                                        >
                                            Go to Educator Portal <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {error && error !== "ACCESS_DENIED" && error !== "TEACHER_PROHIBITED" && (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex gap-3 items-center font-bold text-sm mb-6 text-rose-500 relative z-10">
                            <FaLock className="flex-shrink-0" />
                            <span className="text-xs">{error}</span>
                        </div>
                    )}

                    {/* Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full h-16 bg-white rounded-2xl font-black text-slate-800 shadow-xl transition-all flex items-center justify-center gap-3 hover:bg-slate-50 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 relative z-10"
                    >
                        <FcGoogle className="text-2xl" />
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            "Authenticate with Google"
                        )}
                    </button>

                    {/* Security Footer */}
                    <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <FaLock className="text-slate-700 text-[10px]" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[3px]">
                                End-to-end encrypted
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-700 font-bold">
                            Only pre-authorized Google accounts can access the Super Admin panel.
                        </p>
                    </div>
                </div>

                {/* Bottom Branding */}
                <div className="text-center mt-6">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[4px]">
                        KidsPortal Administration
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
