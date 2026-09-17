"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../data/db.json';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import { FaArrowLeft, FaHome, FaLock, FaStar, FaTrophy, FaCheckCircle, FaUnlockAlt, FaLanguage } from 'react-icons/fa';
import { useChild } from '../../../providers/ChildProvider';
import { useLanguage } from '../../../providers/LanguageProvider';
import { loadStats } from '../../../utils/achievements';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// A small, deliberate set of clearly distinct, cheerful colors.
// Red is intentionally left out here — it's reserved for "wrong answer"
// feedback elsewhere in the app, so it shouldn't also mean "just a level".
const colorPalette = [
  "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500",
  "bg-gradient-to-br from-violet-400 to-purple-600 border-purple-500",
  "bg-gradient-to-br from-emerald-400 to-green-600 border-green-500",
  "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500",
  "bg-gradient-to-br from-pink-400 to-rose-500 border-pink-500",
  "bg-gradient-to-br from-cyan-400 to-teal-600 border-cyan-500",
];

// Friendly display names for subjectId prefixes (e.g. "math-3" -> "Math"),
// so kids never see a raw internal ID like "MATH-3" in the UI.
const subjectDisplayNames = {
  english: 'English',
  math: 'Math',
  science: 'Science',
  ariviyal: 'Science',
  tamil: 'Tamil',
  computerscience: 'Computer Science',
};

