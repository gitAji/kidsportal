"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useChild } from '../providers/ChildProvider';
import { useLanguage } from '../providers/LanguageProvider';
import { getSubjectsByGrade } from '../utils/learningData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { FaBookOpen, FaCalculator, FaMicroscope, FaLanguage, FaStar, FaPlay } from 'react-icons/fa';

// A map for sleek subject styling
const subjectStyleMap = {
  "English": {
    gradient: "from-blue-400 to-indigo-600",
    shadow: "shadow-blue-500/50",
    iconColor: "text-blue-100",
    bgPattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent"
  },
  "Math": {
    gradient: "from-rose-400 to-red-600",
    shadow: "shadow-red-500/50",
    iconColor: "text-red-100",
    bgPattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-300/20 via-transparent to-transparent"
  },
  "Tamil": {
    gradient: "from-emerald-400 to-green-600",
    shadow: "shadow-green-500/50",
    iconColor: "text-green-100",
    bgPattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-300/20 via-transparent to-transparent"
  },
  "Science": {
    gradient: "from-amber-400 to-orange-600",
    shadow: "shadow-orange-500/50",
    iconColor: "text-orange-100",
    bgPattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent"
  },
  "Ariviyal": {
    gradient: "from-amber-400 to-orange-600",
    shadow: "shadow-orange-500/50",
    iconColor: "text-orange-100",
    bgPattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent"
  },
  "default": {
    gradient: "from-gray-400 to-slate-600",
    shadow: "shadow-slate-500/50",
    iconColor: "text-slate-100",
    bgPattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-300/20 via-transparent to-transparent"
  }
};

const subjectIconMap = {
  "English": FaBookOpen,
  "Math": FaCalculator,
  "Tamil": FaLanguage,
  "Science": FaMicroscope,
  "Ariviyal": FaMicroscope,
  "default": FaStar,
};

// Floating animation for background elements
const floatingAnimation = {
  y: ["-10px", "10px"],
  x: ["-5px", "5px"],
  transition: {
    duration: 4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
};

export default function LearningZonePage() {
  const { childUser } = useChild();
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [greeting, setGreeting] = useState(null);
  const router = useRouter();

  const professor = React.useMemo(() => {
    const char = childUser?.professorCharacter || 'owl';
    if (char === 'panda') return { name: 'Smart Panda', img: '/images/smart-panda.png', emoji: '🐼' };
    return { name: 'Professor Owl', img: '/images/professor-owl.png', emoji: '🦉' };
  }, [childUser]);

  useEffect(() => {
    if (childUser && !subjectsLoading) {
      const timer = setTimeout(() => {
        setGreeting(`Hey ${childUser.name}! Which adventure should we start today? ${professor.emoji}`);
      }, 2000);
      const clearTimer = setTimeout(() => setGreeting(null), 10000);
      return () => { clearTimeout(timer); clearTimeout(clearTimer); };
    }
  }, [childUser, subjectsLoading]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!childUser) return;
      setSubjectsLoading(true);

      // Fetch the parent's selected learning subjects
      let learningSubjects = childUser.learningSubjects || ['English', 'Math', 'Science', 'Tamil'];
      try {
        if (childUser.parentUid) {
          const parentSnap = await getDoc(doc(db, 'users', childUser.parentUid));
          if (parentSnap.exists()) {
            learningSubjects = parentSnap.data().learningSubjects || learningSubjects; // Use parent's preference, or fallback to childUser's/default
          }
        }
      } catch (err) {
        console.error('Error fetching parent subject preferences:', err);
      }

      const fetchedSubjects = getSubjectsByGrade(childUser.gradeId, learningSubjects);
      setSubjects(fetchedSubjects);
      setTimeout(() => setSubjectsLoading(false), 800);
    };

    loadSubjects();
  }, [childUser]);

  if (!childUser) {
    return null;
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  if (!childUser.isSubscriptionActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 max-w-xl w-full"
        >
          <div className="text-7xl mb-6">🏜️</div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">{t('adventure_on_hold')}</h1>
          <p className="text-lg text-slate-600 mb-8 font-medium">
            {t('trial_ended')}
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/child-login')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all font-mono tracking-widest text-sm"
            >
              {t('log_out')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 md:p-12 relative overflow-hidden">

      {/* Animated Gradient Background Orbs */}
      <motion.div animate={floatingAnimation} className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></motion.div>
      <motion.div animate={{ ...floatingAnimation, transition: { duration: 5, repeat: Infinity, repeatType: "reverse" } }} className="absolute top-20 -right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></motion.div>
      <motion.div animate={{ ...floatingAnimation, transition: { duration: 6, repeat: Infinity, repeatType: "reverse" } }} className="absolute -bottom-40 left-1/3 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-center z-10 w-full max-w-4xl mx-auto mb-16 mt-8"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-slate-100 mb-6">
          <FaStar className="text-yellow-400" />
          <p className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-widest">
            {childUser.grade} {t('explorer')}
          </p>
          <FaStar className="text-yellow-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight">
          {t('welcome')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">{childUser.name}!</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {t('ready_adventure')}
        </p>
      </motion.div>

      {subjectsLoading ? (
        <div className="w-full max-w-7xl z-10 px-4">
          <SkeletonLoader variant="subjects" count={6} />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl z-10 pb-20 px-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {subjects.map((subject) => {
            const Icon = subjectIconMap[subject.subjectName] || subjectIconMap.default;
            const style = subjectStyleMap[subject.subjectName] || subjectStyleMap.default;
            // Show translated subject name
            const displayName = t(`subjects.${subject.subjectName}`) || subject.subjectName;

            return (
              <Link key={subject.subjectId} href={`/learning-zone/subjects/${subject.subjectId}`}>
                <motion.div
                  className={`relative h-[240px] sm:h-[260px] rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer overflow-hidden group border-b-[6px] border-black/10 bg-gradient-to-br ${style.gradient} ${style.shadow} hover:shadow-2xl transition-shadow duration-300`}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Texture Pattern Overlay */}
                  <div className={`absolute inset-0 ${style.bgPattern}`}></div>

                  {/* Big decorative background icon */}
                  <div className="absolute -bottom-6 -right-6 text-white opacity-20 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 ease-out">
                    <Icon size={140} />
                  </div>

                  <div className="relative z-10">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:bg-white/30 transition-colors duration-300">
                      <Icon size={32} className="text-white drop-shadow-sm" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white drop-shadow-md tracking-tight leading-tight">
                      {displayName}
                    </h2>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white font-bold bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md group-hover:bg-black/30 transition-colors text-sm">
                      <FaPlay className="text-xs" /> {t('play_now')}
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      )}

      {/* Persistent Professor Guide */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
        <AnimatePresence>
          {greeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl rounded-br-sm shadow-2xl p-5 mb-4 max-w-xs border-4 border-indigo-200 pointer-events-auto relative z-40"
            >
              <div className="absolute top-0 right-0 p-1 opacity-10">
                <FaStar className="text-yellow-400 text-xs" />
              </div>
              <p className="font-bold text-slate-700 leading-snug">
                {greeting}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative pointer-events-auto group mt-2">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg border border-slate-700 z-40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {professor.name}
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center relative z-20 group"
          >
            <div className="relative w-full h-full bg-white rounded-full border-[5px] border-indigo-200 shadow-[0_10px_25px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-indigo-400 group-hover:shadow-[0_15px_35px_rgba(99,102,241,0.3)]">
              <div className="relative w-[85%] h-[85%] mt-3">
                <Image
                  src={professor.img}
                  alt={professor.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
