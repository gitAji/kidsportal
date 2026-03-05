"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUserGraduate, FaUsers, FaArrowRight, FaLock, FaEnvelope, FaKey, FaHome, FaChalkboardTeacher
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
    signInWithEmail, signInWithGoogle
} from "@/firebase/auth";
import { auth, db } from "@/firebase/config";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import CustomAvatar from "@/app/components/ui/CustomAvatar";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center p-8"><div className="w-full max-w-4xl"><SkeletonLoader variant="page" message="Loading login..." /></div></div>}>
            <UnifiedLoginPage />
        </Suspense>
    );
}

function UnifiedLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeRole, setActiveRole] = useState("parent"); // parent, student
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // For students
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);

    // Roles Configuration
    const roles = [
        { id: 'parent', title: 'Parent Portal', icon: <FaUsers />, color: 'blue', desc: 'Family Dashboard' },
        { id: 'student', title: 'Student Zone', icon: <FaUserGraduate />, color: 'emerald', desc: 'Learning Area' },
    ];

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If logged in, redirect to dashboard (actual routing handled by layout/guards)
            }
            setVerifying(false);
        });
        const role = searchParams.get('role');
        if (role && roles.map(r => r.id).includes(role)) {
            setActiveRole(role);
        }
        return () => unsub();
    }, [searchParams]);

    const handleAuth = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (activeRole === 'student') {
                await loginAsStudent();
            } else {
                await signInWithEmail(email, password);
                router.push("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loginAsStudent = async () => {
        if (!username || !password) throw new Error("Please enter both username and password.");
        try {
            const res = await fetch("/api/child-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.toLowerCase(), password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed.");

            localStorage.setItem("childUser", JSON.stringify(data.child));
            router.push("/learning-zone");
        } catch (err) {
            console.error("Student Login Error:", err);
            throw err;
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                    <SkeletonLoader variant="page" message="Checking your session..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Logo in top left */}
            <div className="absolute top-8 left-8 z-50">
                <Link href="/">
                    <div className="relative w-[200px] h-[60px] transition-transform hover:scale-105 active:scale-95">
                        <Image
                            src="/logo.png"
                            alt="KidsPortal"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>
            </div>

            {/* Background Decorations - Light Theme */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* ── Left Side: Identity Selector ── */}
                <div className="space-y-8">
                    <div>
                        <motion.button
                            onClick={() => router.push("/")}
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[11px] mb-12 transition-colors"
                        >
                            <FaHome /> Back to home
                        </motion.button>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                            Pick your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">destination.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-md">
                            Welcome back! Choose your account type to continue your learning journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => { setActiveRole(role.id); setError(""); }}
                                className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-left group relative overflow-hidden ${activeRole === role.id
                                    ? `bg-white border-blue-500 shadow-2xl shadow-blue-500/10`
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300 ${activeRole === role.id
                                    ? `bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg`
                                    : `bg-white text-slate-400 group-hover:text-blue-500`
                                    }`}>
                                    {role.icon}
                                </div>
                                <h3 className={`font-black text-xl mb-1 transition-colors ${activeRole === role.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {role.title}
                                </h3>
                                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-500 transition-colors">
                                    {role.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Right Side: Premium Unified Form ── */}
                <motion.div
                    key={activeRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative"
                >
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <span className="text-blue-500 font-black uppercase tracking-[3px] text-[10px] mb-2 block">Authenticating as</span>
                            <h2 className="text-3xl font-black text-slate-900 capitalize">{activeRole}</h2>
                        </div>
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600">
                            {roles.find(r => r.id === activeRole)?.icon}
                        </div>
                    </div>

                    {error === "TEACHER_PROHIBITED" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mb-8"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-xl text-amber-600 flex-shrink-0">
                                    <FaChalkboardTeacher />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-amber-900 font-black text-base mb-1">Educator portal required</h4>
                                    <p className="text-amber-800/70 text-sm font-medium leading-relaxed mb-4">
                                        Your account is registered as a Teacher. Please use our dedicated educator portal for management features.
                                    </p>
                                    <button
                                        onClick={() => router.push('/teacher-admin/login')}
                                        className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        Go to Educator Login <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-8 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                                <FaLock size={14} />
                            </div>
                            <span className="text-rose-600 text-sm font-bold">{error}</span>
                        </motion.div>
                    ) : null}

                    <form onSubmit={handleAuth} className="space-y-6">
                        {activeRole === 'student' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Username</label>
                                    <div className="relative">
                                        <FaUserGraduate className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                            placeholder="e.g. leo123"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Password</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                            placeholder="Your secret password"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                            placeholder="parent@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Secure Password</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-black text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign in to {activeRole === 'student' ? 'Learning Zone' : 'Parent Portal'}</span>
                                        <FaArrowRight className="text-sm" />
                                    </>
                                )}
                            </button>

                            {activeRole === 'parent' && (
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <FcGoogle className="text-2xl" />
                                    Continue with Google
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-400 font-bold">
                            {activeRole === 'parent' ? "New to the portal?" : "Having trouble logging in?"}
                            {activeRole === 'parent' ? (
                                <button onClick={() => router.push("/register")} className="text-blue-600 ml-2 hover:underline">Create an account</button>
                            ) : (
                                <a href="mailto:support@kidsportal.com" className="text-blue-600 ml-2 hover:underline">Get help</a>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
