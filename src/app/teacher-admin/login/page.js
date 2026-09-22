"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaChalkboardTeacher, FaLock, FaHome, FaCheckCircle,
    FaClock, FaBan, FaSignInAlt, FaUserPlus, FaArrowRight,
    FaShieldAlt
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function TeacherLoginWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="text-white text-lg font-semibold animate-pulse">Loading...</div></div>}>
            <TeacherLoginPage />
        </Suspense>
    );
}

function TeacherLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam === "unauthorized") setError("Access Denied: You are not authorized.");
        if (errorParam === "pending") setError("PENDING_REVIEW");
        if (errorParam === "suspended") setError("ACCESS_SUSPENDED");

        const tab = searchParams.get("tab");
        if (tab === "register") setActiveTab("register");
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await signInWithGoogle(null, true);
            const user = result.user;

            await checkAndRedirectTeacher(user);
        } catch (err) {
            console.error("Teacher auth error:", err);
            if (err.message === "TEACHER_PROHIBITED") {
                setError("This account is already registered as a Parent. Please use a different email for your Teacher account.");
            } else {
                setError(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { signInWithEmail, signUpWithEmail } = await import("@/firebase/auth");
            let user;

            if (activeTab === "register") {
                // For teachers, we use a slightly modified flow or just custom doc creation
                // We'll create the auth account first
                const { createUserWithEmailAndPassword, sendEmailVerification } = await import("firebase/auth");
                const result = await createUserWithEmailAndPassword(auth, email, password);
                user = result.user;

                // Create teacher document
                await setDoc(doc(db, "teachers", email.toLowerCase()), {
                    name: name || email.split('@')[0],
                    email: email.toLowerCase(),
                    role: 'teacher',
                    createdAt: serverTimestamp(),
                    status: 'pending'
                });

                try {
                    await sendEmailVerification(user);
                } catch (verificationError) {
                    console.error("Failed to send verification email", verificationError);
                }

                setError("APPLICATION_RECEIVED");
            } else {
                const result = await signInWithEmail(email, password, true);
                user = result.user;
                await checkAndRedirectTeacher(user);
            }
        } catch (err) {
            console.error("Email Auth Error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Try signing in.");
            } else if (err.code === 'auth/wrong-password') {
                setError("Incorrect password.");
            } else {
                setError(err.message || "Authentication failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const checkAndRedirectTeacher = async (user) => {
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
            if (activeTab === "register") {
                await setDoc(doc(db, "teachers", user.email.toLowerCase()), {
                    name: user.displayName || name || "New Educator",
                    email: user.email.toLowerCase(),
                    photoURL: user.photoURL || null,
                    role: 'teacher',
                    createdAt: serverTimestamp(),
                    status: 'pending'
                });
                setError("APPLICATION_RECEIVED");
            } else {
                setError("NO_ACCOUNT");
            }
        }
    };

    const getStatusDisplay = () => {
        if (error === "PENDING_REVIEW") return {
            icon: <FaClock className="text-2xl" />,
            title: "Pending Approval",
            message: "Your educator application is under review. The Super Admin will approve your access shortly.",
            bg: "bg-amber-500/5",
            border: "border-amber-500/20",
            iconColor: "text-amber-400",
            titleColor: "text-amber-400"
        };
        if (error === "ACCESS_SUSPENDED") return {
            icon: <FaBan className="text-2xl" />,
            title: "Access Suspended",
            message: "Your access has been suspended by the Super Admin. Contact support if you believe this is an error.",
            bg: "bg-rose-500/5",
            border: "border-rose-500/20",
            iconColor: "text-rose-400",
            titleColor: "text-rose-400"
        };
        if (error === "APPLICATION_RECEIVED") return {
            icon: <FaCheckCircle className="text-2xl" />,
            title: "Registration Successful!",
            message: "Your application has been submitted. The Super Admin will review and approve your account.",
            bg: "bg-emerald-500/5",
            border: "border-emerald-500/20",
            iconColor: "text-emerald-400",
            titleColor: "text-emerald-400"
        };
        if (error === "NO_ACCOUNT") return {
            icon: <FaUserPlus className="text-2xl" />,
            title: "Account Not Found",
            message: "No teacher account found for this email. Switch to the Register tab to apply.",
            bg: "bg-blue-500/5",
            border: "border-blue-500/20",
            iconColor: "text-blue-400",
            titleColor: "text-blue-400"
        };
        return null;
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/8 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] relative">

                    {/* Home Button */}
                    <button
                        onClick={() => router.push("/")}
                        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black uppercase tracking-[2px] text-[9px] transition-colors z-20"
                    >
                        <FaHome /> Home
                    </button>

                    {/* Icon + Title */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-5">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl" />
                                <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-2xl shadow-indigo-900/40">
                                    <FaChalkboardTeacher />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-1 tracking-tight">Educator Portal</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {activeTab === "login" ? "Sign in to access your dashboard" : "Register to become an educator"}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-slate-950 rounded-2xl p-1.5 mb-8 border border-slate-800">
                        <button
                            onClick={() => { setActiveTab("login"); setError(""); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all duration-300 ${activeTab === "login"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <FaSignInAlt className="text-xs" />
                            Sign In
                        </button>
                        <button
                            onClick={() => { setActiveTab("register"); setError(""); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all duration-300 ${activeTab === "register"
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <FaUserPlus className="text-xs" />
                            Register
                        </button>
                    </div>

                    {/* Status Messages */}
                    <AnimatePresence mode="wait">
                        {statusDisplay && (
                            <motion.div
                                key={error}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`p-5 rounded-2xl mb-6 border ${statusDisplay.bg} ${statusDisplay.border}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-0.5 ${statusDisplay.iconColor}`}>{statusDisplay.icon}</div>
                                    <div>
                                        <h3 className={`${statusDisplay.titleColor} font-black text-base mb-1`}>{statusDisplay.title}</h3>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{statusDisplay.message}</p>
                                        {error === "NO_ACCOUNT" && (
                                            <button
                                                onClick={() => { setActiveTab("register"); setError(""); }}
                                                className="mt-3 text-blue-400 text-xs font-black flex items-center gap-1 hover:text-blue-300 transition-colors uppercase tracking-widest"
                                            >
                                                Go to Register <FaArrowRight className="text-[8px]" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && !statusDisplay && (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex gap-3 items-center font-bold text-sm mb-6 text-rose-500">
                            <FaLock className="flex-shrink-0" />
                            <span className="text-xs">{error}</span>
                        </div>
                    )}

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={handleEmailAuth} className="space-y-5">
                                {activeTab === "register" && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                <FaSignInAlt className="text-xs" />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all font-semibold placeholder:text-slate-600"
                                                placeholder="Dr. Jane Smith"
                                                required={activeTab === "register"}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                            <FaSignInAlt className="text-xs" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all font-semibold placeholder:text-slate-600"
                                            placeholder="educator@school.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                            <FaLock className="text-xs" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all font-semibold placeholder:text-slate-600"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-16 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 ${activeTab === "login"
                                        ? "bg-indigo-600 shadow-indigo-900/40 hover:bg-indigo-500"
                                        : "bg-emerald-600 shadow-emerald-900/40 hover:bg-emerald-500"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {activeTab === "login" ? "Enter Educator Dashboard" : "Submit Educator Application"}
                                            <FaArrowRight className="text-xs" />
                                        </>
                                    )}
                                </button>

                                <div className="relative my-8 text-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-800"></div>
                                    </div>
                                    <span className="relative bg-[#0b1120] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Or continue with</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full h-16 bg-white rounded-2xl font-black text-slate-800 shadow-xl transition-all flex items-center justify-center gap-3 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    <FcGoogle className="text-2xl" />
                                    Sign in with Google
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[2px]">
                            Need help?
                            <a href="mailto:support@kidsportal.com" className="text-indigo-500 ml-2 hover:underline">Contact Support</a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
