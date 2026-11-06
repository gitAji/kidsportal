"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../../data/db.json';
import SkeletonLoader from '../../../../components/ui/SkeletonLoader';
import { FaBookOpen, FaQuestionCircle, FaAward, FaStar, FaCheckCircle, FaTrophy, FaLock, FaShieldAlt, FaMedal, FaChevronRight } from 'react-icons/fa';
import { useChild } from '../../../../providers/ChildProvider';
import { loadStats } from '../../../../utils/achievements';
import MinimalBackButton from '../../../../components/child/MinimalBackButton';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// A map for bouncy pastel task colors
const taskColorMap = {
  "lesson": "bg-[#72E5A8] border-[#4CC287] border-white/50",
  "quiz": "bg-[#72C6FF] border-[#40A5E5] border-white/50",
  "exam": "bg-[#FF9B9B] border-[#FF7272] border-white/50",
  "default": "bg-[#FFC972] border-[#E5A840] border-white/50",
};

const taskIconMap = {
  "lesson": FaBookOpen,
  "quiz": FaQuestionCircle,
  "exam": FaAward,
  "default": FaStar,
};

// Playful "did it" copy per task type, for the ribbon badge on a finished
// card — matches the trophy-cabinet tone the rest of Learning Zone already
// uses, instead of a bare checkmark.
const doneBadgeMap = {
  "lesson": { text: "Mastered!", icon: FaShieldAlt, color: "bg-emerald-500" },
  "quiz": { text: "Quiz Whiz!", icon: FaMedal, color: "bg-blue-500" },
  "exam": { text: "Champion!", icon: FaTrophy, color: "bg-amber-500" },
  "default": { text: "Done!", icon: FaCheckCircle, color: "bg-emerald-500" },
};

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function LevelTasksPage() {
  const { childUser } = useChild();
  const [levelData, setLevelData] = useState(null);
  const [childStats, setChildStats] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId, levelId } = params;
  const [greeting, setGreeting] = useState(null);
  const [shakeTaskId, setShakeTaskId] = useState(null);

  useEffect(() => {
    if (childUser && levelData && !loading) {
      const timer = setTimeout(() => {
        setGreeting(`You're doing great! Ready for some ${subjectId} tasks in Level ${levelId}? 🦉`);
      }, 1500);
      const clearTimer = setTimeout(() => setGreeting(null), 8500);
      return () => { clearTimeout(timer); clearTimeout(clearTimer); };
    }
  }, [childUser, levelData, loading, subjectId, levelId]);

  // ── Stats: refresh on mount, on focus, and on visibility change ───────────
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

  // ── Firestore level data: fetched once per level ──────────────────────────
  useEffect(() => {
    const fetchLevelData = async () => {
      if (!childUser || !childUser.gradeId) {
        if (!childUser && !sessionStorage.getItem("childUser")) {
          router.push("/child-login");
        }
        return;
      }

      setLoading(true);
      try {
        const docRef = doc(db, 'levels', `${childUser.gradeId}_${subjectId}_${levelId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLevelData(docSnap.data());
        } else {
          console.log("No such level document in Firestore! Falling back to local data...");
          const cleanSubjectId = subjectId?.toLowerCase().replace(/ /g, '-');
          const cleanLevelId = levelId?.toLowerCase().replace(/ /g, '-');

          const gradeData = dbData.grades.find(g => g.gradeId?.toLowerCase().replace(/-/g, '') === childUser.gradeId?.toLowerCase().replace(/-/g, ''));
          const subject = gradeData?.subjects?.find(s =>
            s.subjectId?.toLowerCase() === cleanSubjectId ||
            s.subjectName?.toLowerCase() === cleanSubjectId
          );
          const level = subject?.levels?.find(l => l.levelId?.toLowerCase() === cleanLevelId);
          if (level) {
            setLevelData(level);
          } else {
            console.log("Level not found in local data either. Searched for level", levelId, "in subject", subjectId);
          }
        }
      } catch (err) {
        console.error("Error fetching level details:", err);
        // Fallback to local on error
        const cleanSubjectId = subjectId?.toLowerCase().replace(/ /g, '-');
        const cleanLevelId = levelId?.toLowerCase().replace(/ /g, '-');

        const gradeData = dbData.grades.find(g => g.gradeId?.toLowerCase().replace(/-/g, '') === childUser.gradeId?.toLowerCase().replace(/-/g, ''));
        const subject = gradeData?.subjects?.find(s =>
          s.subjectId?.toLowerCase() === cleanSubjectId ||
          s.subjectName?.toLowerCase() === cleanSubjectId
        );
        const level = subject?.levels?.find(l => l.levelId?.toLowerCase() === cleanLevelId);
        if (level) setLevelData(level);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelData();
  }, [childUser, subjectId, levelId, router]);

  // ── Compute whether the entire level is complete ──────────────────────────
  const allTasksDone = useMemo(() => {
    if (!levelData?.tasks || levelData.tasks.length === 0) return false;
    const completedIds = childStats?.completedTasks_list || [];
    return levelData.tasks.every(t => completedIds.includes(t.taskId));
  }, [levelData, childStats]);

  // ── Quiz/Exam stay locked until the level's Lesson is completed ───────────
  // (a task finished before this gate existed stays unlocked, so no one
  // loses access to something they already did).
  const lessonTask = useMemo(
    () => levelData?.tasks?.find(t => t.type?.toLowerCase() === 'lesson'),
    [levelData]
  );
  const isLessonDone = !lessonTask || !!childStats?.completedTasks_list?.includes(lessonTask.taskId);

  // ── Journey progress: how many of this level's steps are done, and
  // which one is the very next thing to do (first task that's neither
  // already done nor still locked) — drives the progress bar and the
  // "Start Here!" badge below. ─────────────────────────────────────────
  const completedTaskCount = useMemo(() => {
    if (!levelData?.tasks) return 0;
    const completedIds = childStats?.completedTasks_list || [];
    return levelData.tasks.filter(t => completedIds.includes(t.taskId)).length;
  }, [levelData, childStats]);

  const nextTaskId = useMemo(() => {
    if (!levelData?.tasks) return null;
    const completedIds = childStats?.completedTasks_list || [];
    const next = levelData.tasks.find(t => {
      const done = completedIds.includes(t.taskId);
      const locked = t.type?.toLowerCase() !== 'lesson' && !isLessonDone && !done;
      return !done && !locked;
    });
    return next?.taskId || null;
  }, [levelData, childStats, isLessonDone]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Getting your tasks ready..." />
    </div>
  );
  if (!levelData) return <div className="text-center p-10 font-bold text-2xl text-gray-600">Level not found.</div>;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
    hover: { scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex flex-col p-2 sm:p-4 relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-40 right-10 text-blue-200 opacity-30 text-8xl transform rotate-12"><FaQuestionCircle /></div>
      <div className="absolute top-20 left-10 text-green-200 opacity-40 text-9xl transform -rotate-12"><FaBookOpen /></div>

      <MinimalBackButton />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 relative mb-12"
      >
        <span className="inline-block bg-white px-6 py-1 rounded-full text-sm font-bold text-cyan-600 mb-4 shadow-sm uppercase tracking-wider">
          {subjectId.toUpperCase()} • {levelData.levelName?.split(':')[0] || 'Level'}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-sm leading-tight max-w-4xl mx-auto mb-4">
          {levelData.levelName?.includes(':') ? levelData.levelName.split(':')[1].trim() : levelData.levelName}
        </h1>
        {levelData.xpReward > 0 && !allTasksDone && (
          <div className="inline-flex justify-center items-center gap-2 bg-yellow-100 text-yellow-700 font-bold px-4 py-1.5 rounded-full text-sm border-2 border-yellow-300 shadow-sm uppercase tracking-widest mt-2">
            <FaStar className="text-yellow-500" />
            Finish to earn {levelData.xpReward} XP
          </div>
        )}

        {/* Journey Progress — same completedTasks data as the badges below,
            just shown as one glanceable strip above the path. */}
        {levelData.tasks?.length > 0 && !allTasksDone && (
          <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-slate-100 mt-4">
            <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
              Journey Progress: {completedTaskCount}/{levelData.tasks.length} Steps
            </span>
            <div className="flex gap-1.5">
              {levelData.tasks.map((t) => {
                const stepDone = childStats?.completedTasks_list?.includes(t.taskId);
                return (
                  <div
                    key={t.taskId}
                    className={`w-7 sm:w-9 h-2 sm:h-2.5 rounded-full transition-colors ${stepDone
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      : 'bg-slate-100 border border-dashed border-slate-300'
                      }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Level Complete banner — shown when ALL tasks are done */}
      {allTasksDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="max-w-3xl mx-auto mb-10 z-20 relative"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2rem] p-6 shadow-2xl border-b-8 border-green-700 flex flex-col sm:flex-row items-center gap-5 text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 border-4 border-white/40">
              <FaTrophy size={40} className="text-yellow-300 drop-shadow-md" />
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-2xl font-black drop-shadow">Level Complete! ✓</h2>
              <p className="text-green-100 font-bold text-sm mt-1">All tasks finished — the next level is now unlocked!</p>
            </div>
            <button
              onClick={() => router.push(`/learning-zone/subjects/${subjectId}`)}
              className="bg-white text-green-700 font-black px-6 py-3 rounded-full text-base hover:bg-green-50 hover:scale-105 transition-all shadow-lg flex-shrink-0"
            >
              Next Level →
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex flex-wrap justify-center items-start gap-6 md:gap-8 w-full max-w-6xl mx-auto z-10 relative pb-20"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {levelData.tasks && levelData.tasks.length > 0 ? (
          levelData.tasks
            .map((task, index) => {
              const Icon = taskIconMap[task.type?.toLowerCase()] || taskIconMap.default;
              const taskColor = taskColorMap[task.type?.toLowerCase()] || taskColorMap.default;
              const isDone = childStats?.completedTasks_list?.includes(task.taskId);
              const isLocked = task.type?.toLowerCase() !== 'lesson' && !isLessonDone && !isDone;
              const isNext = task.taskId === nextTaskId;
              const doneBadge = doneBadgeMap[task.type?.toLowerCase()] || doneBadgeMap.default;
              const nextTask = levelData.tasks[index + 1];
              const nextIsLocked = nextTask && nextTask.type?.toLowerCase() !== 'lesson' && !isLessonDone
                && !childStats?.completedTasks_list?.includes(nextTask.taskId);

              return (
                <React.Fragment key={task.taskId}>
                <motion.div
                  onClick={() => {
                    if (isLocked) {
                      setShakeTaskId(task.taskId);
                      setTimeout(() => setShakeTaskId(null), 500);
                      return;
                    }
                    router.push(`/learning-zone/subjects/${subjectId}/${levelId}/${task.taskId}`);
                  }}
                  className={`${taskColor} text-white rounded-[2.5rem] shadow-xl p-8 text-center flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden group border-b-[8px] border-x-[4px] border-t-4 w-full sm:w-[280px] transition-all ${isLocked ? 'opacity-60 saturate-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  variants={cardVariants}
                  whileHover={isLocked ? undefined : "hover"}
                  whileTap={isLocked ? undefined : "tap"}
                  animate={shakeTaskId === task.taskId ? { x: [0, -8, 8, -8, 8, 0] } : "visible"}
                >
                  {/* Decorative overlay for cards */}
                  <div className="absolute -bottom-5 -right-5 text-white opacity-20 transform rotate-12 group-hover:-rotate-12 transition-transform duration-500 ease-in-out">
                    <Icon size={100} />
                  </div>

                  {/* Step order badge, guides a kid on what to do first */}
                  <div className="absolute top-4 left-4 z-40 w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center font-black text-sm shadow-inner border border-white/30">
                    {index + 1}
                  </div>

                  {/* Status ribbon: what finishing (or not finishing) this
                      step actually means, instead of a bare checkmark */}
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 6 }}
                      className="absolute top-3 right-3 z-40"
                    >
                      <div className={`${doneBadge.color} text-white text-[10px] font-black uppercase tracking-wide pl-2.5 pr-3 py-1.5 rounded-xl shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap`}>
                        <doneBadge.icon className="text-xs" /> {doneBadge.text}
                      </div>
                    </motion.div>
                  ) : isLocked ? (
                    <div className="absolute top-3 right-3 z-40 -rotate-6">
                      <div className="bg-slate-600 text-white text-[10px] font-black uppercase tracking-wide pl-2.5 pr-3 py-1.5 rounded-xl shadow-lg border-2 border-white flex items-center gap-1.5">
                        <FaLock className="text-[10px]" /> Locked
                      </div>
                    </div>
                  ) : isNext ? (
                    <motion.div
                      className="absolute top-3 right-3 z-40"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    >
                      <div className="bg-white text-blue-600 text-[10px] font-black uppercase tracking-wide pl-2.5 pr-3 py-1.5 rounded-xl shadow-lg border-2 border-blue-400 flex items-center gap-1.5 whitespace-nowrap">
                        <FaStar className="text-amber-400 text-xs" /> Start Here!
                      </div>
                    </motion.div>
                  ) : null}

                  {isLocked ? (
                    // Locked state replaces the usual icon/title/badge, centered
                    // in the card, so it's unmistakable without hiding which
                    // task (color/icon still show through faintly behind it).
                    <div className="flex flex-col items-center justify-center gap-3 z-10">
                      <div className="bg-white/25 p-4 rounded-full shadow-inner">
                        <FaLock size={30} className="text-white" />
                      </div>
                      <h2 className="text-xl font-extrabold drop-shadow-md">Locked</h2>
                      <p className="text-sm font-bold text-white/90 max-w-[14rem]">
                        Finish the Lesson first! 📖
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white/20 p-4 rounded-full mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Icon size={36} className="text-white" />
                      </div>

                      <h2 className="text-2xl font-extrabold mb-2 drop-shadow-md z-10 leading-tight line-clamp-2">
                        {task.taskName
                          ?.replace(/^\[.*?\]\s*/i, "")
                          .replace(/^(quizz|quiz|exam|lesson)\s*\d*[:\s-]*\s*/i, "")
                          .trim()}
                      </h2>

                      <div className="mt-auto bg-black/20 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide z-10 flex items-center gap-2">
                        {task.type}
                        {isDone && (
                          <FaCheckCircle className="text-green-300" title="Completed!" />
                        )}
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Path connector — only once there's a next card to connect
                    to, and only where all 3 cards reliably fit on one row
                    (lg+); below that, cards wrap and a floating connector
                    would land on the wrong line. */}
                {index < levelData.tasks.length - 1 && (
                  <div className="hidden lg:flex items-center flex-shrink-0 -mx-1 mt-[88px]">
                    <div className={`h-1 w-8 rounded-full ${nextIsLocked ? 'bg-slate-200' : 'bg-gradient-to-r from-sky-300 to-cyan-300'}`} />
                    <FaChevronRight className={`text-base ${nextIsLocked ? 'text-slate-300' : 'text-cyan-400'}`} />
                  </div>
                )}
                </React.Fragment>
              );
            })
        ) : (
          <p className="text-center text-gray-600 font-bold text-xl bg-white p-8 rounded-2xl shadow-sm">
            No tasks found for this level yet.
          </p>
        )}
      </motion.div>
    </div>
  );
}
