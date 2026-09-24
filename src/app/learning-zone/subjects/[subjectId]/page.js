"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../data/db.json';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import { FaLock, FaStar, FaTrophy, FaCheckCircle, FaUnlockAlt, FaLanguage, FaRandom, FaCode, FaArrowRight, FaCalculator, FaLeaf, FaBook } from 'react-icons/fa';
import { useChild } from '../../../providers/ChildProvider';
import { useLanguage } from '../../../providers/LanguageProvider';
import MinimalBackButton from '../../../components/child/MinimalBackButton';
import { loadStats } from '../../../utils/achievements';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// A small, deliberate set of clearly distinct, cheerful colors.
// Red is intentionally left out here — it's reserved for "wrong answer"
// feedback elsewhere in the app, so it shouldn't also mean "just a level".
const colorPalette = [
  "bg-[#FF9B9B] border-[#FF7272]",
  "bg-[#72C6FF] border-[#40A5E5]",
  "bg-[#72E5A8] border-[#4CC287]",
  "bg-[#FFC972] border-[#E5A840]",
  "bg-[#C48CFF] border-[#A05CFF]",
  "bg-[#8CEFFF] border-[#5CCEE5]",
];

// Friendly display names for subjectId prefixes (e.g. "math-3" -> "Math"),
// so kids never see a raw internal ID like "MATH-3" in the UI.
const subjectDisplayNames = {
  english: 'English',
  math: 'Math',
  science: 'Science',
  tamil: 'Tamil',
  computerscience: 'Computer Science',
  coding: 'Coding',
};

