"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useChild } from '../providers/ChildProvider';
import { useLanguage } from '../providers/LanguageProvider';
import { getSubjectsByGrade, DEFAULT_LEARNING_SUBJECTS } from '../utils/learningData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import {
  FaStar, FaPlay, FaGamepad, FaSun, FaCloud, FaMapMarkedAlt, FaFire, FaTrophy,
  FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile, FaHandPointDown, FaArrowRight,
} from 'react-icons/fa';
import { getChildStats, getChildTaskHistory } from '@/app/utils/firestoreService';
import { getTimeStatus } from '@/app/utils/timeLimits';
import TimeLimitBlockedScreen from '../components/child/TimeLimitBlockedScreen';
import ReviewReminderCard from '../components/child/ReviewReminderCard';
import { SUBJECT_STYLE_MAP as subjectStyleMap, SUBJECT_ICON_MAP as subjectIconMap } from '../utils/subjectStyles';
import { loadStats, computeStreak } from '../utils/achievements';

const AVATAR_ICONS = { paw: FaPaw, rocket: FaRocket, car: FaCar, tree: FaTree, smile: FaSmile };

function timeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function LearningZonePage() {
  const { childUser } = useChild();
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [timeStatus, setTimeStatus] = useState(null);
  const [stats, setStats] = useState({ level: 1, points: 0, streak: 0, levelsCompleted: [] });
  const [greeting, setGreeting] = useState(timeGreeting());
  const [continueTask, setContinueTask] = useState(null);

  useEffect(() => {
    const childId = childUser?.uid || childUser?.id;
    if (!childId) return;
    const localStats = loadStats(childId);
    setStats({
      level: localStats.currentLevel || 1,
      points: localStats.totalScore || 0,
      streak: computeStreak(localStats.uniqueDays_list),
      levelsCompleted: localStats.levelsCompleted || [],
    });
    // Re-evaluate the greeting on mount too, in case this page was left
    // open across a time-of-day boundary (e.g. a tablet left on overnight).
    setGreeting(timeGreeting());
  }, [childUser]);

  // "Continue where you left off" — jump straight back into the most
  // recently played task instead of making the child re-navigate
  // Home -> Subject -> Level -> Task every time. Re-opening a task that
  // was already finished is harmless (the task page just shows results/
  // retry), so this doesn't need to know whether it was completed.
  useEffect(() => {
    const childId = childUser?.uid || childUser?.id;
    if (!childId) return;
    let cancelled = false;
    (async () => {
      try {
        const [mostRecent] = await getChildTaskHistory(childId, 1);
        if (!cancelled && mostRecent?.taskId && mostRecent?.subjectId && mostRecent?.levelId) {
          setContinueTask(mostRecent);
        }
      } catch {
        // No history yet, or Firestore unreachable — just skip the card.
      }
    })();
    return () => { cancelled = true; };
  }, [childUser]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!childUser) return;
      setSubjectsLoading(true);
      let learningSubjects = childUser.learningSubjects || DEFAULT_LEARNING_SUBJECTS;
      try {
        if (childUser.parentUid) {
          const parentSnap = await getDoc(doc(db, 'users', childUser.parentUid));
          if (parentSnap.exists()) {
            learningSubjects = parentSnap.data().learningSubjects || learningSubjects;
          }
        }
      } catch (err) {}
      
      const fetchedSubjects = getSubjectsByGrade(childUser.gradeId, learningSubjects);
      setSubjects(fetchedSubjects);
      setTimeout(() => setSubjectsLoading(false), 500);
    };
    loadSubjects();
  }, [childUser]);

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
        setTimeStatus(getTimeStatus({ timeLimits: childUser.timeLimits }));
      }
    };
    checkTimeStatus();
  }, [childUser?.id, childUser?.timeLimits]);

  if (!childUser) return null;
  if (timeStatus?.isBlocked) return <TimeLimitBlockedScreen status={timeStatus} />;

  const xpIntoLevel = stats.points % 100;

  // Younger explorers get a bouncing "start here" pointer at the first
  // subject card, since they're less likely to already know a subjects
  // grid is tappable.
  const needsPointer = childUser.gradeId === 'grade-1' || childUser.gradeId === 'grade-2';

  const renderSmallAvatar = () => {
    if (childUser.photoURL) {
      return (
        <Image
          src={childUser.photoURL}
          alt={childUser.name}
          width={56}
          height={56}
          className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-lg"
        />
      );
    }
    const AvatarIcon = AVATAR_ICONS[childUser.avatar] || FaUserCircle;
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl shadow-lg border-4 border-white shrink-0">
        <AvatarIcon />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 relative font-sans">

      <ReviewReminderCard childUser={childUser} />

      {/* "Basecamp" background motif — a warm sky with a sun and drifting clouds,
          distinguishing Home from the map motif on Subjects and the arcade
          glow on Games */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-[8%] text-yellow-300 opacity-40 text-8xl sm:text-9xl"><FaSun /></div>
        <div className="absolute top-32 left-[6%] text-sky-200 opacity-50 text-7xl rotate-[-8deg]"><FaCloud /></div>
        <div className="absolute bottom-24 right-[15%] text-sky-200 opacity-40 text-6xl rotate-[6deg]"><FaCloud /></div>
        <div className="absolute bottom-10 left-[10%] text-amber-200 opacity-30 text-7xl rotate-12"><FaMapMarkedAlt /></div>
      </div>

      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-16 sm:mt-6 mb-12"
      >
        <div className="bg-white/80 backdrop-blur-xl border-4 border-white shadow-xl rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            {renderSmallAvatar()}
            <div className="min-w-0 flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-black text-xs uppercase tracking-widest border border-yellow-200 shadow-sm">
                  <FaStar className="text-[10px]" /> {childUser.grade} Explorer
                </div>
                {stats.streak >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-black text-xs uppercase tracking-widest border border-orange-200 shadow-sm"
                  >
                    <FaFire className="text-[10px]" /> {stats.streak}-day streak
                  </motion.div>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{childUser.name}</span>!
              </h1>
              <p className="text-sm sm:text-base font-bold text-slate-500 mt-0.5">
                Ready for today&apos;s adventure? 🚀
              </p>
            </div>
          </div>

          {/* Level progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="flex items-center gap-1.5 text-xs font-black text-slate-500 uppercase tracking-wider">
                <FaTrophy className="text-amber-400" /> Level {stats.level}
              </span>
              <span className="text-xs font-black text-slate-400">{xpIntoLevel}/100 XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpIntoLevel}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue where you left off — jumps straight back into the most
          recent task instead of re-navigating Home -> Subject -> Level ->
          Task. Sits above the subjects grid since it's the single most
          useful action for a returning child. */}
      {continueTask && (() => {
        const continueSubjectName = subjects.find(s => s.subjectId === continueTask.subjectId)?.subjectName;
        const continueStyle = subjectStyleMap[continueSubjectName] || subjectStyleMap.default;
        const ContinueIcon = subjectIconMap[continueSubjectName] || subjectIconMap.default;
        const actionLabel = continueTask.type === 'lesson' ? 'Resume Lesson'
          : continueTask.type === 'exam' ? 'Resume Exam'
            : 'Resume Quiz';

        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative z-10 w-full max-w-5xl mx-auto mb-10"
          >
            <Link href={`/learning-zone/subjects/${continueTask.subjectId}/${continueTask.levelId}/${continueTask.taskId}`}>
              <div className={`${continueStyle.bg} ${continueStyle.border} border-b-[6px] border-x-4 border-t-4 rounded-[2rem] p-5 sm:p-6 flex items-center gap-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer`}>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                  <ContinueIcon className={`text-2xl ${continueStyle.icon}`} />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-white/80 font-black text-[10px] uppercase tracking-widest mb-0.5">Continue where you left off</p>
                  <h3 className="text-white font-black text-lg sm:text-xl leading-tight truncate drop-shadow-sm">
                    {continueTask.taskName || 'Your last task'}
                  </h3>
                </div>
                <div className="bg-white px-4 sm:px-5 py-2.5 rounded-full font-black text-sm shadow flex items-center gap-2 shrink-0" style={{ color: continueStyle.borderHex }}>
                  {actionLabel} <FaArrowRight className="text-xs" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })()}

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto z-10 relative">

        {/* Subjects Grid — the core content leads, so a kid reaches real
            lessons without scrolling past promo banners first. */}
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="w-2 h-8 bg-blue-500 rounded-full" />
           <h2 className="text-3xl font-black text-slate-700">Your Subjects</h2>
        </div>

        {subjectsLoading ? (
          <SkeletonLoader variant="subjects" count={6} />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {subjects.map((subject, index) => {
              const Icon = subjectIconMap[subject.subjectName] || subjectIconMap.default;
              const style = subjectStyleMap[subject.subjectName] || subjectStyleMap.default;
              const displayName = t(`subjects.${subject.subjectName}`) || subject.subjectName;
              const showPointer = needsPointer && index === 0;

              // Levels completed in this subject so far, out of this
              // subject's curriculum total — levelId is always prefixed
              // "{subjectId}-level-", so no cross-subject match risk.
              // totalLevels reflects db.json's static curriculum only (not
              // any AI-generated bonus levels beyond it), same approximation
              // used elsewhere on a subject's own level-list page.
              const totalLevels = subject.levels?.length || 0;
              const completedLevels = stats.levelsCompleted.filter(id => id.startsWith(`${subject.subjectId}-level-`)).length;
              const levelProgressPct = totalLevels > 0 ? Math.min(100, Math.round((completedLevels / totalLevels) * 100)) : 0;

              return (
                <div key={subject.subjectId} className="relative">
                  {showPointer && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: [0, -10, 0] }}
                      transition={{ opacity: { duration: 0.4 }, y: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } }}
                      className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
                    >
                      <span className="bg-yellow-300 text-yellow-900 font-black text-sm px-4 py-1.5 rounded-full shadow-md whitespace-nowrap border-2 border-white">
                        Complete the levels! 👋
                      </span>
                      <FaHandPointDown className="text-yellow-300 text-4xl drop-shadow-md -mt-1" />
                    </motion.div>
                  )}
                  <Link href={`/learning-zone/subjects/${subject.subjectId}`}>
                    <motion.div
                      variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.5 } } }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${style.bg} ${style.border} border-b-[8px] border-r-[4px] border-l-4 border-t-4 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:shadow-xl transition-all h-[240px] relative overflow-hidden`}
                    >
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/5 rounded-full blur-xl" />

                      {/* Level progress so far in this subject — so the hub
                          itself shows how far along a kid is, not just a
                          flat "tap to enter" tile. */}
                      {totalLevels > 0 && (
                        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <FaTrophy className="text-[10px] text-amber-400" />
                          <span className={`text-[11px] font-black ${style.icon}`}>{completedLevels}/{totalLevels}</span>
                        </div>
                      )}

                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-4 relative z-10">
                        <Icon className={`text-5xl ${style.icon}`} />
                      </div>
                      <h3 className="text-2xl font-black text-white drop-shadow-sm relative z-10">{displayName}</h3>

                      {totalLevels > 0 && (
                        <div className="w-full max-w-[140px] h-1.5 bg-black/15 rounded-full overflow-hidden mt-3 relative z-10">
                          <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${levelProgressPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Games + Daily Challenge — compact side-by-side row, below the
            subjects so they're a bonus, not the first thing in the way. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-10 pb-20">
          <Link href="/learning-zone/games">
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#FF79B3] rounded-[2rem] p-5 sm:p-6 flex items-center justify-between gap-4 shadow-[0_8px_0_#DF5593] hover:shadow-[0_5px_0_#DF5593] hover:translate-y-1 transition-all border-4 border-white cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner border-2 border-white/30 shrink-0">
                  <FaGamepad className="text-3xl text-white drop-shadow-sm" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight">Play Games!</h2>
                  <p className="text-white/90 font-bold text-sm">Earn stars and have fun.</p>
                </div>
              </div>
              <div className="bg-white text-[#DF5593] px-5 py-2.5 rounded-full font-black text-sm shadow flex items-center gap-2 shrink-0">
                <FaPlay className="text-xs" /> GO!
              </div>
            </motion.div>
          </Link>

          <Link href="/learning-zone/daily-challenge">
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#FF9F43] rounded-[2rem] p-5 sm:p-6 flex items-center justify-between gap-4 shadow-[0_8px_0_#E07B20] hover:shadow-[0_5px_0_#E07B20] hover:translate-y-1 transition-all border-4 border-white cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner border-2 border-white/30 shrink-0">
                  <FaFire className="text-3xl text-white drop-shadow-sm" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight">Daily Challenge!</h2>
                  <p className="text-white/90 font-bold text-sm">Keep your streak going.</p>
                </div>
              </div>
              <div className="bg-white text-[#E07B20] px-5 py-2.5 rounded-full font-black text-sm shadow flex items-center gap-2 shrink-0">
                <FaPlay className="text-xs" /> GO!
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

    </div>
  );
}
