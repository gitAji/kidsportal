"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserShield, FaChild, FaLock, FaUserLock, FaDatabase, FaEye, FaHandshake, FaCheckCircle, FaStar } from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';
import Link from 'next/link';

const SafetyFeature = ({ icon: Icon, title, desc, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-50 transition-all hover:shadow-blue-500/10 hover:-translate-y-1"
    >
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-lg shadow-current/10`}>
            <Icon />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight uppercase tracking-wider">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
);

export default function SafetyHubPage() {
    return (
        <div className="bg-slate-50 font-sans">
            {/* ── Hero ── */}
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_50%)]" />
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-600 rounded-full blur-[140px] opacity-20" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-20" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[3px] mb-8">
                            <FaShieldAlt className="text-xs" /> Certified Safety Harbor
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
                            Your Child&apos;s Safety <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400">Our #1 Priority.</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                            We&apos;ve built more than a portal—we&apos;ve built a fortress for young minds. Explore our safety standards and parent guarantees.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Core Commitments ── */}
            <section className="py-24 relative z-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        <SafetyFeature
                            icon={FaEye}
                            title="100% Ad-Free"
                            desc="No distractions. No manipulative marketing. We don't sell attention; we foster learning."
                            color="bg-emerald-50 text-emerald-600"
                        />
                        <SafetyFeature
                            icon={FaUserLock}
                            title="No Unmoderated Chat"
                            desc="Children cannot communicate with strangers. Our platform is a closed learning loop."
                            color="bg-blue-50 text-blue-600"
                        />
                        <SafetyFeature
                            icon={FaShieldAlt}
                            title="COPPA Compliant"
                            desc="Exceeding industry standards for children's online privacy and data protection."
                            color="bg-indigo-50 text-indigo-600"
                        />
                    </div>

                    {/* ── Detailed Commitments ── */}
                    <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-slate-200 border border-slate-100 grid lg:grid-cols-5 gap-16 items-center">
                        <div className="lg:col-span-3">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-8 tracking-tight">Parental Sovereignty</h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                                We believe you should have total command over your family&apos;s digital experience. At any time, you can:
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Audit all activity and learning sessions",
                                    "Request complete data deletion instantly",
                                    "Customize profiles without using real names",
                                    "Restrict access to specific subjects or levels",
                                    "Export detailed progress to use outside the portal"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-slate-700 font-bold">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                                            <FaCheckCircle />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-center relative overflow-hidden group">
                                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-blue-500/10 blur-[100px] transition-all group-hover:bg-blue-500/20" />
                                <div className="relative z-10">
                                    <FaDatabase className="text-6xl text-blue-500 mb-6 mx-auto animate-pulse" />
                                    <h4 className="text-white font-black text-2xl mb-4">Encrypted Store</h4>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                        All data is protected by AES-256 bank-level encryption. Your family&apos;s data is as secure as a digital vault.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stripe Security (Recurring Theme) ── */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-blue-50 p-12 rounded-[3.5rem] border border-blue-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 text-blue-200 opacity-20 pointer-events-none transition-transform group-hover:scale-125 duration-700">
                                <SiStripe size={200} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-left">
                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl text-blue-600 shadow-xl shadow-blue-500/10 shrink-0">
                                    <SiStripe />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase">PCI-DSS Compliant Payments</h3>
                                    <p className="text-slate-600 text-lg font-medium leading-relaxed mb-6">
                                        We never store your credit card details. All financial transactions are handled securely by Stripe—the world&apos;s most trusted payment gateway.
                                    </p>
                                    <div className="flex gap-4">
                                        <span className="px-5 py-2.5 bg-white text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-blue-100">Secured with SSL</span>
                                        <span className="px-5 py-2.5 bg-white text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-blue-100">No Data Storage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-24 bg-slate-900 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">Enter The Safe Haven.</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/register" className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">
                            Join Now Securely
                        </Link>
                        <Link href="/help" className="w-full sm:w-auto px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
                            Ask about Safety
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
