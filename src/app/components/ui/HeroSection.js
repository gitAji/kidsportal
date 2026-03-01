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
        <section className="relative bg-blue-50 py-24 min-h-[500px] flex items-center overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
                <Image src="/images/intro.png" alt="Hero Background" fill className="object-cover opacity-30" priority />

                <motion.div
                    animate={{ y: ["-15px", "15px"], rotate: [-2, 2] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute top-12 left-[10%] text-7xl sm:text-8xl drop-shadow-2xl"
                >
                    🎈
                </motion.div>

                <motion.div
                    animate={{ y: ["10px", "-10px"], x: ["-5px", "5px"], rotate: [-5, 5] }}
                    transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-16 left-[5%] text-7xl sm:text-8xl drop-shadow-2xl"
                >
                    🛴
                </motion.div>

                <motion.div
                    animate={{ y: ["-10px", "20px"], x: ["-10px", "10px"] }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
                    className="absolute top-24 right-[15%] text-7xl sm:text-8xl drop-shadow-2xl"
                >
                    🚁
                </motion.div>

                <motion.div
                    animate={{ y: ["20px", "-15px"], rotate: [0, 10] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-[45%] right-[5%] text-7xl sm:text-8xl drop-shadow-2xl"
                >
                    ☁️🌈
                </motion.div>

                <div className="absolute bottom-[-20px] left-[-20px] w-64 h-32 opacity-20">
                    <Image src="/images/rainbow.png" alt="Rainbow" width={256} height={128} />
                </div>
            </div>

            <div className="container mx-auto text-center relative z-10 px-4">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div key="loading" className="h-40" />
                    ) : user ? (
                        <motion.div
                            key="logged-in"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-3xl mx-auto"
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
                            className="max-w-3xl mx-auto"
                        >
                            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-blue-200">
                                The Ultimate Learning Portal
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                Welcome to a World of <span className="text-blue-600">Fun Learning!</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-10 font-medium max-w-xl mx-auto">
                                Explore exciting games, interactive tasks, and expert curriculum that make learning an adventure your child will love.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="#gradesCard" scroll={true} className="w-full sm:w-auto bg-yellow-400 text-slate-900 px-10 py-5 rounded-3xl font-black text-lg shadow-xl shadow-yellow-100 hover:bg-yellow-500 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    Explore Now
                                </Link>
                                <Link href="/register" className="w-full sm:w-auto bg-white text-blue-600 border border-blue-100 px-10 py-5 rounded-3xl font-black text-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    <FaPlusCircle /> Get Started Free
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
