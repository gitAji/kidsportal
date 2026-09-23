"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaLock, FaBookOpen, FaChevronRight } from "react-icons/fa";

// Modern replacement for the old "grid of click-to-expand grade cards":
// grades run along a horizontal tab strip, and picking one reveals its
// subjects and levels in a single panel below — no per-card accordions.
export default function CurriculumShowcase({ grades, themeColors }) {
  const [gradeIndex, setGradeIndex] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const grade = useMemo(() => {
    const g = grades[gradeIndex];
    if (!g?.subjects) return g;
    // Some grades have duplicate subject entries under different IDs
    // (e.g. an English and a Tamil-named entry that both say "Science") —
    // keep only the first one per displayed name so the list never repeats.
    const seenNames = new Set();
    const subjects = g.subjects.filter((s) => {
      if (seenNames.has(s.subjectName)) return false;
      seenNames.add(s.subjectName);
      return true;
    });
    return { ...g, subjects };
  }, [grades, gradeIndex]);
  const themeColor = themeColors[gradeIndex % themeColors.length];

  const selectedSubject = useMemo(() => {
    if (!grade?.subjects?.length) return null;
    if (selectedSubjectId) {
      return grade.subjects.find((s) => s.subjectId === selectedSubjectId) || grade.subjects[0];
    }
    return grade.subjects[0];
  }, [grade, selectedSubjectId]);

  const handleSelectGrade = (index) => {
    setGradeIndex(index);
    setSelectedSubjectId(null);
  };

  if (!grade) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Grade tab strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide snap-x">
        {grades.map((g, i) => {
          const isActive = i === gradeIndex;
          return (
            <button
              key={g.gradeId}
              onClick={() => handleSelectGrade(i)}
              className={`flex-shrink-0 snap-start px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${isActive
                ? "text-white shadow-lg scale-105"
                : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-700"
                }`}
              style={isActive ? { backgroundColor: themeColors[i % themeColors.length], borderColor: themeColors[i % themeColors.length] } : undefined}
            >
              {g.gradeName || `Grade ${i + 1}`}
            </button>
          );
        })}
      </div>

      {/* Selected grade panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={grade.gradeId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            {/* Subject list */}
            <div className="bg-slate-50/70 border-b-2 md:border-b-0 md:border-r-2 border-slate-100 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {grade.subjects?.map((subject) => {
                const isActive = subject.subjectId === selectedSubject?.subjectId;
                return (
                  <button
                    key={subject.subjectId}
                    onClick={() => setSelectedSubjectId(subject.subjectId)}
                    className={`flex-shrink-0 md:w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-left font-bold text-sm transition-all ${isActive
                      ? "bg-white shadow-sm text-slate-800 border-2"
                      : "text-slate-500 border-2 border-transparent hover:bg-white/70"
                      }`}
                    style={isActive ? { borderColor: themeColor } : undefined}
                  >
                    <span className="flex items-center gap-2">
                      <FaBookOpen className="text-xs opacity-60 flex-shrink-0" />
                      {subject.subjectName}
                    </span>
                    <FaChevronRight className={`text-[10px] transition-opacity hidden md:block ${isActive ? "opacity-60" : "opacity-0"}`} />
                  </button>
                );
              })}
            </div>

            {/* Level preview */}
            <div className="p-6 md:p-8">
              {selectedSubject ? (
                <>
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{grade.gradeName}</p>
                      <h3 className="text-2xl font-black text-slate-800">{selectedSubject.subjectName}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
                      {selectedSubject.levels?.length || 0} Levels
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedSubject.levels?.map((level, levelIndex) => {
                      const isLocked = levelIndex !== 0;
                      return (
                        <div
                          key={level.levelId}
                          className="bg-slate-50/60 border border-slate-100 rounded-xl p-3 flex items-center gap-3"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${isLocked ? "bg-slate-100 text-slate-400" : "bg-yellow-50 text-yellow-500"}`}>
                            {isLocked ? <FaLock size={12} /> : <FaStar />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 text-sm truncate">{level.levelName}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                              {level.tasks?.length || 0} Tasks{!isLocked ? " · Free Preview" : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <p className="text-xs text-slate-400 font-medium flex-1">
                      Level 1 is free to try. Subscribe to unlock every level in every subject.
                    </p>
                    <a
                      href="/pricing"
                      className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all text-center"
                    >
                      See Pricing
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 font-medium">No subjects available for this grade yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
