"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaRocket, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";


export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [countdown, setCountdown] = useState(5);
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 5;

        async function verify() {
            if (!sessionId || !isMounted) return;

            try {
                // Ensure we have a UID if possible, but the API can often recover it from session metadata
                const uid = auth.currentUser?.uid;

                const res = await fetch("/api/stripe/verify-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, uid }),
                });
                const data = await res.json();

                if (isMounted) {
                    if (data.success) {
                        setStatus("success");
                    } else if (retryCount < maxRetries) {
                        retryCount++;
                        // Incremental backoff: 2s, 4s, 6s...
                        setTimeout(verify, 2000 * retryCount);
                    } else {
                        setStatus("error");
                    }
                }
            } catch (err) {
                console.error("Verification failed", err);
                if (isMounted && retryCount >= maxRetries) {
                    setStatus("error");
                } else if (isMounted) {
                    retryCount++;
                    setTimeout(verify, 3000);
                }
            }
        }

        // Wait a small bit for Firebase Auth to potentially initialize
        const timeout = setTimeout(() => {
            verify();
        }, 1000);

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [sessionId]);

    useEffect(() => {
        if (status !== "success") return;

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
    }, [status, router]);

    if (status === "verifying") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Verifying your payment...</h2>
                <p className="text-slate-400 text-sm mt-2">Connecting to Stripe to confirm your premium status.</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
                <FaCheckCircle className="text-amber-400 text-6xl mb-6 opacity-20" />
                <h1 className="text-2xl font-black text-slate-800 mb-2">Almost there!</h1>
                <p className="text-slate-500 max-w-sm">We couldn&apos;t confirm your payment instantly, but it&apos;s likely being processed. Check your dashboard in a minute.</p>
                <Link href="/dashboard" className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-xl font-bold">Go to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
            <div className="absolute top-20 left-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 max-w-md w-full text-center"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-300/40">
                    <FaCheckCircle className="text-white text-4xl" />
                </div>

                <h1 className="text-3xl font-black text-slate-800 mb-3">Welcome to Premium! 🎉</h1>
                <p className="text-slate-500 mb-6 font-medium">Your subscription is now active. All features are unlocked for your family.</p>

                <div className="bg-blue-50 rounded-2xl p-4 mb-8 flex items-center gap-3">
                    <FaRocket className="text-blue-500 text-2xl flex-shrink-0" />
                    <p className="text-sm text-slate-600 font-medium text-left">
                        Redirecting to your dashboard in <span className="font-black text-blue-600">{countdown}s</span>...
                    </p>
                </div>

                <Link href="/dashboard" className="inline-block w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                    Access Dashboard Now
                </Link>
            </motion.div>
        </div>
    );
}
