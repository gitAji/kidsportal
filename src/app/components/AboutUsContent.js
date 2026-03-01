"use client";
import React from 'react';
import { FaHeart, FaLightbulb, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const values = [
  { icon: <FaHeart />, title: "Child-First", text: "Every feature is designed with the child's happiness and safety as the #1 priority." },
  { icon: <FaLightbulb />, title: "Curiosity Driven", text: "We don't just teach; we inspire children to ask 'why' and explore further." },
  { icon: <FaRocket />, title: "Future Ready", text: "Equipping young minds with critical thinking and digital literacy skills." },
  { icon: <FaShieldAlt />, title: "Safe Haven", text: "A 100% ad-free, secure environment where children can roam freely." }
];

export default function AboutUsContent({ onClose }) {
  return (
    <div className="relative h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 flex items-center justify-between backdrop-blur-md">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Our Story</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Making learning an adventure since 2024</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Main Mission */}
          <section className="text-center">
            <div className="bg-blue-600/10 text-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              KidsPortal was born from a simple belief: <span className="text-blue-600 font-bold">education should be the most exciting game in a child&apos;s life.</span> We bridge the gap between entertainment and education, creating a world where learning feels like play and curiosity is rewarded at every turn.
            </p>
          </section>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors"
              >
                <div className="text-blue-500 text-xl mb-3">{value.icon}</div>
                <h4 className="font-bold text-slate-800 mb-2">{value.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Impact Note */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white text-center shadow-xl shadow-blue-200">
            <h4 className="text-xl font-bold mb-2">Designed by Educators</h4>
            <p className="text-blue-100 text-sm">
              Our curriculum is meticulously crafted by educational experts and child psychologists to ensure maximum engagement and effective learning retention.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
