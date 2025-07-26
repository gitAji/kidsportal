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
    <div className="p-4 sm:p-6 md:p-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {subjects.map((subject) => (
          <Link key={subject.subjectId} href={`/learning-zone/subjects/${subject.subjectId}`}>
            <motion.div
              className={`${subjectColorMap[subject.subjectName] || subjectColorMap.default} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center h-48 cursor-pointer`}
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-2xl font-bold text-center">{subject.subjectName}</h2>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
