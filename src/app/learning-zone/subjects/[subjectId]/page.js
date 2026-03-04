"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../data/db.json';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import { FaArrowLeft, FaHome, FaLock, FaStar, FaTrophy } from 'react-icons/fa';
import { useChild } from '../../../providers/ChildProvider';
import { useLanguage } from '../../../providers/LanguageProvider';
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

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function SubjectLevelsPage() {
  const { childUser } = useChild();
  const { t } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { subjectId } = params;

  useEffect(() => {
    const fetchFirestoreLevels = async () => {
      if (!childUser || !childUser.gradeId) {
        if (!childUser && !sessionStorage.getItem("childUser")) {
          router.push("/child-login");
        }
        return;
      }

      setLoading(true);
      try {
        // Query only on subjectId to avoid any composite index requirements, 
        // since subjectId is already unique to the grade (e.g. english-1).
        const q = query(
          collection(db, 'levels'),
          where('subjectId', '==', subjectId)
        );

        const snap = await getDocs(q);
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          // Fallback filter in memory just in case
          .filter(doc => doc.gradeId === childUser.gradeId);

        // Sort levels logically by the level number at the end of the levelId string
        data.sort((a, b) => {
          const numA = parseInt(a.levelId.split('-').pop()) || 0;
          const numB = parseInt(b.levelId.split('-').pop()) || 0;
          return numA - numB;
        });

        setLevels(data);
      } catch (err) {
        console.error("Error fetching levels:", err);
        // Fallback or error state
      } finally {
        setLoading(false);
      }
    };

    fetchFirestoreLevels();
  }, [childUser, subjectId, router]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Getting your levels ready..." />
    </div>
  );

  const handleLevelClick = (level) => {
    if (level.isLocked) {
      setAlertMessage(level.lockMessage || t('locked'));
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
          {childUser?.grade} • {subjectId.toUpperCase()}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-sm">
          {t('select_level')}
        </h1>
      </motion.div>

      <div className="w-full max-w-6xl mx-auto z-10 relative pb-20 space-y-12">
        {Object.entries(
          levels.reduce((acc, level) => {
            const module = level.moduleName || 'Standard Lessons';
            if (!acc[module]) acc[module] = [];
            acc[module].push(level);
            return acc;
          }, {})
        ).map(([moduleTitle, moduleLevels]) => (
          <div key={moduleTitle} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
              <h2 className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em] bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm">{moduleTitle}</h2>
              <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-cyan-200 to-transparent"></div>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {moduleLevels.map((level, index) => {
                const isLocked = level.isLocked;
                const colorClass = colorPalette[index % colorPalette.length];
                const cardBg = isLocked ? "bg-slate-300 border-slate-400" : colorClass;

                return (
                  <motion.div
                    key={level.levelId}
                    onClick={() => handleLevelClick(level)}
                    className={`${cardBg} text-white rounded-[2.5rem] shadow-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden group border-b-8 ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}
                    variants={cardVariants}
                    whileHover={!isLocked ? "hover" : { scale: 1.02 }}
                    whileTap="tap"
                  >
                    {!isLocked && (
                      <div className="absolute -top-10 -right-10 text-white opacity-20 transform rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out">
                        <FaStar size={120} />
                      </div>
                    )}

                    <div className={`w-20 h-20 rounded-3xl mb-6 shadow-inner flex items-center justify-center text-4xl ${isLocked ? 'bg-slate-400 text-slate-200' : 'bg-white/20 text-white group-hover:rotate-12 transition-transform duration-300'}`}>
                      {isLocked ? <FaLock /> : (level.badgeEmoji || <FaStar />)}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black mb-2 drop-shadow-md tracking-tight z-10">
                        {level.levelName?.split(':')[0] || `Level ${index + 1}`}
                      </h3>
                      <p className="text-sm font-bold opacity-90 z-10 leading-relaxed max-w-[200px] line-clamp-2">
                        {level.levelName?.includes(':') ? level.levelName.split(':')[1].trim() : (level.description || 'Embark on a new learning adventure!')}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="bg-black/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                        {level.tasks?.length || 0} Tasks
                      </span>
                      <span className="bg-yellow-400/20 text-yellow-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                        {level.xpReward || 50} XP
                      </span>
                    </div>

                    {isLocked && (
                      <div className="mt-4 bg-slate-800/40 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md z-10 border border-white/10">
                        {t('locked')}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ))}

        {levels.length === 0 && (
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-16 text-center border-4 border-white shadow-2xl">
            <div className="text-7xl mb-6">🚀</div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Ready to Start?</h2>
            <p className="text-slate-500 font-bold mb-8">Your teacher is preparing some awesome levels for you!</p>
            <button onClick={() => router.push('/learning-zone')} className="bg-blue-500 text-white font-black px-10 py-4 rounded-full text-xl hover:bg-blue-600 transition-all shadow-lg hover:scale-105 active:scale-95">Go Back Home</button>
          </div>
        )}
      </div>
    </div>
  );
}
