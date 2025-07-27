"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion"; // Import motion
import { useChild } from '../providers/ChildProvider';
import { getSubjectsByGrade } from '../utils/learningData'; // Import the new utility function

// A map for sleek subject colors, matching parent site
const subjectColorMap = {
  "English": "bg-[#1E90FF] text-white",
  "Math": "bg-[#FF6347] text-white",
  "Tamil": "bg-[#32CD32] text-white",
  "Science": "bg-[#FFD700] text-black",
  "Ariviyal": "bg-[#FFD700] text-black", // Assuming Ariviyal uses Science color or similar
  "default": "bg-gray-500 text-white",
};

export default function LearningZonePage() {
  const { childUser } = useChild();
  const [subjects, setSubjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (childUser) {
      const fetchedSubjects = getSubjectsByGrade(childUser.gradeId);
      setSubjects(fetchedSubjects);
    }
  }, [childUser]);

  if (!childUser) {
    return null; // The provider handles loading and redirection
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-100 to-purple-100">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2 text-center leading-tight drop-shadow-lg"
      >
        <span className="text-blue-600">Hello,</span> {childUser.name}!
      </motion.h1>
      <p className="text-xl text-gray-700 mb-8 text-center">
        You are in {childUser.grade} - Let&apos;s learn something new!
      </p>
      <p className="text-xl text-gray-700 mb-12 text-center max-w-2xl">
        Dive into a world of exciting subjects and fun challenges!&apos;
      </p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {subjects.map((subject) => (
          <Link key={subject.subjectId} href={`/learning-zone/subjects/${subject.subjectId}`}>
            <motion.div
              className={`${subjectColorMap[subject.subjectName] || subjectColorMap.default} text-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center h-64 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-b-8 border-opacity-50`}
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-3xl font-extrabold text-center drop-shadow-md">{subject.subjectName}</h2>
              <p className="mt-2 text-lg opacity-90">Start your adventure!</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
