"use client";
import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
  };

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
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
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
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 mb-8">Send a Message</h2>

                {formStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                      <FaPaperPlane />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Message Sent!</h3>
                    <p className="text-slate-500 font-medium">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="mt-8 text-blue-600 font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Your Name</label>
                        <input required type="text" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="Enter your name" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Email Address</label>
                        <input required type="email" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="name@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Subject</label>
                      <input required type="text" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Message</label>
                      <textarea required rows={5} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none" placeholder="Write your message here..." />
                    </div>
                    <button
                      disabled={formStatus === 'sending'}
                      className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl transition-all flex items-center justify-center gap-2 ${formStatus === 'sending' ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 active:scale-[0.98]'
                        }`}
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Send Message'} <FaPaperPlane />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