function getSubjectDisplayName(subjectId) {
  const prefix = (subjectId || '').replace(/-\d+$/, '').toLowerCase();
  return subjectDisplayNames[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function SubjectLevelsPage() {
  const { childUser } = useChild();
  const { t, language, toggleLanguage, languageLoaded } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [childStats, setChildStats] = useState({});
  const router = useRouter();
  const params = useParams();
  const { subjectId } = params;
  const [greeting, setGreeting] = useState(null);

  useEffect(() => {
    if (childUser && levels.length > 0 && !loading) {
      const timer = setTimeout(() => {
        setGreeting(`Level up your ${subjectId} skills! Choose a level to continue. 🦉`);
      }, 1500);
      const clearTimer = setTimeout(() => setGreeting(null), 8500);
      return () => { clearTimeout(timer); clearTimeout(clearTimer); };
    }
  }, [childUser, levels, loading, subjectId]);

  // ── Stats: refresh on mount, on focus, and on visibility change ───────────
  // Separated from the Firestore fetch so stats always update when the student
  // navigates back after completing a task (Next.js may cache the page).
  const refreshStats = useCallback(() => {
    const childId = childUser?.uid || childUser?.id;
    if (childId) {
      setChildStats(loadStats(childId));
    }
  }, [childUser]);

  useEffect(() => {
    refreshStats();
    const onVisible = () => { if (document.visibilityState === 'visible') refreshStats(); };
    window.addEventListener('focus', refreshStats);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', refreshStats);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refreshStats]);

  // ── Firestore levels: only fetched once per subject ────────────────────────
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
        const q = query(
          collection(db, 'levels'),
          where('subjectId', '==', subjectId)
        );

        const snap = await getDocs(q);
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => doc.gradeId === childUser.gradeId);

        if (data.length === 0) {
          // Fallback to local db.json
          const cleanSubjectId = decodeURIComponent(subjectId)?.toLowerCase().replace(/ /g, '-');
          const gradeData = dbData.grades.find(g => g.gradeId?.toLowerCase().replace(/-/g, '') === childUser.gradeId?.toLowerCase().replace(/-/g, ''));
          const subject = gradeData?.subjects?.find(s =>
            s.subjectId?.toLowerCase() === cleanSubjectId ||
            s.subjectName?.toLowerCase() === cleanSubjectId
          );
          if (subject && subject.levels) {
            setLevels(subject.levels);
            return;
          }
        }

        // Numeric sort by level ID pattern math-1-level-X
        const sortedData = data.sort((a, b) => {
          const aId = parseInt(a.levelId.split('-').pop());
          const bId = parseInt(b.levelId.split('-').pop());
          return aId - bId;
        });

        setLevels(sortedData);
      } catch (err) {
        console.error("Error fetching levels:", err);
        // Fallback to local on error too
        const cleanSubjectId = decodeURIComponent(subjectId)?.toLowerCase().replace(/ /g, '-');
        const gradeData = dbData.grades.find(g => g.gradeId?.toLowerCase().replace(/-/g, '') === childUser.gradeId?.toLowerCase().replace(/-/g, ''));
        const subject = gradeData?.subjects?.find(s =>
          s.subjectId?.toLowerCase() === cleanSubjectId ||
          s.subjectName?.toLowerCase() === cleanSubjectId
        );
        if (subject && subject.levels) {
          setLevels(subject.levels);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFirestoreLevels();
  }, [childUser, subjectId, router]);

  const processedLevels = useMemo(() => {
    let previousCompleted = true; // Level 1 is always unlocked
    const isTamilSubject = subjectId?.toLowerCase().includes('tamil');
    const isPremiumAndTamil = isTamilSubject && childUser?.isSubscriptionActive;

    return levels.map((level, index) => {
      // Filter out placeholders so they don't count towards progression/display
      const levelTasks = (level.tasks || []).filter(task => {
        const name = task.taskName?.toLowerCase().trim() || '';
        const isGeneric = /^\[(quizz|quiz|exam|lesson)\s*\d*\]$/i.test(name) ||
          /^(quizz|quiz|exam|lesson)\s*\d+$/i.test(name) ||
          /^(quizz|quiz|exam|lesson)\d+$/i.test(name) ||
          ['new quiz', 'new lesson', 'new exam', 'quizz 1', 'quiz 1', 'lesson 1', 'exam 1'].includes(name) ||
          name.includes('placeholder');
        return !isGeneric;
      });
      const totalTasks = levelTasks.length;
      const completedTaskIds = childStats?.completedTasks_list || [];
      const completedCount = levelTasks.filter(t => completedTaskIds.includes(t.taskId)).length;
      const isCompleted = totalTasks > 0 && completedCount === totalTasks;

      // The real progression gate: has the previous level actually been finished?
      const isSequential = childUser?.sequentialProgression !== false; // Default to true if not set
      const sequentialLocked = isSequential && !previousCompleted;

      // Visual lock (greyed-out card + lock icon)
      let dynamicIsLocked = sequentialLocked;

      // Mark the first unlocked, non-completed level as "next up"
      let isNextUp = previousCompleted && !isCompleted && !dynamicIsLocked;

      // Premium Tamil users can browse every level (no grey-out), but still
      // have to finish the previous level before they can actually enter one
      // out of sequence — that's enforced separately, at click time, via
      // requiresPreviousLevel below, regardless of this visual bypass.
      if (isPremiumAndTamil) {
        dynamicIsLocked = false;
        // Adjust isNextUp so that only the first non-completed one looks "next up"
        if (!isCompleted && previousCompleted) {
          isNextUp = true;
        } else {
          isNextUp = false;
        }
      }

      // Update for the next level in the array
      previousCompleted = isCompleted;

      return {
        ...level,
        overrideIsLocked: dynamicIsLocked,
        isLocked: dynamicIsLocked,
        requiresPreviousLevel: sequentialLocked,
        lockMessage: (dynamicIsLocked || sequentialLocked) ? "Finish the previous level to unlock this one! 🚀" : level.lockMessage,
        completedCount,
        totalTasks,
        isCompleted,
        isNextUp
      };
    });
  }, [levels, childStats, subjectId, childUser?.isSubscriptionActive, childUser?.sequentialProgression]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Getting your levels ready..." />
    </div>
  );

  const handleLevelClick = (level) => {
    if (level.overrideIsLocked || level.isLocked || level.requiresPreviousLevel) {
      const msg = level.lockMessage || t('locked');
      setAlertMessage(msg);

      // Also make Professor Owl say it!
      setGreeting(`Hoot hoot! 🦉 ${msg}`);

      setTimeout(() => setAlertMessage(null), 3500);
      setTimeout(() => setGreeting(null), 8500);
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

      {/* Navigation handled by Global Header */}

      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xl border-4 border-red-400 px-8 py-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(239,68,68,0.2)] flex items-center gap-5 max-w-md border-b-[10px] ring-8 ring-white/50">
              <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shrink-0 transform -rotate-3">
                <FaLock size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-red-600 font-black text-xs uppercase tracking-[0.2em] mb-1">Locked Level</span>
                <p className="font-extrabold text-slate-800 text-lg leading-tight">
                  {alertMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 relative mb-12"
      >
        <span className="inline-block bg-white px-6 py-2 rounded-full text-sm font-bold text-cyan-600 mb-4 shadow-sm uppercase tracking-wider">
          {childUser?.grade} • {getSubjectDisplayName(subjectId)}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-sm">
          {t('select_level')}
        </h1>

        {subjectId?.toLowerCase().includes('tamil') && languageLoaded && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-slate-800 font-extrabold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] border-b-4 border-slate-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaLanguage className="text-purple-600 group-hover:rotate-12 transition-transform" size={20} />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        )}
      </motion.div>

      <div className="w-full max-w-6xl mx-auto z-10 relative pb-20 space-y-12">
        {Object.entries(
          processedLevels.reduce((acc, level) => {
            const module = level.moduleName || 'Standard Lessons';
            if (!acc[module]) acc[module] = [];
            acc[module].push(level);
            return acc;
          }, {})
        ).map(([moduleTitle, moduleLevels]) => (
          <div key={moduleTitle} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
              <h2 className="text-xl md:text-2xl font-black text-slate-500 uppercase tracking-wider bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm">{moduleTitle}</h2>
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
                // If it's locked by previous progression OR hard-locked in DB
                const isLocked = level.overrideIsLocked || level.isLocked;
                const colorClass = colorPalette[index % colorPalette.length];
                const cardBg = isLocked ? "bg-slate-300 border-slate-400" : colorClass;

                const totalTasks = level.totalTasks;
                const completedCount = level.completedCount;

                return (
                  <motion.div
                    key={level.levelId}
                    onClick={() => handleLevelClick(level)}
                    className={`${cardBg} text-white rounded-[2.5rem] shadow-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden group border-b-8 ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''} ${level.isNextUp ? 'ring-4 ring-green-400 ring-offset-4 ring-offset-transparent' : ''}`}
                    variants={cardVariants}
                    whileHover={!isLocked ? "hover" : { scale: 1.02 }}
                    whileTap="tap"
                  >
                    {!isLocked && !level.isCompleted && (
                      <div className="absolute -top-10 -right-10 text-white opacity-20 transform rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out">
                        <FaStar size={120} />
                      </div>
                    )}

                    {/* Small checkmark badge when level is completed */}
                    {level.isCompleted && (
                      <div className="absolute top-4 right-4 z-40">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-white"
                        >
                          <FaCheckCircle size={20} className="text-white" />
                        </motion.div>
                      </div>
                    )}

                    {/* "Next up" unlocked badge */}
                    {level.isNextUp && !level.isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                        className="absolute -top-1 -right-1 z-30"
                      >
                        <div className="bg-green-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl rounded-tr-[2.5rem] shadow-lg flex items-center gap-1.5 animate-pulse">
                          <FaUnlockAlt size={12} /> Unlocked!
                        </div>
                      </motion.div>
                    )}

                    <div className={`w-20 h-20 rounded-3xl mb-6 shadow-inner flex items-center justify-center text-4xl ${isLocked ? 'bg-slate-400 text-slate-200' : 'bg-white/20 text-white group-hover:rotate-12 transition-transform duration-300'}`}>
                      {isLocked ? <FaLock /> : (level.badgeEmoji || <FaStar />)}
                    </div>

                    <div>
                      <p className="text-sm font-bold opacity-90 z-10 leading-relaxed mb-1">
                        {level.levelName?.includes(':') ? level.levelName.split(':')[0] : `Level ${index + 1}`}
                      </p>
                      <h3 className="text-2xl font-black mb-2 drop-shadow-md tracking-tight z-10 line-clamp-2">
                        {level.levelName?.includes(':') ? level.levelName.split(':')[1].trim() : level.levelName || 'Untitled Topic'}
                      </h3>
                      <p className="text-sm font-medium opacity-80 z-10 mt-auto">
                        {level.description || 'Embark on a new learning adventure!'}
                      </p>
                    </div>

                    {/* Progress bar + stats — shown on unlocked, non-completed levels */}
                    {!isLocked && !level.isCompleted && totalTasks > 0 && (() => {
                      const pct = Math.round((completedCount / totalTasks) * 100);
                      return (
                        <div className="mt-6 w-full z-10">
                          <div className="flex justify-between items-end mb-2 px-1">
                            <span className="text-sm font-black uppercase tracking-wider opacity-90">
                              {completedCount}/{totalTasks} tasks
                            </span>
                            <span className="text-sm font-black opacity-90">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                              className={`h-full rounded-full ${pct >= 100 ? 'bg-green-400' : pct >= 50 ? 'bg-emerald-300' : 'bg-white/80'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ type: "spring", stiffness: 50, damping: 15 }}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <span className="bg-yellow-400/20 text-yellow-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                              {level.xpReward || 50} XP
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Minimal info for completed levels (behind the overlay) */}
                    {!isLocked && level.isCompleted && (
                      <div className="mt-6 flex items-center gap-2">
                        <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                          {totalTasks} Tasks
                        </span>
                        <span className="bg-yellow-400/20 text-yellow-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                          {level.xpReward || 50} XP
                        </span>
                      </div>
                    )}

                    {/* Locked badge */}
                    {isLocked && (
                      <div className="mt-6 w-full z-10">
                        <div className="flex items-center gap-2 justify-center mb-2">
                          <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                            {totalTasks} Tasks
                          </span>
                        </div>
                        <div className="bg-slate-800/40 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/10 text-center">
                          {level.overrideIsLocked ? 'LOCKED' : t('locked')}
                        </div>
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

      {/* Persistent Professor Owl Guide */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
        <AnimatePresence>
          {greeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl rounded-br-sm shadow-2xl p-5 mb-4 max-w-xs border-4 border-teal-200 pointer-events-auto relative"
            >
              <div className="absolute top-0 right-0 p-1 opacity-10">
                <FaStar className="text-yellow-400 text-xs" />
              </div>
              <p className="font-bold text-slate-700 leading-snug">
                {greeting}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative pointer-events-auto group">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg border border-slate-700 z-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Professor Owl
          </div>
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden bg-gradient-to-tr from-teal-400 to-blue-600"
          >
            <div className="relative w-full h-full p-2">
              <Image
                src="/images/professor-owl.png"
                alt="Professor Owl"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
