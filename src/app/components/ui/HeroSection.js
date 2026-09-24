"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaPlusCircle, FaBookOpen, FaHeart, FaShieldAlt } from "react-icons/fa";

const HIGHLIGHTS = [
    {
        icon: FaBookOpen,
        title: "Complete K-10 Curriculum",
        items: "Math  •  Science  •  English  •  Tamil  •  Coding",
        accent: "text-blue-600",
    },
    {
        icon: FaHeart,
        title: "Loved by Parents & Kids",
        items: "10,000+ families  •  4.9/5 rating",
        accent: "text-rose-500",
    },
    {
        icon: FaShieldAlt,
        title: "Safe, Fun & Interactive",
        items: "AI Tutor  •  Games & Rewards  •  Zero Ads",
        accent: "text-emerald-600",
    },
];

// A rounded card with a few overlapping circles peeking above its top edge —
// same color as the card, so they read as one soft "cloud" silhouette.
function CloudCard({ icon: Icon, title, items, accent }) {
    return (
        <div className="relative pt-3 h-full">
            <div className="absolute -top-1 left-5 w-9 h-9 bg-white rounded-full hidden sm:block" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full hidden sm:block" />
            <div className="absolute -top-1 right-5 w-9 h-9 bg-white rounded-full hidden sm:block" />

            <div className="relative z-10 bg-white rounded-[1.75rem] shadow-lg shadow-blue-100 border border-blue-50 px-5 py-6 sm:px-6 text-center h-full">
                <Icon className={`text-2xl sm:text-3xl mx-auto mb-3 ${accent}`} />
                <h3 className="font-black text-slate-800 text-base sm:text-lg mb-1">{title}</h3>
                <p className="text-slate-500 font-semibold text-xs sm:text-sm leading-relaxed">{items}</p>
            </div>
        </div>
    );
}

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
        <section className="relative bg-gradient-to-b from-blue-50 via-blue-50 to-white py-14 sm:py-20 md:py-24 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
                <div className="absolute top-1/3 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

                <motion.div
                    animate={{ y: ["-15px", "15px"], rotate: [-2, 2] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute top-10 left-[6%] text-6xl drop-shadow-xl hidden sm:block"
                >
                    🎈
                </motion.div>

                <motion.div
                    animate={{ y: ["10px", "-10px"], x: ["-5px", "5px"], rotate: [-5, 5] }}
                    transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-12 left-[4%] text-6xl drop-shadow-xl hidden sm:block"
                >
                    🛴
                </motion.div>

                <motion.div
                    animate={{ y: ["-12px", "12px"], rotate: [3, -3] }}
                    transition={{ duration: 6.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-14 right-[6%] text-6xl drop-shadow-xl hidden sm:block"
                >
                    ✈️
                </motion.div>

                <motion.div
                    animate={{ y: ["8px", "-8px"] }}
                    transition={{ duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.5 }}
                    className="absolute bottom-10 right-[5%] text-5xl drop-shadow-xl hidden sm:block"
                >
                    ⭐
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
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest mb-5 border border-blue-200">
                                Welcome Back
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">
                                Hey <span className="text-blue-600">{user.displayName || "Explorer"}</span>, ready to continue?
                            </h1>
                            <p className="text-base sm:text-lg text-slate-600 mb-8 font-medium">
                                Your children are making great progress! Jump back into your dashboard to see recent achievements or manage profiles.
                            </p>
                            <Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 sm:px-12 sm:py-5 rounded-3xl font-black text-lg sm:text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all">
                                <FaRocket /> Enter Dashboard
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="public"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest mb-5 border border-blue-200">
                                The Ultimate Learning Portal
                            </div>
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">
                                KidsPortal <span className="font-normal text-slate-400">is</span> <span className="text-blue-600">fun learning</span>
                            </h1>
                            <p className="text-base sm:text-lg text-slate-600 mb-9 sm:mb-10 font-medium max-w-2xl mx-auto">
                                Explore exciting games, interactive tasks, and expert curriculum that make learning an adventure your child will love.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 mb-9 sm:mb-10 max-w-3xl mx-auto">
                                {HIGHLIGHTS.map((h) => (
                                    <CloudCard key={h.title} {...h} />
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                                <Link href="/register" className="w-full sm:w-auto bg-yellow-400 text-slate-900 px-10 py-5 rounded-3xl font-black text-lg shadow-xl shadow-yellow-100 hover:bg-yellow-500 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    <FaPlusCircle /> Get Started Free
                                </Link>
                                <Link href="#gradesCard" scroll={true} className="w-full sm:w-auto bg-white text-blue-600 border border-blue-100 px-10 py-5 rounded-3xl font-black text-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    Explore Now
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-sm">
                                <span className="text-yellow-400 text-lg">★★★★★</span>
                                <span>Loved by 10,000+ families</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
