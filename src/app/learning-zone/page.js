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
import { FaBookOpen, FaCalculator, FaMicroscope, FaLanguage, FaStar, FaPlay, FaCode, FaLaptopCode, FaGamepad } from 'react-icons/fa';
import { getChildStats } from '@/app/utils/firestoreService';
import { getTimeStatus } from '@/app/utils/timeLimits';
import TimeLimitBlockedScreen from '../components/child/TimeLimitBlockedScreen';

const subjectStyleMap = {
  "English": { bg: "bg-[#FF9B9B]", border: "border-[#FF7272]", shadow: "shadow-[#FF7272]", icon: "text-[#FF7272]" },
  "Math": { bg: "bg-[#72C6FF]", border: "border-[#40A5E5]", shadow: "shadow-[#40A5E5]", icon: "text-[#40A5E5]" },
  "Tamil": { bg: "bg-[#72E5A8]", border: "border-[#4CC287]", shadow: "shadow-[#4CC287]", icon: "text-[#4CC287]" },
  "Science": { bg: "bg-[#FFC972]", border: "border-[#E5A840]", shadow: "shadow-[#E5A840]", icon: "text-[#E5A840]" },
  "Coding": { bg: "bg-[#C48CFF]", border: "border-[#A05CFF]", shadow: "shadow-[#A05CFF]", icon: "text-[#A05CFF]" },
  "Computer Science": { bg: "bg-[#8CEFFF]", border: "border-[#5CCEE5]", shadow: "shadow-[#5CCEE5]", icon: "text-[#5CCEE5]" },
  "default": { bg: "bg-[#D1D5DB]", border: "border-[#9CA3AF]", shadow: "shadow-[#9CA3AF]", icon: "text-[#9CA3AF]" },
};

const subjectIconMap = {
  "English": FaBookOpen,
  "Math": FaCalculator,
  "Tamil": FaLanguage,
  "Science": FaMicroscope,
  "Coding": FaCode,
  "Computer Science": FaLaptopCode,
  "default": FaStar,
};

export default function LearningZonePage() {
  const { childUser } = useChild();
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [timeStatus, setTimeStatus] = useState(null);

  const professor = React.useMemo(() => {
    const char = childUser?.professorCharacter || 'owl';
    if (char === 'panda') return { name: t('panda_name'), img: '/images/smart-panda.png', emoji: '🐼' };
    return { name: t('owl_name'), img: '/images/professor-owl.png', emoji: '🦉' };
  }, [childUser, t]);

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

  return (
    <div className="flex flex-col items-center sm:p-4 relative font-sans">

      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-6 mb-12"
      >
        <div className="bg-white/80 backdrop-blur-xl border-4 border-white shadow-xl rounded-[2.5rem] p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
             <Image src={professor.img} alt={professor.name} fill className="object-contain scale-[0.85] translate-y-2" priority />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full font-black text-sm uppercase tracking-widest mb-3 border border-yellow-200 shadow-sm">
               <FaStar /> Grade {childUser.gradeId} Explorer
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{childUser.name}</span>!
            </h1>
            <p className="text-lg sm:text-xl font-bold text-slate-500">
              What adventure are we going on today? 🚀
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto z-10 relative">
        
        {/* Games Promo Card */}
        <Link href="/learning-zone/games">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#FF79B3] rounded-[2.5rem] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 shadow-[0_12px_0_#DF5593] hover:shadow-[0_8px_0_#DF5593] hover:translate-y-1 transition-all border-[6px] border-white cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center shadow-inner border-4 border-white/30">
                <FaGamepad className="text-5xl text-white drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md mb-1">Play Games!</h2>
                <p className="text-white/90 font-bold text-lg">Earn stars and learn while having fun.</p>
              </div>
            </div>
            <div className="bg-white text-[#DF5593] px-8 py-4 rounded-full font-black text-lg shadow-lg flex items-center gap-3 active:scale-95 transition-transform">
              <FaPlay /> GO!
            </div>
          </motion.div>
        </Link>

        {/* Subjects Grid */}
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="w-2 h-8 bg-blue-500 rounded-full" />
           <h2 className="text-3xl font-black text-slate-700">Your Subjects</h2>
        </div>

        {subjectsLoading ? (
          <SkeletonLoader variant="subjects" count={6} />
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-20"
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {subjects.map((subject) => {
              const Icon = subjectIconMap[subject.subjectName] || subjectIconMap.default;
              const style = subjectStyleMap[subject.subjectName] || subjectStyleMap.default;
              const displayName = t(`subjects.${subject.subjectName}`) || subject.subjectName;

              return (
                <Link key={subject.subjectId} href={`/learning-zone/subjects/${subject.subjectId}`}>
                  <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.5 } } }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${style.bg} ${style.border} border-b-[8px] border-r-[4px] border-l-4 border-t-4 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:shadow-xl transition-all h-[240px] relative overflow-hidden`}
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/5 rounded-full blur-xl" />
                    
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-4 relative z-10">
                      <Icon className={`text-5xl ${style.icon}`} />
                    </div>
                    <h3 className="text-2xl font-black text-white drop-shadow-sm relative z-10">{displayName}</h3>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>

    </div>
  );
}
