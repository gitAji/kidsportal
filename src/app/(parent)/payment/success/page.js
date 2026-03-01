"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaRocket } from "react-icons/fa";
import Link from "next/link";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/dashboard");
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
            {/* Orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-300/40"
                >
                    <FaCheckCircle className="text-white text-4xl" />
                </motion.div>

                <h1 className="text-3xl font-black text-slate-800 mb-3">
                    Payment Successful! 🎉
                </h1>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    Welcome to <span className="font-bold text-blue-600">Premium</span>! Your subscription is now active and all features are unlocked.
                </p>

                <div className="bg-blue-50 rounded-2xl p-4 mb-8 flex items-center gap-3">
                    <FaRocket className="text-blue-500 text-2xl flex-shrink-0" />
                    <p className="text-sm text-slate-600 font-medium text-left">
                        Redirecting you to your dashboard in <span className="font-black text-blue-600">{countdown}s</span>...
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="inline-block w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    Go to Dashboard Now
                </Link>
            </motion.div>
        </div>
    );
}
