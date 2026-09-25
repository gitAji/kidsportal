"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dbData from '../../data/db.json';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

import MinimalBackButton from '../../components/child/MinimalBackButton';
import { motion } from 'framer-motion';

export default function SubjectsPage() {
  const [childUser, setChildUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedUser = JSON.parse(storedChildUser);
      setChildUser(parsedUser);

      const gradeData = dbData.grades.find(g => g.gradeName === parsedUser.grade);
      if (gradeData) {
        setSubjects(gradeData.subjects);
      } else {
        setSubjects([]);
      }
    } else {
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]);

  if (loading) return <SkeletonLoader />;
  if (!childUser) return null; // Redirecting

  return (
    <div className="flex flex-col p-2 sm:p-4 relative font-sans">
      <MinimalBackButton />
      
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 mt-6"
      >
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 drop-shadow-sm tracking-tight mb-4">
          Choose a Subject!
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          What would you like to learn today? Pick a subject below to start your adventure.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {subjects.length > 0 ? (
          subjects.map((subject, index) => {
            // Assign a color dynamically based on index
            const colors = [
              "bg-[#FF9B9B] border-[#FF7272]",
              "bg-[#72C6FF] border-[#40A5E5]",
              "bg-[#72E5A8] border-[#4CC287]",
              "bg-[#FFC972] border-[#E5A840]",
              "bg-[#C48CFF] border-[#A05CFF]",
              "bg-[#8CEFFF] border-[#5CCEE5]"
            ];
            const colorClass = colors[index % colors.length];

            return (
              <motion.div
                key={subject.subjectId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/learning-zone/subjects/${subject.subjectId}`)}
                className={`${colorClass} text-white rounded-[2.5rem] shadow-lg hover:shadow-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group border-b-[8px] border-x-[4px] border-t-4 border-white/50`}
              >
                {subject.image && (
                  <div className="relative w-32 h-32 mb-6 drop-shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Image src={subject.image} alt={subject.subjectName} fill className="object-contain" />
                  </div>
                )}
                <h2 className="text-3xl font-black drop-shadow-md">{subject.subjectName}</h2>
                {subject.description && (
                  <p className="text-white/90 font-medium mt-3 text-sm">{subject.description}</p>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 bg-white/60 backdrop-blur-sm rounded-[3rem] border-4 border-white shadow-xl">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-black text-slate-700">No subjects found for your grade yet!</p>
            <p className="text-slate-500 font-medium mt-2">Check back later or ask your parent.</p>
          </div>
        )}
      </div>
    </div>
  );
}
