"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../../data/db.json';
import SkeletonLoader from '../../../../components/ui/SkeletonLoader';
import { FaArrowLeft, FaHome, FaBookOpen, FaQuestionCircle, FaAward, FaStar } from 'react-icons/fa';
import { useChild } from '../../../../providers/ChildProvider';
import { motion } from "framer-motion";

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
import { db } from '../../../../firebase/config';

export default function LevelTasksPage() {
  const { childUser } = useChild();
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId, levelId } = params;

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
        // Doc ID is `${gradeId}_${subjectId}_${levelId}`
        const docRef = doc(db, 'levels', `${childUser.gradeId}_${subjectId}_${levelId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLevelData(docSnap.data());
        } else {
          console.log("No such level document in Firestore!");
        }
      } catch (err) {
        console.error("Error fetching level details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelData();
  }, [childUser, subjectId, levelId, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-40 right-10 text-blue-200 opacity-30 text-8xl transform rotate-12"><FaQuestionCircle /></div>
      <div className="absolute top-20 left-10 text-green-200 opacity-40 text-9xl transform -rotate-12"><FaBookOpen /></div>

      <div className="flex items-center justify-between mb-8 z-20 relative">
        <button onClick={() => router.back()} className="p-4 rounded-full bg-white shadow-md hover:bg-gray-50 text-blue-600 transition-transform hover:scale-110 active:scale-95">
          <FaArrowLeft className="text-2xl" />
        </button>
        <button onClick={() => router.push('/learning-zone')} className="p-4 rounded-full bg-white shadow-md hover:bg-gray-50 text-cyan-600 transition-transform hover:scale-110 active:scale-95">
          <FaHome className="text-2xl" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 relative mb-12"
      >
        <span className="inline-block bg-white px-6 py-1 rounded-full text-sm font-bold text-cyan-600 mb-4 shadow-sm uppercase tracking-wider">
          {subjectId.toUpperCase()} • {levelData.levelName?.split(':')[0] || 'Level'}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-sm leading-tight max-w-4xl mx-auto">
          {levelData.levelName?.includes(':') ? levelData.levelName.split(':')[1].trim() : levelData.levelName}
        </h1>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mx-auto z-10 relative pb-20"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {levelData.tasks && levelData.tasks.length > 0 ? (
          levelData.tasks.map(task => {
            const Icon = taskIconMap[task.type?.toLowerCase()] || taskIconMap.default;
            const taskColor = taskColorMap[task.type?.toLowerCase()] || taskColorMap.default;

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

                <div className="bg-white/20 p-4 rounded-full mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Icon size={36} className="text-white" />
                </div>

                <h2 className="text-2xl font-extrabold mb-2 drop-shadow-md z-10 leading-tight">
                  {task.taskName}
                </h2>

                <div className="mt-auto bg-black/20 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide z-10">
                  {task.type}
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
