"use client";
import { useState } from "react";
import { signUpWithEmail, signInWithGoogle } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaHome, FaCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agreed) {
            setError("You must agree to the Terms of Service.");
            return;
        }

        setLoading(true);
        try {
            await signUpWithEmail(email, password, name);
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setError("");
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

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 pt-20 lg:pt-0">
                {/* ── Left Side: Content ── */}
                <div className="hidden lg:block space-y-8">
                    <motion.button
                        onClick={() => router.push("/")}
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[11px] mb-12 transition-colors"
                    >
                        <FaHome /> Back to home
                    </motion.button>
                    <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
                        Start your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">learning adventure.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-md italic">
                        "The best way to predict the future is to create it. Join thousands of families today."
                    </p>

                    <div className="space-y-4 pt-4">
                        {[
                            "Access to 360+ levels",
                            "Real-time progress tracking",
                            "Certified educator curriculum",
                            "Safe & secure environment"
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                                <FaCheckCircle className="text-blue-500" />
                                <span>{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right Side: Registration Form ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative w-full"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <span className="text-blue-500 font-black uppercase tracking-[3px] text-[10px] mb-2 block">Create Account</span>
                        <h2 className="text-3xl font-black text-slate-900">Join KidsPortal</h2>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 items-center text-red-600 font-bold text-sm mb-8 italic">
                            <FaLock className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleEmailRegister} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

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
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Confirm</label>
                                <div className="relative">
                                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 mt-1 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <span className="text-xs text-slate-500 leading-relaxed font-medium">
                                    I agree to the <Link href="/terms" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
                                </span>
                            </label>
                        </div>

                        <div className="pt-2 space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-black text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <FaArrowRight className="text-sm" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                disabled={loading}
                                className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] disabled:opacity-50"
                            >
                                <FcGoogle className="text-2xl" />
                                Sign up with Google
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-400 font-bold">
                            Already have an account?
                            <button onClick={() => router.push("/login")} className="text-blue-600 ml-2 hover:underline">Login here</button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
