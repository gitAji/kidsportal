"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../data/db.json';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import { FaArrowLeft } from 'react-icons/fa';
import { useChild } from '../../../providers/ChildProvider'; // Import useChild
import { motion } from "framer-motion"; // Import motion

export default function SubjectLevelsPage() {
  const { childUser } = useChild(); // Get childUser from context
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId } = params;

  useEffect(() => {
    if (childUser && childUser.gradeId) {
      const gradeData = dbData.grades.find(g => g.gradeId === childUser.gradeId);
      if (gradeData) {
        const foundSubject = gradeData.subjects.find(s => s.subjectId === subjectId);
        setSubjectData(foundSubject);
      } else {
        console.warn(`Grade data not found for gradeId: ${childUser.gradeId}`);
      }
    } else if (!childUser) {
      router.push("/child-login"); // Redirect if no child user
    }
    setLoading(false);
  }, [childUser, subjectId, router]);

  if (loading) return <SkeletonLoader />;
  if (!childUser) return null; // Redirecting is handled by useEffect
  if (!subjectData) return <div className="text-center p-10">Subject not found.</div>;

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Subjects
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{subjectData.subjectName} Levels</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {subjectData.levels.length > 0 ? (
          subjectData.levels.map(level => (
            <motion.div
              key={level.levelId}
              onClick={() => router.push(`/learning-zone/subjects/${subjectId}/${level.levelId}`)}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-2xl font-semibold text-purple-600 mb-2">{level.levelName}</h2>
              <p className="text-gray-600">{level.description}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No levels found for this subject.</p>
        )}
      </motion.div>
    </div>
  );
}
