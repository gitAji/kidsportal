"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../../data/db.json';
import SkeletonLoader from '../../../../components/ui/SkeletonLoader';
import { FaBookOpen, FaQuestionCircle, FaAward, FaStar, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import { useChild } from '../../../../providers/ChildProvider';
import { loadStats } from '../../../../utils/achievements';
import MinimalBackButton from '../../../../components/child/MinimalBackButton';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// A map for sleek task colors
const taskColorMap = {
  "lesson": "bg-gradient-to-br from-green-400 to-green-600 border-green-500",
  "quiz": "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500",
  "exam": "bg-gradient-to-br from-red-400 to-red-600 border-red-500",
  "default": "bg-gradient-to-br from-gray-400 to-gray-600 border-gray-500",
};

const taskIconMap = {
  "lesson": FaBookOpen,
  "quiz": FaQuestionCircle,
  "exam": FaAward,
  "default": FaStar,
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mx-auto z-10 relative pb-20"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {levelData.tasks && levelData.tasks.length > 0 ? (
          levelData.tasks
            .filter(task => {
              const name = task.taskName?.toLowerCase().trim() || '';
              const isGeneric = /^\[(quizz|quiz|exam|lesson)\s*\d*\]$/i.test(name) ||
                /^(quizz|quiz|exam|lesson)\s*\d+$/i.test(name) ||
                /^(quizz|quiz)\d+$/i.test(name) ||
                ['new quiz', 'new lesson', 'new exam', 'quizz 1', 'quiz 1', 'lesson 1', 'exam 1'].includes(name) ||
                name.includes('placeholder');
              return !isGeneric;
            })
            .map(task => {
              const Icon = taskIconMap[task.type?.toLowerCase()] || taskIconMap.default;
              const taskColor = taskColorMap[task.type?.toLowerCase()] || taskColorMap.default;
              const isDone = childStats?.completedTasks_list?.includes(task.taskId);

              return (
                <motion.div
                  key={task.taskId}
                  onClick={() => router.push(`/learning-zone/subjects/${subjectId}/${levelId}/${task.taskId}`)}
                  className={`${taskColor} text-white rounded-[2rem] shadow-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group border-b-8`}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {/* Decorative overlay for cards */}
                  <div className="absolute -bottom-5 -right-5 text-white opacity-20 transform rotate-12 group-hover:-rotate-12 transition-transform duration-500 ease-in-out">
                    <Icon size={100} />
                  </div>

                  {/* Small checkmark badge when task is done */}
                  {isDone && (
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

                  <div className="bg-white/20 p-4 rounded-full mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon size={36} className="text-white" />
                  </div>

                  <h2 className="text-2xl font-extrabold mb-2 drop-shadow-md z-10 leading-tight">
                    {task.taskName?.replace(/^\[.*?\]\s*/i, "").replace(/^(quizz|quiz|exam|lesson)\s*\d+[:\s-]*\s*/i, "").trim()}
                  </h2>

                  <div className="mt-auto bg-black/20 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide z-10 flex items-center gap-2">
                    {task.type}
                    {isDone && (
                      <FaCheckCircle className="text-green-300" title="Completed!" />
                    )}
                  </div>
                </motion.div>
              );
            })
        ) : (
          <p className="text-center text-gray-600 col-span-full font-bold text-xl bg-white p-8 rounded-2xl shadow-sm">
            No tasks found for this level yet.
          </p>
        )}
      </motion.div>
    </div>
  );
}
