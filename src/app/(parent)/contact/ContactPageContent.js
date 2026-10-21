"use client";
import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaTicketAlt, FaClock, FaArrowRight, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const channels = [
  {
    icon: <FaEnvelope />,
    color: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-100 hover:border-b-blue-500",
    label: "Email Us",
    value: "support@kidsportal.com",
    href: "mailto:support@kidsportal.com",
    desc: "Drop us a line anytime — we typically reply within one business day.",
  },
  {
    icon: <FaPhone />,
    color: "bg-purple-50 text-purple-600",
    hoverBorder: "hover:border-purple-100 hover:border-b-purple-500",
    label: "Call Us",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    desc: "Talk to our team directly, Monday to Friday, 9am–6pm EST.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-slate-900 py-28 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-[140px] opacity-40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-widest uppercase mb-8"
          >
            <FaQuestionCircle /> We&apos;re here to help
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100/60 text-lg max-w-xl mx-auto"
          >
            Have a question about a lesson or your subscription? We&apos;re here to help you and your little learner every step of the way.
          </motion.p>
        </div>
      </section>

      {/* Quick contact channels */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {channels.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 border-b-[6px] ${c.hoverBorder} hover:-translate-y-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 opacity-60" />
                <div className={`relative z-10 w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center text-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {c.icon}
                </div>
                <p className="relative z-10 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{c.label}</p>
                <p className="relative z-10 text-lg font-black text-slate-800 mb-3 break-words">{c.value}</p>
                <p className="relative z-10 text-slate-500 text-sm leading-relaxed font-medium">{c.desc}</p>
              </motion.a>
            ))}

            {/* Support Ticket — registered users only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group bg-slate-900 p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden text-white flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FaTicketAlt />
              </div>
              <p className="relative z-10 text-xs font-black text-blue-300 uppercase tracking-widest mb-2">For Registered Users</p>
              <p className="relative z-10 text-lg font-black mb-3">Open a Support Ticket</p>
              <p className="relative z-10 text-slate-400 text-sm leading-relaxed font-medium mb-6">
                Sign in for account-specific help with your child&apos;s progress, billing, or profile.
              </p>
              <Link
                href="/support"
                className="relative z-10 mt-auto w-full bg-blue-600 text-white text-center px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
              >
                Open a Ticket <FaArrowRight className="text-xs" />
              </Link>
            </motion.div>
          </div>

          {/* Secondary info strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-6xl mx-auto mt-8 bg-slate-50/70 border border-slate-100 rounded-[2.5rem] p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Headquarters</p>
                <p className="text-slate-700 font-bold">123 Learning Lane, Creative City, CA 90210</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <FaClock />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Support Hours</p>
                <p className="text-slate-700 font-bold">Mon–Fri, 9am–6pm EST</p>
              </div>
            </div>

            <div className="flex items-center md:justify-end">
              <p className="text-slate-500 text-sm font-medium">
                Looking for immediate answers? Check our <Link href="/help" className="text-blue-600 font-bold hover:underline">Help Center</Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
