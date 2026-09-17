"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaChartLine, FaPlusCircle } from "react-icons/fa";

export default function HeroSection() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <section className="relative bg-gradient-to-b from-blue-50 via-blue-50 to-white py-20 md:py-28 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
                <div className="absolute top-1/2 -left-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

                <motion.div
                    animate={{ y: ["-15px", "15px"], rotate: [-2, 2] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute top-10 left-[6%] text-6xl sm:text-7xl drop-shadow-xl"
                >
                    🎈
                </motion.div>

                <motion.div
                    animate={{ y: ["10px", "-10px"], x: ["-5px", "5px"], rotate: [-5, 5] }}
                    transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-12 left-[4%] text-6xl sm:text-7xl drop-shadow-xl hidden sm:block"
                >
                    🛴
                </motion.div>
            </div>

            <div className="container mx-auto relative z-10 px-4">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div key="loading" className="h-40" />
                    ) : user ? (
                        <motion.div
                            key="logged-in"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                                Welcome back, <span className="text-blue-600">{user.displayName || "Explorer"}</span>!
                            </h1>
                            <p className="text-lg text-slate-600 mb-10 font-medium">
                                Your children are making great progress! Jump back into your dashboard to see recent achievements or manage profiles.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/dashboard" className="w-full sm:w-auto bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                    <FaRocket /> Enter Dashboard
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="public"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid md:grid-cols-2 gap-12 md:gap-8 items-center max-w-6xl mx-auto"
                        >
                            {/* Left: Copy + CTAs */}
                            <div className="text-center md:text-left">
                                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-blue-200">
                                    The Ultimate Learning Portal
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                    Welcome to a World of <span className="text-blue-600">Fun Learning!</span>
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 font-medium max-w-xl mx-auto md:mx-0">
                                    Explore exciting games, interactive tasks, and expert curriculum that make learning an adventure your child will love.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                                    <Link href="#gradesCard" scroll={true} className="w-full sm:w-auto bg-yellow-400 text-slate-900 px-10 py-5 rounded-3xl font-black text-lg shadow-xl shadow-yellow-100 hover:bg-yellow-500 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                        Explore Now
                                    </Link>
                                    <Link href="/register" className="w-full sm:w-auto bg-white text-blue-600 border border-blue-100 px-10 py-5 rounded-3xl font-black text-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                        <FaPlusCircle /> Get Started Free
                                    </Link>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-bold text-sm">
                                    <span className="text-yellow-400 text-lg">★★★★★</span>
                                    <span>Loved by 10,000+ families</span>
                                </div>
                            </div>

                            {/* Right: Illustration */}
                            <div className="relative w-full mx-auto max-w-md md:max-w-none">
                                <motion.div
                                    animate={{ y: ["-8px", "8px"] }}
                                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                    className="relative w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-blue-200/60 aspect-[4/3]"
                                >
                                    <Image src="/images/intro.png" alt="Kids learning together on KidsPortal" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
                                </motion.div>

                                <motion.div
                                    animate={{ y: ["6px", "-6px"], rotate: [-3, 3] }}
                                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                    className="absolute -top-8 -right-6 w-28 sm:w-36 drop-shadow-xl"
                                >
                                    <Image src="/images/rainbow.png" alt="" width={500} height={400} className="w-full h-auto" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: ["-10px", "10px"] }}
                                    transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 border border-slate-100"
                                >
                                    <span className="text-2xl">🏆</span>
                                    <div className="text-left leading-tight">
                                        <p className="text-sm font-black text-slate-800">4.9/5 rating</p>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">from parents</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
