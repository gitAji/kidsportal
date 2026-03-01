"use client";
import React from 'react';
import SubjectsSection from '../../components/learning/SubjectsSection';
import HowWeMakeLearningFunSection from '../../components/learning/HowWeMakeLearningFunSection';
import { motion } from "framer-motion";

export default function LearningPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-outfit">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-blue-600 font-black uppercase tracking-[4px] text-xs mb-4 block">Curriculum Overview</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight mb-6">
            Explore Our <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Subjects.</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            A world of fun and interactive learning is waiting for you! Discover how we make every subject an exciting adventure.
          </p>
        </motion.header>

        <SubjectsSection />

        <div className="my-32">
          <HowWeMakeLearningFunSection />
        </div>
      </div>
    </div>
  );
}