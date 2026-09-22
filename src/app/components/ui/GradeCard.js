"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight, FaStar, FaLock, FaBookOpen } from "react-icons/fa";

export default function GradeCard({ grade, gradeIndex, themeColor }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) setSelectedSubject(null);
  };

  return (
    <div
      id={`grade-${grade.gradeId}`}
      className={`bg-white rounded-3xl overflow-hidden border-2 ${isExpanded ? "border-blue-300 ring-4 ring-blue-50/50" : "border-slate-50 border-b-[6px] hover:border-blue-100 hover:-translate-y-2 hover:border-b-blue-500"
        } transition-all duration-300 flex flex-col group shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]`}
    >
      <div
        className="h-3 w-full opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${themeColor}, #60a5fa)` }}
      />

      <div className="p-8 text-center relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 opacity-50 z-0" style={{ backgroundColor: themeColor, opacity: 0.1 }} />

        <h3 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 relative z-10">
          {grade.gradeName}
        </h3>
        <p className="text-slate-400 font-bold mb-6 text-sm uppercase tracking-widest relative z-10">
          {grade.subjects?.length || 0} Subjects · Curriculum
        </p>

        <button
          onClick={toggleExpand}
          className={`w-full py-4 px-6 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-sm relative z-10 ${isExpanded
            ? "bg-slate-800 text-white"
            : "bg-white text-blue-600 border-2 border-slate-100 hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-500 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
            }`}
        >
          {isExpanded ? "Close Preview" : "Explore Levels 🚀"}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-4 space-y-4">
              {/* Subject Selection */}
              {!selectedSubject ? (
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Select Subject</p>
                  {grade.subjects?.map((subject) => (
                    <button
                      key={subject.subjectId}
                      onClick={() => setSelectedSubject(subject)}
                      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                          <FaBookOpen />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{subject.subjectName}</p>
                          <p className="text-xs text-slate-400">{subject.levels?.length || 0} Levels</p>
                        </div>
                      </div>
                      <FaChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <button
                      onClick={() => setSelectedSubject(null)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      ← Back
                    </button>
                    <span className="text-xs font-bold text-slate-500">{selectedSubject.subjectName}</span>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {selectedSubject.levels?.map((level, levelIndex) => {
                      // Level 1 is always free to preview; everything after
                      // that requires a subscription.
                      const isLocked = levelIndex !== 0;
                      return (
                        <div
                          key={level.levelId}
                          className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-yellow-50 text-yellow-500'}`}>
                              {isLocked ? <FaLock size={12} /> : <FaStar />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-700 text-sm">{level.levelName}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{level.tasks?.length || 0} Tasks{!isLocked ? ' · Free Preview' : ''}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => window.location.href = '#pricing'}
                      className="w-full py-3 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                    >
                      Subscribe to Play All 🔓
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}