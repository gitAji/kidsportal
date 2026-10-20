"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFire, FaBolt, FaTrophy, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useChild } from '../../providers/ChildProvider';
import MinimalBackButton from '../../components/child/MinimalBackButton';
import {
  getDailyChallengeQuestions,
  getDailyChallengeStats,
  hasCompletedToday,
  isStreakActive,
} from '../../utils/dailyChallenge';

export default function DailyChallengePage() {
  const { childUser } = useChild();
  const [stats, setStats] = useState({ streak: 0, bestStreak: 0, history: [] });
  const [completedToday, setCompletedToday] = useState(false);

  const childId = childUser?.uid || childUser?.id;

  useEffect(() => {
    if (!childId) return;
    setStats(getDailyChallengeStats(childId));
    setCompletedToday(hasCompletedToday(childId));
  }, [childId]);

  const questionCount = useMemo(
    () => (childUser?.gradeId ? getDailyChallengeQuestions(childUser.gradeId).length : 0),
    [childUser?.gradeId]
  );

  if (!childUser) return null;

  const streakAlive = isStreakActive(stats);

  return (
    <div className="flex flex-col p-2 sm:p-4 relative font-sans min-h-screen">
      {/* "Arena" background motif — fire/lightning/trophy, distinct from the
          arcade dice-and-puzzle motif on the Games hub. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-14 left-[7%] text-orange-200 opacity-50 text-7xl rotate-[-10deg]"><FaFire /></div>
        <div className="absolute top-28 right-[9%] text-amber-200 opacity-40 text-8xl rotate-12"><FaBolt /></div>
        <div className="absolute bottom-16 left-[12%] text-rose-200 opacity-40 text-6xl rotate-6"><FaTrophy /></div>
      </div>

      <MinimalBackButton />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-white px-6 py-1.5 rounded-full text-sm font-bold text-orange-600 mb-4 shadow-sm uppercase tracking-wider">
          <FaFire /> Daily Challenge
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 drop-shadow-sm tracking-tight">
          Practice Arena!
        </h1>
        <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
          A fresh mix of {questionCount || 6} quick questions from everything you&apos;re learning — come back every day to grow your streak!
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`rounded-[2rem] p-6 flex items-center gap-4 shadow-lg border-b-[8px] border-x-[4px] border-t-4 border-white/50 bg-gradient-to-br ${streakAlive && stats.streak > 0 ? 'from-orange-400 to-rose-500' : 'from-slate-300 to-slate-400'}`}>
            <FaFire className="text-4xl text-white drop-shadow" />
            <div>
              <p className="text-white/80 text-xs font-black uppercase tracking-widest">Current Streak</p>
              <p className="text-white text-3xl font-black">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
          <div className="rounded-[2rem] p-6 flex items-center gap-4 shadow-lg border-b-[8px] border-x-[4px] border-t-4 border-white/50 bg-gradient-to-br from-indigo-400 to-blue-500">
            <FaTrophy className="text-4xl text-white drop-shadow" />
            <div>
              <p className="text-white/80 text-xs font-black uppercase tracking-widest">Best Streak</p>
              <p className="text-white text-3xl font-black">{stats.bestStreak} {stats.bestStreak === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8 text-center mb-8">
          {questionCount === 0 ? (
            <>
              <h2 className="text-2xl font-black text-slate-800 mb-2">No challenge yet</h2>
              <p className="text-slate-500 font-bold">Finish a few lessons first — your Daily Challenge pulls questions from things you&apos;ve already learned!</p>
            </>
          ) : completedToday ? (
            <>
              <FaCheckCircle className="text-6xl text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-800 mb-2">Nice work — see you tomorrow!</h2>
              <p className="text-slate-500 font-bold mb-6">You&apos;ve finished today&apos;s challenge and your streak is safe. Want more practice anyway?</p>
              <Link href="/learning-zone/daily-challenge/play">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-white text-orange-600 font-black px-8 py-3.5 rounded-full text-base shadow-md border-2 border-orange-200 hover:bg-orange-50 transition-all cursor-pointer"
                >
                  Practice Again <FaArrowRight />
                </motion.div>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Ready for today&apos;s challenge?</h2>
              <p className="text-slate-500 font-bold mb-6">{questionCount} questions, mixed from all your subjects. Get them right to keep your streak alive!</p>
              <Link href="/learning-zone/daily-challenge/play">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-[#FF9F43] text-white font-black px-10 py-4 rounded-full text-lg shadow-[0_8px_0_#E07B20] hover:shadow-[0_4px_0_#E07B20] hover:translate-y-1 transition-all cursor-pointer"
                >
                  Start Challenge <FaArrowRight />
                </motion.div>
              </Link>
            </>
          )}
        </div>

        {stats.history?.length > 0 && (
          <div className="bg-white/70 rounded-[2rem] p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Recent Days</p>
            <div className="flex gap-2 flex-wrap">
              {stats.history.slice(-14).map((h) => (
                <div
                  key={h.date}
                  title={`${h.date}: ${h.correct}/${h.total}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shadow ${h.correct === h.total ? 'bg-emerald-400' : 'bg-amber-400'}`}
                >
                  {h.correct}/{h.total}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
