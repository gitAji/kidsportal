"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLock, FaPlay, FaStar, FaGamepad } from 'react-icons/fa';
import { useChild } from '../../providers/ChildProvider';
import dbData from '../../data/db.json';
import { loadStats } from '../../utils/achievements';
import { loadGameStats, hasCompletedLessonInSubject } from '../../utils/gameStats';
import { getGamesForGrade, CODING_GAME_LINK } from '../../components/games/gamesContent';
import MinimalBackButton from '../../components/child/MinimalBackButton';

export default function GamesHubPage() {
  const { childUser } = useChild();

  const games = useMemo(() => getGamesForGrade(childUser?.gradeId), [childUser?.gradeId]);

  const childId = childUser?.uid || childUser?.id;
  const completedTasksList = childId ? (loadStats(childId).completedTasks_list || []) : [];
  const gameStats = childId ? loadGameStats(childId) : {};

  if (!childUser) return null;

  return (
    <div className="flex flex-col p-2 sm:p-4 relative font-sans">
      <MinimalBackButton />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-white px-6 py-1.5 rounded-full text-sm font-bold text-violet-600 mb-4 shadow-sm uppercase tracking-wider">
          <FaGamepad /> {childUser.grade} Games
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 drop-shadow-sm tracking-tight">
          Learn by Playing!
        </h1>
        <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
          Finish a subject's lesson to unlock its game, then come back here to play anytime.
        </p>
      </motion.div>

      {games.length === 0 && (
        <p className="text-center text-slate-500 font-bold bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto">
          No games are available for your grade just yet — more are on the way!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {games.map((game) => {
          const unlocked = hasCompletedLessonInSubject(completedTasksList, dbData, childUser.gradeId, game.subjectId);
          const bestStars = gameStats?.bestStars?.[game.id] || 0;

          const CardInner = (
            <motion.div
              whileHover={unlocked ? { scale: 1.03, y: -6 } : {}}
              whileTap={unlocked ? { scale: 0.97 } : {}}
              className={`relative h-[220px] rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl border-b-[8px] border-x-[4px] border-t-4 border-white/50 bg-gradient-to-br ${game.color} ${unlocked ? 'cursor-pointer' : 'opacity-60 grayscale cursor-not-allowed'}`}
            >
              <div className="absolute -bottom-6 -right-6 text-7xl opacity-20">{game.icon}</div>
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest text-white/80 mb-1">{game.subjectLabel}</p>
                <h2 className="text-2xl font-extrabold text-white drop-shadow-md leading-tight">{game.title}</h2>
                <p className="text-white/90 text-sm font-medium mt-2">{game.description}</p>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                {unlocked ? (
                  <div className="flex items-center gap-2 text-white font-bold bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md text-sm">
                    <FaPlay className="text-xs" /> Play
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white font-bold bg-black/30 w-fit px-4 py-2 rounded-full backdrop-blur-md text-sm">
                    <FaLock className="text-xs" /> Finish a lesson first
                  </div>
                )}
                {bestStars > 0 && (
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2].map(i => (
                      <FaStar key={i} className={i < bestStars ? 'text-yellow-300' : 'text-white/30'} size={16} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );

          return unlocked ? (
            <Link key={game.id} href={`/learning-zone/games/${game.id}`}>{CardInner}</Link>
          ) : (
            <div key={game.id}>{CardInner}</div>
          );
        })}

        {/* Coding Build Lab — reused, not duplicated, and always open */}
        <Link href={CODING_GAME_LINK.href}>
          <motion.div
            whileHover={{ scale: 1.03, y: -6 }}
            whileTap={{ scale: 0.97 }}
            className={`relative h-[220px] rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl border-b-[8px] border-x-[4px] border-t-4 border-white/50 bg-gradient-to-br ${CODING_GAME_LINK.color} cursor-pointer`}
          >
            <div className="absolute -bottom-6 -right-6 text-7xl opacity-20">{CODING_GAME_LINK.icon}</div>
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest text-white/80 mb-1">{CODING_GAME_LINK.subjectLabel}</p>
              <h2 className="text-2xl font-extrabold text-white drop-shadow-md leading-tight">{CODING_GAME_LINK.title}</h2>
              <p className="text-white/90 text-sm font-medium mt-2">{CODING_GAME_LINK.description}</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-white font-bold bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md text-sm">
              <FaPlay className="text-xs" /> Play
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
