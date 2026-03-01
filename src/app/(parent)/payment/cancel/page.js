"use client";
import { motion } from "framer-motion";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
            <div className="absolute top-20 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 max-w-md w-full text-center"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-300/40">
                    <FaTimesCircle className="text-white text-4xl" />
                </div>

                <h1 className="text-3xl font-black text-slate-800 mb-3">Payment Cancelled</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    No worries — you haven&apos;t been charged. You can try again whenever you&apos;re ready.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/pricing"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        View Plans Again
                    </Link>
                    <Link
                        href="/dashboard"
                        className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-semibold py-3 transition-colors"
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
