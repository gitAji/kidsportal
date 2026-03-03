"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FaShieldAlt, FaLock, FaRegLifeRing,
    FaCcStripe, FaRegCreditCard, FaUserShield
} from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';

export default function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100 py-10">
            <div className="max-w-7xl mx-auto px-8">
                {/* ── Trust Indicators ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                            <SiStripe className="text-2xl" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-700 tracking-tight">Secured by Stripe</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                                All payments are handled by Stripe. Your credit card data never touches our servers.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
                            <FaLock className="text-xl" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-700 tracking-tight">256-bit SSL Encryption</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                                Your personal and billing information is protected by industry-standard bank-level security.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                            <FaUserShield className="text-xl" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-700 tracking-tight">Family-Safe Guarantee</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                                Trusted by thousands of parents across the UK. Zero ads, zero trackers, 100% human-verified content.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-slate-50 mb-10" />

                {/* ── Footer Bottom ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">About Story</Link>
                        <Link href="/safety" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Safety Hub</Link>
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms of Service</Link>
                    </div>


                    <div className="flex items-center gap-3 grayscale opacity-30">
                        <FaCcStripe className="text-2xl" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">PCI Compliant Payments</span>
                    </div>

                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        &copy; {currentYear} KidsPortal Limited. Registered in England.
                    </p>
                </div>
            </div>
        </footer>
    );
}
