"use client";
import React from 'react';
import SubjectsSection from '../../components/learning/SubjectsSection';
import HowWeMakeLearningFunSection from '../../components/learning/HowWeMakeLearningFunSection';
import CurriculumShowcase from '../../components/ui/CurriculumShowcase';
import { motion } from "framer-motion";
import db from '../../data/db.json';

// Same theme-color cycle used on the homepage's curriculum browser, so a
// grade looks the same wherever a parent finds it.
const gradeColors = [
  "#FF5722", "#4CAF50", "#2196F3", "#E91E63",
  "#9C27B0", "#FFC107", "#00BCD4", "#8BC34A",
];

export default function LearningPage() {
  const grades = db.grades;
  const gradeRange = grades.length
    ? `${Math.min(...grades.map((g) => parseInt(g.gradeId.replace("grade-", ""), 10)))}-${Math.max(...grades.map((g) => parseInt(g.gradeId.replace("grade-", ""), 10)))}`
    : "1-10";
  const totalLevels = grades.reduce((sum, g) => {
    const seenNames = new Set();
    return sum + (g.subjects || []).reduce((s, subject) => {
      if (seenNames.has(subject.subjectName)) return s;
      seenNames.add(subject.subjectName);
      return s + (subject.levels?.length || 0);
    }, 0);
  }, 0);
  const levelsDisplay = `${Math.floor(totalLevels / 50) * 50}+`;
  const subjectCount = grades.length
    ? new Set(grades[0].subjects?.map((s) => s.subjectName)).size
    : 0;

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

          {/* Real numbers, pulled from the actual curriculum */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-500">{subjectCount}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Subjects</div>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-teal-400">{gradeRange}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Grades Covered</div>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-fuchsia-500">{levelsDisplay}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Learning Levels</div>
            </div>
          </div>
        </motion.header>

        <SubjectsSection />

        {/* Full grade-by-grade, subject-by-subject curriculum browser —
            real levels and task counts, not marketing copy. */}
        <motion.div
          id="curriculum-browser"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 scroll-mt-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Browse the Full <span className="text-blue-600">Curriculum</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Pick a grade and a subject to see exactly what your child will learn, level by level.
            </p>
          </div>
          <CurriculumShowcase grades={grades} themeColors={gradeColors} />
        </motion.div>

        <div className="my-32">
          <HowWeMakeLearningFunSection />
        </div>
      </div>
    </div>
  );
}