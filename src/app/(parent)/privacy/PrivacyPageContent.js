"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserLock, FaDatabase, FaEye, FaHandshake, FaEdit, FaLock, FaGlobeEurope, FaCookieBite, FaBalanceScale } from 'react-icons/fa';

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
    <div className="bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#eef6ff] via-[#f0f4ff] to-[#f5f0ff]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/40 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-violet-200/40 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 shadow-sm text-sky-600 text-[10px] font-black uppercase tracking-[2px] mb-6">
              <FaLock /> Security First
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500">Policy</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Your trust is our foundation. Learn how we safeguard your family&apos;s digital adventures with world-class security.
            </p>
            <div className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
              Last Updated: November 2, 2026
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
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                Welcome to KidsPortal (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting the privacy of all our users, especially children. This Privacy Policy outlines how we collect, use, and protect your personal information and the rights you have concerning it. This policy is designed to comply with the <strong className="text-slate-900">Children&apos;s Online Privacy Protection Act (COPPA)</strong>, the <strong className="text-slate-900">General Data Protection Regulation (GDPR)</strong> for users in the EU/EEA and UK, and equivalent data protection laws in the other regions we serve.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                KidsPortal is the data controller responsible for your personal information. You can reach us at any time at{" "}
                <a href="mailto:privacy@kidsportal.com" className="text-blue-600 font-bold hover:underline">privacy@kidsportal.com</a>.
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

            {/* Legal Basis */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaBalanceScale} title="3. Our Legal Basis for Processing" color="bg-purple-600" />
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Where GDPR applies, we only process personal data when we have a valid legal basis to do so:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-purple-50/60 rounded-2xl">
                  <strong className="block text-slate-800 text-sm mb-1">Consent</strong>
                  <span className="text-slate-600 text-sm">For a child&apos;s account, given by the parent or guardian who creates it, and for optional analytics cookies.</span>
                </div>
                <div className="p-5 bg-purple-50/60 rounded-2xl">
                  <strong className="block text-slate-800 text-sm mb-1">Contract</strong>
                  <span className="text-slate-600 text-sm">To create your account, run the learning platform, and process a Premium subscription you&apos;ve signed up for.</span>
                </div>
                <div className="p-5 bg-purple-50/60 rounded-2xl">
                  <strong className="block text-slate-800 text-sm mb-1">Legal Obligation</strong>
                  <span className="text-slate-600 text-sm">To keep records required for tax, billing, and fraud-prevention purposes.</span>
                </div>
                <div className="p-5 bg-purple-50/60 rounded-2xl">
                  <strong className="block text-slate-800 text-sm mb-1">Legitimate Interest</strong>
                  <span className="text-slate-600 text-sm">To keep the platform secure and reliable, in ways that don&apos;t override your rights.</span>
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaEye} title="4. How We Use Data" color="bg-emerald-600" />
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

            {/* Cookies */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaCookieBite} title="5. Cookies &amp; Analytics" color="bg-sky-600" />
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                We use essential cookies required for login and core site functionality &mdash; these can&apos;t be switched off, since the site can&apos;t work without them. We also use Google/Firebase Analytics to understand overall site usage, but <strong className="text-slate-900">only after you accept this in the cookie banner</strong> shown on your first visit. If you reject or ignore the banner, analytics never loads. You can change your choice at any time by clearing your browser&apos;s site data for KidsPortal.
              </p>
            </div>

            {/* Sharing & International Transfers */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaGlobeEurope} title="6. Who We Share Data With" color="bg-cyan-600" />
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                We never sell personal data. We share only what&apos;s necessary with the service providers who help us run KidsPortal, each acting under their own data-processing terms:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong className="block text-slate-800 text-sm mb-1">Google Firebase</strong>
                  <span className="text-slate-500 text-sm">Authentication, database, storage, and (with consent) analytics.</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong className="block text-slate-800 text-sm mb-1">Stripe</strong>
                  <span className="text-slate-500 text-sm">Payment processing for Premium subscriptions.</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong className="block text-slate-800 text-sm mb-1">Netlify</strong>
                  <span className="text-slate-500 text-sm">Website hosting and delivery.</span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Some of these providers may process data outside the EU/EEA or UK, including in the United States. Where that happens, we rely on their Standard Contractual Clauses or an equivalent, legally-recognised safeguard to protect your data to the same standard GDPR requires.
              </p>
            </div>

            {/* Retention */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaDatabase} title="7. How Long We Keep Data" color="bg-teal-600" />
              <p className="text-slate-600 leading-relaxed text-lg">
                We keep account and progress data for as long as your account is active, so your child&apos;s learning history isn&apos;t lost between sessions. If you delete your account (see your rights below), we delete your personal data within 30 days, except where we&apos;re legally required to keep certain records for longer (for example, billing records for tax purposes).
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaHandshake} title="8. Children's Privacy" color="bg-amber-600" />
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                KidsPortal is built around one rule: a child never creates their own account. A parent or guardian signs up first, and every child profile is created, managed, and consented to by that parent &mdash; this is how we satisfy both COPPA&apos;s verifiable-parental-consent requirement and GDPR Article 8, which requires a parent or guardian&apos;s consent for a child&apos;s data (the exact age this applies under varies by EU country, from 13 to 16; our parent-first model covers every one of those thresholds the same way).
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Child profiles use an anonymous username and avatar rather than the child&apos;s real name, and we don&apos;t knowingly collect more personal data from a child than is needed to run the learning platform.
              </p>
            </div>

            {/* Rights */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaUserLock} title="9. Your Rights" color="bg-rose-600" />
              <p className="text-slate-600 leading-relaxed mb-6">
                As a parent or guardian, you maintain complete sovereignty over your family&apos;s data. Subject to local law, you have the right to:
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  "Access your data", "Correct your data", "Delete your data",
                  "Restrict processing", "Object to processing", "Data portability",
                  "Withdraw consent",
                ].map((right) => (
                  <span key={right} className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest">{right}</span>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                You can delete your account and all associated data yourself at any time from{" "}
                <Link href="/profile" className="text-amber-700 font-bold hover:underline">Profile &rarr; Account Settings</Link>, or exercise any of the rights above by contacting us. We respond to all requests within 30 days.
              </p>
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center">
                <p className="text-slate-400 mb-4 font-bold text-sm">Need help with your data?</p>
                <a href="mailto:privacy@kidsportal.com" className="inline-block px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-amber-400 transition-all">
                  Contact Privacy Team
                </a>
              </div>
            </div>

            {/* Security */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaLock} title="10. Data Security" color="bg-rose-600" />
              <p className="text-slate-600 leading-relaxed text-lg">
                We use strong encryption (AES-256) to protect your information at rest and SSL/TLS during transit. Our systems are monitored to help keep our young learners&apos; data safe, though no system can be guaranteed 100% secure.
              </p>
            </div>

            {/* Changes */}
            <div className="mb-16 border-b border-slate-50 pb-16">
              <SectionHeader icon={FaEdit} title="11. Policy Changes" color="bg-slate-600" />
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy as we introduce new features. We will notify you of any significant changes via your registered parent email. Your continued use of the platform constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Contact & Complaints */}
            <div>
              <SectionHeader icon={FaShieldAlt} title="12. Contact Us &amp; Complaints" color="bg-blue-600" />
              <p className="text-slate-600 leading-relaxed text-lg">
                Questions about this policy or your data? Email us at{" "}
                <a href="mailto:privacy@kidsportal.com" className="text-blue-600 font-bold hover:underline">privacy@kidsportal.com</a>. If you&apos;re in the EU/EEA or UK and believe we haven&apos;t handled your data properly, you also have the right to lodge a complaint with your local data protection supervisory authority.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
