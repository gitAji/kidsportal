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
      className={`bg-white rounded-3xl overflow-hidden border-2 ${isExpanded ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-100 hover:border-slate-200"
        } transition-all duration-300 flex flex-col group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]`}
    >
      <div
        className="h-3 w-full"
        style={{ background: `linear-gradient(90deg, ${themeColor}, #60a5fa)` }}
      />

      <div className="p-6 text-center">
        <h3 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {grade.gradeName}
        </h3>
        <p className="text-slate-500 font-medium mb-6 italic text-sm">
          {grade.subjects?.length || 0} Subjects · Curriculum View
        </p>

        <button
          onClick={toggleExpand}
          className={`w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${isExpanded
            ? "bg-slate-800 text-white"
            : "bg-white text-blue-600 border-2 border-blue-50 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-400 hover:border-transparent hover:text-white hover:shadow-cyan-500/30 hover:scale-[1.02]"
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
                    {selectedSubject.levels?.map((level) => (
                      <div
                        key={level.levelId}
                        className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${level.isLocked ? 'bg-slate-100 text-slate-400' : 'bg-yellow-50 text-yellow-500'}`}>
                            {level.isLocked ? <FaLock size={12} /> : <FaStar />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{level.levelName}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{level.tasks?.length || 0} Tasks</p>
                          </div>
                        </div>
                      </div>
                    ))}
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