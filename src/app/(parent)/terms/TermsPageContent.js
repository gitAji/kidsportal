"use client";
import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFileContract, FaUserCheck, FaCreditCard, FaCopyright, FaBan, FaEnvelope, FaGavel, FaShieldAlt, FaExternalLinkAlt } from 'react-icons/fa';

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
    <div className="bg-slate-50 font-sans">
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
              Valid from: March 1, 2026 &middot; Last updated: October 31, 2026
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

            {/* Account Sharing & Access Monitoring */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaShieldAlt} title="3. One Family, One Account" color="bg-emerald-600" />
              <p className="text-slate-600 leading-relaxed text-lg">
                Your account — and every child login within it, including the Learning Zone — is licensed for the exclusive use of your own household. You may not share your parent credentials, PIN, or any child&apos;s Learning Zone login with anyone outside your family, and no one other than your own children may use a child profile to access the Learning Zone.
              </p>
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mt-6">
                <ul className="space-y-3 text-slate-700 text-sm font-bold">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    <span>We monitor the IP addresses used to log in to parent and child accounts, and we may block logins from other IP addresses or locations we flag as suspicious.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    <span>A child&apos;s Learning Zone profile should only ever be used from your registered household — it should not be logged into from a different place by a different person, or logged into from multiple separate locations.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    <span>Traveling or temporarily somewhere else? Contact us before you go so we can authorize the new location for your account. Logging in from an unapproved location without telling us may get that login blocked.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    <span>Accounts found to be shared with, or used by, anyone outside the registered family will be suspended or permanently blocked.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Subscriptions */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaCreditCard} title="4. Subscriptions & Payments" color="bg-blue-600" />
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
              <SectionHeader icon={FaCopyright} title="5. Digital Ownership" color="bg-amber-600" />
              <p className="text-slate-600 leading-relaxed text-lg italic">
                &quot;Every lesson is a treasure, every game is a masterpiece.&quot;
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                All content, characters, and educational materials are protected by international copyright laws and remain the exclusive property of KidsPortal. You may not copy, sell, or distribute our content without written consent.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaBan} title="6. Respectful Conduct" color="bg-rose-600" />
              <p className="text-slate-600 leading-relaxed text-lg">
                We maintain a safe harbor for children. We reserve the right to suspend any account that engages in harmful, fraudulent, or inappropriate behavior that compromises the safety of our community.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaExternalLinkAlt} title="7. Third-Party Links" color="bg-cyan-600" />
              <p className="text-slate-600 leading-relaxed text-lg">
                Our site may link out to third-party websites or services that are not owned or controlled by KidsPortal. Each of those sites has its own terms and conditions and its own privacy policy, which are separate from ours and are not something we write or control.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                If you choose to visit or use a linked third-party site, you do so at your own discretion and must follow that site&apos;s own terms and conditions. We are not responsible for the content, policies, or practices of any third-party site, and including a link does not mean we endorse it.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-indigo-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
              <div className="relative z-10">
                <SectionHeader icon={FaEnvelope} title="8. Get in Touch" color="bg-white text-indigo-900" />
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
    </div>
  );
}
