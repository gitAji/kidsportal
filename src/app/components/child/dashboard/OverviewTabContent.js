"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile,
  FaStar, FaTrophy, FaFire, FaMedal, FaPlay,
} from 'react-icons/fa';
import { useChild } from '@/app/providers/ChildProvider';
import { loadStats, computeStreak } from '@/app/utils/achievements';

const AVATAR_ICONS = { paw: FaPaw, rocket: FaRocket, car: FaCar, tree: FaTree, smile: FaSmile };

// The Overview tab of the Dashboard — a quick-glance summary (level, XP,
// streak, stars) plus shortcuts to the things that used to live as
// separate links in the profile dropdown (Home, Daily Challenge).
export default function OverviewTabContent() {
  const { childUser } = useChild();
  const [stats, setStats] = useState({ stars: 0, level: 1, points: 0, streak: 0 });

  useEffect(() => {
    const childId = childUser?.uid || childUser?.id;
    if (!childId) return;
    const localStats = loadStats(childId);
    setStats({
      stars: localStats.totalStars || 0,
      level: localStats.currentLevel || 1,
      points: localStats.totalScore || 0,
      streak: computeStreak(localStats.uniqueDays_list),
    });
  }, [childUser]);

  const xpIntoLevel = stats.points % 100;

  const renderAvatar = () => {
    if (childUser?.photoURL) {
      return (
        <Image
          src={childUser.photoURL}
          alt={childUser.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-lg"
        />
      );
    }
    const AvatarIcon = AVATAR_ICONS[childUser?.avatar] || FaUserCircle;
    return (
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl shadow-lg border-4 border-white">
        <AvatarIcon />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile summary */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-5">
          {renderAvatar()}
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-800 truncate">{childUser?.name}</h2>
            <p className="text-slate-400 text-sm font-bold">{childUser?.grade}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="flex items-center gap-1.5 text-xs font-black text-slate-500 uppercase tracking-wider">
            <FaTrophy className="text-amber-400" /> Level {stats.level}
          </span>
          <span className="text-xs font-black text-slate-400">{xpIntoLevel}/100 XP</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpIntoLevel}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-3 rounded-2xl">
            <FaStar /> <span className="font-black text-lg">{stats.stars}</span> <span className="text-xs font-bold uppercase">Stars</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-3 rounded-2xl">
            <FaFire /> <span className="font-black text-lg">{stats.streak}</span> <span className="text-xs font-bold uppercase">Day streak</span>
          </div>
        </div>
      </motion.div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/learning-zone">
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer h-full">
            <div>
              <p className="font-black text-lg leading-tight">Keep Learning</p>
              <p className="text-white/80 text-xs font-bold mt-0.5">Back to your subjects</p>
            </div>
            <FaPlay className="text-2xl opacity-80" />
          </motion.div>
        </Link>
        <Link href="/learning-zone/daily-challenge">
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer h-full">
            <div>
              <p className="font-black text-lg leading-tight">Daily Challenge</p>
              <p className="text-white/80 text-xs font-bold mt-0.5">Keep your streak going</p>
            </div>
            <FaMedal className="text-2xl opacity-80" />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
