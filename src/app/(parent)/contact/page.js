"use client";
import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaTicketAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-slate-900 py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
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

      <section className="py-20 -mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Contact Info */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <FaEnvelope size={100} />
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-8">Contact Info</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                    <a href="mailto:support@kidsportal.com" className="text-slate-700 font-bold hover:text-blue-600 transition-colors">support@kidsportal.com</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Us</p>
                    <p className="text-slate-700 font-bold">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headquarters</p>
                    <p className="text-slate-700 font-bold">123 Learning Lane, Creative City, CA 90210</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-50">
                <p className="text-slate-500 text-sm font-medium">Looking for immediate answers? Check our <a href="/help" className="text-blue-600 font-bold hover:underline">Help Center</a>.</p>
              </div>
            </div>

            {/* Support Ticket CTA — registered users only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white flex flex-col"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FaTicketAlt size={100} />
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <FaTicketAlt />
              </div>
              <h2 className="text-2xl font-black mb-4">Need account-specific help?</h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-8">
                Sign in to open a support ticket about your child&apos;s progress, billing, or your account, and our team will follow up directly.
              </p>
              <Link
                href="/support"
                className="mt-auto w-full bg-blue-600 text-white text-center px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30"
              >
                Open a Support Ticket
              </Link>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
