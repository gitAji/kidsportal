"use client";
import React from 'react';
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/footer/Footer";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserLock, FaDatabase, FaEye, FaHandshake, FaEdit, FaLock } from 'react-icons/fa';

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${color} text-white`}>
      <Icon />
    </div>
    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-[1px]">{title}</h2>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-slate-900">
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[2px] mb-6">
                <FaLock /> Security First
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Policy</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                Your trust is our foundation. Learn how we safeguard your family&apos;s digital adventures with world-class security.
              </p>
              <div className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">
                Last Updated: March 1, 2026
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
              className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-16 overflow-hidden relative"
            >
              {/* Introduction */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaShieldAlt} title="1. Introduction" color="bg-blue-600" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  Welcome to KidsPortal (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting the privacy of all our users, especially children. This Privacy Policy outlines how we collect, use, and protect your personal information and the rights you have concerning it. This policy is designed to comply with the <strong className="text-slate-900">Children&apos;s Online Privacy Protection Act (COPPA)</strong> and the <strong className="text-slate-900">General Data Protection Regulation (GDPR)</strong>.
                </p>
              </div>

              {/* Information Collection */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaDatabase} title="2. Information We Collect" color="bg-indigo-600" />

                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> For Parents/Guardians
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-slate-600 text-sm">
                        <strong className="text-slate-800 shrink-0">Account Information:</strong>
                        <span>Name, email address, and encrypted credentials.</span>
                      </li>
                      <li className="flex gap-3 text-slate-600 text-sm">
                        <strong className="text-slate-800 shrink-0">Payment:</strong>
                        <span>Processed via secure gateways; we never store card numbers.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span> For Children
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-slate-600 text-sm">
                        <strong className="text-slate-800 shrink-0">Profile ID:</strong>
                        <span>Anonymous usernames and avatars only. No real names required.</span>
                      </li>
                      <li className="flex gap-3 text-slate-600 text-sm">
                        <strong className="text-slate-800 shrink-0">Progress:</strong>
                        <span>Lessons, rewards, and learning metrics for parent reporting.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Usage */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaEye} title="3. How We Use Data" color="bg-emerald-600" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Personalizing the learning adventure",
                    "Generating progress reports for parents",
                    "Improving educational game mechanics",
                    "Ensuring account & platform security",
                    "Managing active subscriptions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl text-emerald-800 text-sm font-bold">
                      <FaEdit className="text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parental Rights */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaHandshake} title="4. Parental Rights" color="bg-amber-600" />
                <p className="text-slate-600 leading-relaxed mb-6">
                  As a parent or guardian, you maintain complete sovereignty over your family&apos;s data. You have the right to:
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <span className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest">Review Info</span>
                  <span className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest">Request Deletion</span>
                  <span className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest">Refuse Processing</span>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center">
                  <p className="text-slate-400 mb-4 font-bold text-sm">Need help with your data data?</p>
                  <a href="mailto:privacy@kidsportal.com" className="inline-block px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-amber-400 transition-all">
                    Contact Privacy Team
                  </a>
                </div>
              </div>

              {/* Security */}
              <div className="mb-16 border-b border-slate-50 pb-16">
                <SectionHeader icon={FaUserLock} title="5. Data Security" color="bg-rose-600" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  We use military-grade encryption (AES-256) to protect your information at rest and SSL/TLS during transit. Our systems are monitored 24/7 to ensure the highest level of safety for our young learners.
                </p>
              </div>

              {/* Changes */}
              <div>
                <SectionHeader icon={FaEdit} title="6. Policy Changes" color="bg-slate-600" />
                <p className="text-slate-600 leading-relaxed">
                  We may update this Privacy Policy as we introduce new features. We will notify you of any significant changes via your registered parent email. Your continued use of the platform constitutes acceptance of the new terms.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
