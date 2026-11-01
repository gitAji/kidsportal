"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FaLock, FaMedal } from "react-icons/fa";

// Mirrors the mastery levels from the curriculum framework: a child earns
// each outcome's badge by showing mastery three ways — practice, a check,
// and a task that applies the skill.
const levels = [
  {
    name: "Locked",
    icon: <FaLock />,
    color: "bg-slate-100 text-slate-400",
    ring: "ring-slate-200",
    desc: "Not started yet.",
  },
  {
    name: "Bronze",
    icon: <FaMedal />,
    color: "bg-amber-100 text-amber-600",
    ring: "ring-amber-200",
    desc: "Completed the lesson and practice games.",
  },
  {
    name: "Silver",
    icon: <FaMedal />,
    color: "bg-slate-200 text-slate-500",
    ring: "ring-slate-300",
    desc: "80%+ on an auto-marked check, on two separate days.",
  },
  {
    name: "Gold",
    icon: <FaMedal />,
    color: "bg-yellow-100 text-yellow-600",
    ring: "ring-yellow-300",
    desc: "Passed an applied task — reviewed by a parent or teacher.",
  },
];

export default function MasterySystemSection() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-[3rem] border border-slate-100 p-8 md:p-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-indigo-500 font-black uppercase tracking-[4px] text-xs mb-3 block">Built For Real Progress</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          How We Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500">Mastery</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium">
          Every skill on the site is one trackable outcome. A badge only levels up when your child has actually shown they&apos;ve got it.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
        {levels.map((level, i) => (
          <motion.div
            key={level.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100"
          >
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 ring-4 ${level.color} ${level.ring}`}>
              {level.icon}
            </div>
            <h3 className="font-black text-slate-800 mb-2">{level.name}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{level.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
