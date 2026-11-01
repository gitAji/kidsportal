"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FaSeedling, FaCompass, FaRocket, FaGraduationCap } from "react-icons/fa";

// The four learning bands from KidsPortal's curriculum framework — each a
// "world" the child progresses through, mapped to real-world benchmarks
// (Cambridge Primary/Lower Secondary stages, CSTA levels, UK KS1-3).
const bands = [
  {
    code: "B1",
    name: "Seedlings",
    grades: "Grades 1-2",
    ages: "Ages 6-8",
    icon: <FaSeedling />,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    focus: "Foundations: sounds, letters, numbers and curiosity",
    length: "5-10 min lessons",
    sample: "“I can sound out new words.”",
  },
  {
    code: "B2",
    name: "Explorers",
    grades: "Grades 3-5",
    ages: "Ages 8-11",
    icon: <FaCompass />,
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
    text: "text-sky-600",
    focus: "Fluency, independent reading and first projects",
    length: "10-15 min lessons",
    sample: "“I can write a story with a beginning, middle and end.”",
  },
  {
    code: "B3",
    name: "Navigators",
    grades: "Grades 6-8",
    ages: "Ages 11-14",
    icon: <FaRocket />,
    color: "from-indigo-500 to-violet-600",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    focus: "Abstract thinking, evidence and real programming",
    length: "15-25 min lessons",
    sample: "“I can write a Python program that asks questions.”",
  },
  {
    code: "B4",
    name: "Pathfinders",
    grades: "Grades 9-11",
    ages: "Ages 14-17",
    icon: <FaGraduationCap />,
    color: "from-fuchsia-500 to-pink-600",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-600",
    focus: "Analysis and exam readiness (IGCSE / O-Level standard)",
    length: "20-30 min lessons",
    sample: "“I can write a well-argued essay under time limits.”",
  },
];

export default function LearningBandsSection() {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-indigo-500 font-black uppercase tracking-[4px] text-xs mb-3 block">How Learning Is Structured</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Four Worlds, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500">One Journey</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium">
          Every subject moves through the same four bands, so a lesson always matches what your child is ready for &mdash; not just their age.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bands.map((band, i) => (
          <motion.div
            key={band.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] p-7 flex flex-col"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${band.color} text-white flex items-center justify-center text-2xl shadow-lg mb-5`}>
              {band.icon}
            </div>
            <span className={`inline-block w-fit px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${band.bg} ${band.text}`}>
              {band.code} &middot; {band.grades}
            </span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{band.name}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{band.ages} &middot; {band.length}</p>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5 flex-grow">{band.focus}</p>
            <div className={`rounded-xl px-4 py-3 text-sm font-bold italic ${band.bg} ${band.text}`}>
              {band.sample}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
