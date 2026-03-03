"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FaHeart, FaLightbulb, FaRocket, FaShieldAlt, FaUsers, FaGlobe, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const Values = [
    {
        icon: <FaHeart />,
        title: "Child-First Philosophy",
        text: "Every lesson, button, and interaction is designed with children's emotional and cognitive safety at its core. We don't just teach; we care.",
        color: "bg-rose-50 text-rose-600"
    },
    {
        icon: <FaLightbulb />,
        title: "Inspiring Curiosity",
        text: "We believe the goal of education is to ignite a lifelong fire of curiosity. Our curriculum encourages children to ask 'why' and explore deeper.",
        color: "bg-amber-50 text-amber-600"
    },
    {
        icon: <FaRocket />,
        title: "Future-Ready Skills",
        text: "From global literacy to critical thinking, we equip children with the tools they need to lead in a rapidly evolving digital world.",
        color: "bg-blue-50 text-blue-600"
    },
    {
        icon: <FaUsers />,
        title: "Inclusive Community",
        text: "Education is a universal right. We strive to make our portal accessible and representative of all families, everywhere.",
        color: "bg-emerald-50 text-emerald-600"
    }
];

export default function AboutUsPage() {
    return (
        <div className="bg-white font-sans">
            {/* ── Hero Section ── */}
            <section className="relative py-32 overflow-hidden bg-slate-900 border-b border-white/5">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.3),transparent_50%)]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-cyan-500 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[3px] mb-8">
                            <FaStar /> Our Mission
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                            Making Learning <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Pure Magic.</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                            KidsPortal was founded with a single, radical idea: that education should be as engaging as a child&apos;s favorite game.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── The Story Section ── */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-cyan-50 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white p-2">
                                <div className="aspect-[4/3] bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden">
                                    <div className="text-center p-8">
                                        <FaGlobe className="text-6xl text-blue-100 mb-4 mx-auto animate-pulse" />
                                        <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Our Global Journey</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hidden md:block">
                                <div className="text-4xl font-black text-blue-600">10k+</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Learners</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 tracking-tight">The Story Behind <span className="text-blue-600">The Portal</span></h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                                In 2024, a team of educators and developers stood in front of a white board with one question: <span className="italic">&quot;Why does learning feel like a chore?&quot;</span>
                            </p>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                We noticed that children could memorize complex game mechanics in hours but struggled with basic grammar in weeks. We realized the problem wasn&apos;t the children—it was the format. KidsPortal was built to bridge that gap, using gamification, interactivity, and emotional storytelling to teach the national curriculum.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-2xl bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">FE</div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Built by a team of <br /><span className="text-slate-800">50+ Educational Experts</span></p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Values Grid ── */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase tracking-wider">Our Core Foundations</h2>
                        <p className="text-slate-500 font-medium max-w-xl mx-auto">These four pillars guide every single lesson and feature we build.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {Values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                                    {v.icon}
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-3 tracking-tight">{v.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {v.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 bg-blue-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to join the family?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/register" className="w-full sm:w-auto px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all">
                            Join the Adventure
                        </Link>
                        <Link href="/help" className="w-full sm:w-auto px-12 py-5 bg-blue-500 text-white rounded-2xl font-black text-lg border border-blue-400/50 hover:bg-blue-400 transition-all">
                            How It Works
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
