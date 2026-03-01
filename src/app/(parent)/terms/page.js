"use client";
import React from 'react';
import Link from "next/link";
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/footer/Footer";
import { motion } from "framer-motion";
import { FaFileContract, FaUserCheck, FaCreditCard, FaCopyright, FaBan, FaEnvelope, FaGavel } from 'react-icons/fa';

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${color} text-white`}>
      <Icon />
    </div>
    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[1px]">{title}</h2>
  </div>
);

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[2px] mb-6">
                <FaGavel /> Rules of Adventure
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Service</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                Clear rules for a safe and inspiring community. By joining KidsPortal, you agree to follow these guidelines.
              </p>
              <div className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">
                Valid from: March 1, 2026
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 -mt-10 relative z-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-16 overflow-hidden"
            >
              {/* Agreement */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaFileContract} title="1. Your Agreement" color="bg-indigo-600" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  By using our services, you agree to these Terms of Service and our <Link href="/privacy" className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4">Privacy Policy</Link>. You must be at least 18 years old or have the express permission of a parent or guardian to manage an account on KidsPortal.
                </p>
              </div>

              {/* Registration */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaUserCheck} title="2. Account Security" color="bg-purple-600" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  You are the gatekeeper of your family&apos;s adventure. You are responsible for maintaining the confidentiality of your account credentials and PINs. All activities occurring under your account are your responsibility. If you suspect unauthorized access, contact us immediately.
                </p>
              </div>

              {/* Subscriptions */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaCreditCard} title="3. Subscriptions & Payments" color="bg-blue-600" />
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mb-6">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    We offer flexible monthly and yearly plans to fuel your child&apos;s curiosity. By selecting a premium plan, you agree to the associated fees.
                  </p>
                </div>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Secure Stripe-powered transactions",
                    "Cancel anytime from your dashboard",
                    "Automatic renewal for uninterrupted learning",
                    "No hidden fees or surprise charges"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Intellectual Property */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaCopyright} title="4. Digital Ownership" color="bg-amber-600" />
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  &quot;Every lesson is a treasure, every game is a masterpiece.&quot;
                </p>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  All content, characters, and educational materials are protected by international copyright laws and remain the exclusive property of KidsPortal. You may not copy, sell, or distribute our content without written consent.
                </p>
              </div>

              {/* Termination */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaBan} title="5. Respectful Conduct" color="bg-rose-600" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  We maintain a safe harbor for children. We reserve the right to suspend any account that engages in harmful, fraudulent, or inappropriate behavior that compromises the safety of our community.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-indigo-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                <div className="relative z-10">
                  <SectionHeader icon={FaEnvelope} title="6. Get in Touch" color="bg-white text-indigo-900" />
                  <p className="text-indigo-200 mb-8 font-medium">
                    Have questions about our rules or your rights? Our support team is here to help clarify anything.
                  </p>
                  <a href="mailto:support@kidsportal.com" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-100 transition-all">
                    Send to Support Team
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
