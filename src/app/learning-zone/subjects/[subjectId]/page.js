"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../data/db.json';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import { FaArrowLeft, FaHome, FaLock, FaStar, FaTrophy } from 'react-icons/fa';
import { useChild } from '../../../providers/ChildProvider';
import { motion, AnimatePresence } from "framer-motion";

const colorPalette = [
  "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500",
  "bg-gradient-to-br from-teal-400 to-teal-600 border-teal-500",
  "bg-gradient-to-br from-green-400 to-green-600 border-green-500",
  "bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-500",
  "bg-gradient-to-br from-teal-400 to-teal-600 border-teal-500",
  "bg-gradient-to-br from-red-400 to-red-600 border-red-500",
  "bg-gradient-to-br from-indigo-400 to-indigo-600 border-indigo-500",
];

export default function SubjectLevelsPage() {
  const { childUser } = useChild();
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { subjectId } = params;

  useEffect(() => {
    if (childUser && childUser.gradeId) {
      const gradeData = dbData.grades.find(g => g.gradeId === childUser.gradeId);
      if (gradeData) {
        const foundSubject = gradeData.subjects.find(s => s.subjectId === subjectId);
        setSubjectData(foundSubject);
      }
    } else if (!childUser) {
      router.push("/child-login");
    }
    setLoading(false);
  }, [childUser, subjectId, router]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Getting your levels ready..." />
    </div>
  );
  if (!subjectData) return <div className="text-center p-10 font-bold text-2xl text-gray-600">Subject not found.</div>;

  const handleLevelClick = (level) => {
    if (level.isLocked) {
      setAlertMessage(level.lockMessage || "This level is locked! Keep learning to unlock it.");
      setTimeout(() => setAlertMessage(null), 3000);
    } else {
      router.push(`/learning-zone/subjects/${subjectId}/${level.levelId}`);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
    hover: { scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 right-20 text-blue-200 opacity-30 text-9xl transform rotate-12"><FaTrophy /></div>
      <div className="absolute bottom-10 left-10 text-teal-200 opacity-40 text-8xl transform -rotate-12"><FaStar /></div>

      <div className="flex items-center justify-between mb-8 z-20 relative">
        <button onClick={() => router.back()} className="p-4 rounded-full bg-white shadow-md hover:bg-gray-50 text-blue-600 transition-transform hover:scale-110 active:scale-95">
          <FaArrowLeft className="text-2xl" />
        </button>
        <button onClick={() => router.push('/learning-zone')} className="p-4 rounded-full bg-white shadow-md hover:bg-gray-50 text-cyan-600 transition-transform hover:scale-110 active:scale-95">
          <FaHome className="text-2xl" />
        </button>
      </div>

      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white px-6 py-4 rounded-full shadow-2xl border-2 border-red-400 z-50 flex items-center gap-3"
          >
            <FaLock className="text-red-500 text-xl" />
            <p className="font-bold text-gray-800">{alertMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 relative mb-12"
      >
        <span className="inline-block bg-white px-6 py-1 rounded-full text-sm font-bold text-cyan-600 mb-4 shadow-sm uppercase tracking-wider">
          {childUser?.grade} • {subjectData.subjectName}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-sm">
          Select a Level
        </h1>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-6xl mx-auto z-10 relative pb-20"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {subjectData.levels.length > 0 ? (
          subjectData.levels.map((level, index) => {
            const isLocked = level.isLocked;
            const colorClass = colorPalette[index % colorPalette.length];
            const cardBg = isLocked ? "bg-gray-300 border-gray-400" : colorClass;

            return (
              <motion.div
                key={level.levelId}
                onClick={() => handleLevelClick(level)}
                className={`${cardBg} text-white rounded-[2rem] shadow-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group border-b-8 ${isLocked ? 'opacity-80' : ''}`}
                variants={cardVariants}
                whileHover={!isLocked ? "hover" : { scale: 1.02 }}
                whileTap="tap"
              >
                {/* Decorative overlay for unlocked cards */}
                {!isLocked && (
                  <div className="absolute -top-10 -right-10 text-white opacity-20 transform rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out">
                    <FaStar size={120} />
                  </div>
                )}

                <div className={`p-4 rounded-full mb-4 shadow-inner ${isLocked ? 'bg-gray-400 text-gray-600' : 'bg-white/20 text-white group-hover:scale-110 transition-transform duration-300'}`}>
                  {isLocked ? <FaLock size={40} /> : <FaStar size={40} />}
                </div>

                <h2 className="text-3xl font-extrabold mb-2 drop-shadow-md tracking-wide z-10">
                  {level.levelName.split(':')[0]}
                </h2>

                <p className="text-lg font-medium opacity-95 z-10">
                  {level.levelName.includes(':') ? level.levelName.split(':')[1].trim() : (level.description || "Ready to play!")}
                </p>

                {isLocked && (
                  <div className="mt-4 bg-gray-600/50 px-4 py-1 rounded-full text-sm font-semibold backdrop-blur-sm z-10">
                    Locked
                  </div>
                )}
              </motion.div>
            )
          })
        ) : (
          <p className="text-center text-gray-600 col-span-full font-bold text-xl bg-white p-8 rounded-2xl shadow-sm">
            No levels found for this subject yet. Come back later!
          </p>
        )}
      </motion.div>
    </div>
  );
}
