"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FaBook, FaCalculator, FaGlobe, FaFlask, FaArrowRight } from "react-icons/fa";

const subjects = [
  {
    name: 'English',
    icon: <FaBook size={32} />,
    color: 'from-blue-500 to-blue-700',
    description: 'Master reading, writing, and storytelling through fun games.'
  },
  {
    name: 'Mathematics',
    icon: <FaCalculator size={32} />,
    color: 'from-cyan-500 to-cyan-700',
    description: 'Crack numbers and solve logic puzzles that bring math to life.'
  },
  {
    name: 'Social Studies',
    icon: <FaGlobe size={32} />,
    color: 'from-indigo-500 to-indigo-700',
    description: 'Explore history and cultures with interactive 3D adventures.'
  },
  {
    name: 'Science',
    icon: <FaFlask size={32} />,
    color: 'from-teal-500 to-teal-700',
    description: 'Conduct virtual experiments and discover the world.'
  },
];

const SubjectsSection = () => {
  return (
    <section className="relative py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r transition-all duration-300 group-hover:h-full rounded-3xl opacity-10 group-hover:opacity-100 -z-10"
              style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

            <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-10 rounded-3xl shadow-xl shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col items-center text-center h-full">
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${subject.color} text-white shadow-lg mb-8 transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                {subject.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                {subject.name}
              </h3>

              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                {subject.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest group/btn cursor-pointer">
                <span>Learn More</span>
                <FaArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SubjectsSection;