function getSubjectDisplayName(subjectId) {
  const prefix = (subjectId || '').replace(/-\d+$/, '').toLowerCase();
  return subjectDisplayNames[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

// Build Lab banners: one per subject, gated by subjectId prefix (some
// subjects share a lab across grades, e.g. "math-3" and "math-7" both get
// the Math lab banner).
const buildLabConfig = [
  {
    match: (id) => id.startsWith('coding'),
    path: '/learning-zone/coding-lab',
    icon: FaCode,
    gradient: 'from-violet-600 to-purple-700',
    title: 'Try the Build Lab!',
    desc: 'Snap blocks together to guide a robot, match patterns, or draw with code.',
  },
  {
    match: (id) => id.startsWith('math'),
    path: '/learning-zone/math-lab',
    icon: FaCalculator,
    gradient: 'from-blue-600 to-cyan-600',
    title: 'Try the Build Lab!',
    desc: 'Tap tiles to build equations that hit the target number.',
  },
  {
    match: (id) => id.startsWith('science'),
    path: '/learning-zone/science-lab',
    icon: FaLeaf,
    gradient: 'from-emerald-600 to-teal-600',
    title: 'Try the Build Lab!',
    desc: 'Sort creatures into the habitats where they really live.',
  },
  {
    match: (id) => id.startsWith('english'),
    path: '/learning-zone/english-lab',
    icon: FaBook,
    gradient: 'from-amber-600 to-orange-600',
    title: 'Try the Build Lab!',
    desc: 'Tap words in the right order to build sentences from a clue.',
  },
  {
    match: (id) => id.startsWith('tamil'),
    path: '/learning-zone/tamil-lab',
    icon: FaLanguage,
    gradient: 'from-fuchsia-600 to-pink-600',
    title: 'Try the Build Lab!',
    desc: 'Tap Tamil words in the right order to build sentences from an English clue.',
  },
];

function getBuildLabConfig(subjectId) {
  const id = (subjectId || '').toLowerCase();
  return buildLabConfig.find((cfg) => cfg.match(id)) || null;
}

// Fisher-Yates — used only to reorder the Replay Round view, never the
// underlying data, so completion/XP/lock state can't be affected by it.
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getChildStats } from '@/app/utils/firestoreService';
import { getTimeStatus } from '@/app/utils/timeLimits';
import TimeLimitBlockedScreen from '../../../components/child/TimeLimitBlockedScreen';

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
  const [timeStatus, setTimeStatus] = useState(null);

  // Screen-time limits: checked here (before a new level can be started),
  // never inside the task page itself, so a limit hit mid-lesson doesn't
  // interrupt work already in progress.
  useEffect(() => {
    const checkTimeStatus = async () => {
      if (!childUser?.id) return;
      try {
        const stats = await getChildStats(childUser.id);
        setTimeStatus(getTimeStatus({
          timeLimits: childUser.timeLimits,
          timeUsage: stats.timeUsage,
          timeBonus: stats.timeBonus,
        }));
      } catch (err) {
        console.error('Failed to check time status', err);
        setTimeStatus(getTimeStatus({ timeLimits: childUser.timeLimits }));
      }
    };
    checkTimeStatus();
  }, [childUser?.id, childUser?.timeLimits]);

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
    const isSubscribed = !!childUser?.isSubscriptionActive;

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

      // Free accounts can always try level 1 of every subject, but every
      // level after that requires an active subscription — subscribing
      // removes this cap entirely (every level opens immediately) as well
      // as the sequential-progression requirement below.
      const requiresSubscription = !isSubscribed && index !== 0;

      // Subscription (which levels a family can reach at all) and sequential
      // progression (whether a reachable level still needs the previous one
      // finished first) are independent gates — being subscribed removes the
      // paywall, not the parent's "Finish to Unlock" setting.
      let dynamicIsLocked;
      let lockMessage = level.lockMessage;
      if (requiresSubscription) {
        dynamicIsLocked = true;
        lockMessage = "Subscribe to unlock this level! 🔓";
      } else {
        dynamicIsLocked = sequentialLocked;
        lockMessage = sequentialLocked ? "Finish the previous level to unlock this one! 🚀" : level.lockMessage;
      }

      // Mark the first unlocked, non-completed level as "next up"
      const isNextUp = previousCompleted && !isCompleted && !dynamicIsLocked;

      // Update for the next level in the array
      previousCompleted = isCompleted;

      return {
        ...level,
        overrideIsLocked: dynamicIsLocked,
        isLocked: dynamicIsLocked,
        requiresPreviousLevel: !requiresSubscription && sequentialLocked,
        requiresSubscription,
        lockMessage,
        completedCount,
        totalTasks,
        isCompleted,
        isNextUp
      };
    });
  }, [levels, childStats, subjectId, childUser?.isSubscriptionActive, childUser?.sequentialProgression]);

  // Once every level in the subject is finished, offer a shuffled "Replay
  // Round" for review practice. This only reorders what's displayed —
  // completion, XP and lock state are untouched, and turning it off goes
  // straight back to the normal Level 1 -> 10 order.
  const isSubjectFullyCompleted = processedLevels.length > 0 && processedLevels.every(l => l.isCompleted);
  const [replayMode, setReplayMode] = useState(false);
  const [replaySeed, setReplaySeed] = useState(0);

  const groupedModules = useMemo(() => {
    const grouped = processedLevels.reduce((acc, level) => {
      const module = level.moduleName || 'Standard Lessons';
      if (!acc[module]) acc[module] = [];
      acc[module].push(level);
      return acc;
    }, {});

    let entries = Object.entries(grouped);
    if (replayMode && isSubjectFullyCompleted) {
      entries = shuffleArray(entries).map(([title, lvls]) => [title, shuffleArray(lvls)]);
    }
    return entries;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedLevels, replayMode, replaySeed, isSubjectFullyCompleted]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Getting your levels ready..." />
    </div>
  );

  if (timeStatus?.isBlocked) {
    return <TimeLimitBlockedScreen status={timeStatus} />;
  }

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
    <div className="flex flex-col p-2 sm:p-4 relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-20 right-20 text-yellow-400 opacity-20 text-9xl transform rotate-12 pointer-events-none"><FaTrophy /></div>
      <div className="absolute bottom-10 left-10 text-pink-400 opacity-20 text-8xl transform -rotate-12 pointer-events-none"><FaStar /></div>

      <MinimalBackButton />

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
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 drop-shadow-sm tracking-tight">
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

      {(() => {
        const labCfg = getBuildLabConfig(subjectId);
        if (!labCfg) return null;
        const LabIcon = labCfg.icon;
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto z-10 relative mb-10 px-4"
          >
            <div
              onClick={() => router.push(labCfg.path)}
              className={`bg-gradient-to-r ${labCfg.gradient} rounded-[2rem] shadow-xl shadow-purple-200/50 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-transform`}
            >
              <div className="flex items-center gap-3 text-center sm:text-left text-white">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                  <LabIcon size={26} />
                </div>
                <div>
                  <p className="font-black text-lg leading-tight">{labCfg.title}</p>
                  <p className="text-sm font-medium text-white/80">{labCfg.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 bg-white/20 text-white font-black text-sm px-5 py-2.5 rounded-2xl">
                Play Now <FaArrowRight />
              </div>
            </div>
          </motion.div>
        );
      })()}

      {isSubjectFullyCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mx-auto z-10 relative mb-10 px-4"
        >
          <div className="bg-white rounded-[2rem] shadow-lg border-2 border-amber-200 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="text-4xl">🏆</div>
              <div>
                <p className="font-black text-slate-800 text-lg leading-tight">You finished every level!</p>
                <p className="text-sm font-medium text-slate-500">
                  {replayMode ? 'Replay Round: levels are shuffled for fun practice.' : 'Play a Replay Round to practice them again in a new order.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {replayMode && (
                <button
                  onClick={() => setReplaySeed(s => s + 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  <FaRandom /> Shuffle Again
                </button>
              )}
              <button
                onClick={() => setReplayMode(prev => !prev)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${replayMode
                  ? 'bg-slate-800 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                  }`}
              >
                <FaRandom /> {replayMode ? 'Back to Normal Order' : 'Start Replay Round'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-6xl mx-auto z-10 relative pb-20 space-y-12">
        {groupedModules.map(([moduleTitle, moduleLevels]) => (
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
                    className={`${cardBg} text-white rounded-[2.5rem] shadow-lg hover:shadow-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden group border-b-[8px] border-x-[4px] border-t-4 ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''} ${level.isNextUp ? 'ring-4 ring-green-400 ring-offset-4 ring-offset-transparent' : ''}`}
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
                      <h3 className="text-2xl font-black drop-shadow-md tracking-tight z-10 line-clamp-2">
                        {level.levelName?.includes(':') ? level.levelName.split(':')[1].trim() : level.levelName || 'Untitled Topic'}
                      </h3>
                      {level.description && (
                        <p className="text-sm font-medium opacity-80 z-10 mt-1">{level.description}</p>
                      )}
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
                          {level.requiresSubscription ? 'Subscribe to Unlock 🔓' : (level.overrideIsLocked ? 'LOCKED' : t('locked'))}
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

    </div>
  );
}
