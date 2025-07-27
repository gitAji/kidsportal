"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../../data/db.json';
import KidFriendlyLoader from '../../../../components/ui/KidFriendlyLoader';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import { useChild } from '../../../../providers/ChildProvider';
import { motion } from "framer-motion";

export default function LevelTasksPage() {
  const { childUser } = useChild();
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId, levelId } = params;

  useEffect(() => {
    if (childUser && childUser.gradeId) {
      const gradeData = dbData.grades.find(g => g.gradeId === childUser.gradeId);
      if (gradeData) {
        const foundSubject = gradeData.subjects.find(s => s.subjectId === subjectId);
        if (foundSubject) {
          const foundLevel = foundSubject.levels.find(l => l.levelId === levelId);
          setLevelData(foundLevel);
        } else {
          console.warn(`Subject data not found for subjectId: ${subjectId}`);
        }
      } else {
        console.warn(`Grade data not found for gradeId: ${childUser.gradeId}`);
      }
    } else if (!childUser) {
      router.push("/child-login");
    }
    setLoading(false);
  }, [childUser, subjectId, levelId, router]);

  if (loading) return <KidFriendlyLoader />;
  if (!levelData) return <div className="text-center p-10">Level not found.</div>;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
          <FaArrowLeft className="text-xl" />
        </button>
        <button onClick={() => router.push('/learning-zone')} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
          <FaHome className="text-xl" />
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{levelData.levelName} Tasks</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {levelData.tasks && levelData.tasks.length > 0 ? (
          levelData.tasks.map(task => (
            <motion.div
              key={task.taskId}
              onClick={() => router.push(`/learning-zone/subjects/${subjectId}/${levelId}/${task.taskId}`)}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col items-center justify-center min-h-[150px]"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{task.taskName}</h2>
              <p className="text-gray-600 text-sm">Type: {task.type}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No tasks found for this level.</p>
        )}
      </motion.div>
    </div>
  );
}
