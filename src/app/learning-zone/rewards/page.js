"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChild } from '../../providers/ChildProvider';
import { ACHIEVEMENTS, loadUnlockedAchievements, loadStats } from '../../utils/achievements';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import MinimalBackButton from '../../components/child/MinimalBackButton';

export default function RewardsPage() {
  const { childUser } = useChild();
  const router = useRouter();
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [stats, setStats] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childUser) { router.push('/child-login'); return; }

    const loadData = async () => {
      // Load from localStorage first for instant display
      const childId = childUser.uid || childUser.id;
      const localUnlocked = loadUnlockedAchievements(childId);
      const localStats = loadStats(childId);
      setUnlockedIds(new Set(localUnlocked));
      setStats(localStats);
      setLoading(false);

      // Then try to fetch from Firestore via API route (uses Admin SDK)
      try {
        const res = await fetch(`/api/child-stats?childId=${childId}&parentUid=${childUser.parentUid}`);
        if (res.ok) {
          const { stats: fsStats, achievements: fsAchs } = await res.json();
          if (fsAchs && fsAchs.length > 0) setUnlockedIds(new Set(fsAchs.map(a => a.achievementId)));
          if (fsStats && Object.keys(fsStats).length > 0) setStats(fsStats);
        }
      } catch (e) { /* use local fallback */ }
    };

    loadData();
  }, [childUser, router]);

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedIds.has(a.id)).length;
  const total = ACHIEVEMENTS.length;

  const filters = [
    { key: 'all', label: '🎖 All' },
    { key: 'unlocked', label: '✅ Earned' },
    { key: 'locked', label: '🔒 Locked' },
  ];

  const displayed = ACHIEVEMENTS.filter(a => {
    if (activeFilter === 'unlocked') return unlockedIds.has(a.id);
    if (activeFilter === 'locked') return !unlockedIds.has(a.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      <MinimalBackButton />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-700 flex items-center justify-center gap-3">
            <FaTrophy /> My Rewards
          </h1>
        </motion.div>

        {/* Stats Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-cyan-200 text-sm font-semibold uppercase tracking-widest mb-1">Achievements</p>
            <p className="text-6xl font-black">{unlockedCount}<span className="text-cyan-300 text-3xl">/{total}</span></p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center mt-6 sm:mt-0">
            <div className="bg-white/20 rounded-2xl p-3">
              <div className="text-2xl font-black">{stats.totalScore || 0}</div>
              <div className="text-xs text-cyan-200 font-semibold">Points</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3">
              <div className="text-2xl font-black">{stats.totalTasksCompleted || 0}</div>
              <div className="text-xs text-cyan-200 font-semibold">Tasks</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3">
              <div className="text-2xl font-black">{stats.uniqueDays || 0}</div>
              <div className="text-xs text-cyan-200 font-semibold">🔥 Days</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 border border-yellow-300">
              <div className="text-2xl font-black text-yellow-300">{stats.goldMedals || 0}</div>
              <div className="text-xs text-yellow-100 font-semibold">🏆 Gold</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 border border-slate-300">
              <div className="text-2xl font-black text-slate-300">{stats.silverMedals || 0}</div>
              <div className="text-xs text-slate-100 font-semibold">🥈 Silver</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 border border-orange-300">
              <div className="text-2xl font-black text-orange-300">{stats.bronzeMedals || 0}</div>
              <div className="text-xs text-orange-100 font-semibold">🥉 Bronze</div>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold text-cyan-700 mb-2">
            <span>Collection Progress</span>
            <span>{Math.round((unlockedCount / total) * 100)}%</span>
          </div>
          <div className="h-4 bg-cyan-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(unlockedCount / total) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeFilter === f.key ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200' : 'bg-white text-cyan-600 border border-cyan-200 hover:bg-cyan-50'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Achievement grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <SkeletonLoader variant="subjects" message="Unlocking your rewards..." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {displayed.map((ach, i) => {
                const isUnlocked = unlockedIds.has(ach.id);
                return (
                  <motion.div key={ach.id} layout
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.03 }}
                    className={`relative rounded-3xl p-5 text-center border-2 shadow-md transition-all duration-300 overflow-hidden ${isUnlocked
                      ? `bg-gradient-to-br ${ach.color} ${ach.border} shadow-lg`
                      : 'bg-white border-gray-200 opacity-60'
                      }`}>
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-[2px] rounded-3xl">
                        <FaLock className="text-gray-400 text-3xl" />
                      </div>
                    )}
                    <div className="text-5xl mb-3">{isUnlocked ? ach.emoji : '❓'}</div>
                    <p className={`font-extrabold text-sm leading-tight ${isUnlocked ? 'text-white drop-shadow' : 'text-gray-400'}`}>
                      {isUnlocked ? ach.name : 'Locked'}
                    </p>
                    {isUnlocked && <p className="text-white/80 text-xs mt-1 leading-snug">{ach.description}</p>}
                    {isUnlocked && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-7 h-7 flex items-center justify-center shadow-md text-sm font-black border-2 border-white">✓</div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {displayed.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl font-bold text-cyan-600">No achievements yet!</p>
            <p className="text-gray-500 mt-2">Complete tasks to earn rewards.</p>
            <Link href="/learning-zone" className="mt-6 inline-block bg-cyan-600 text-white font-bold px-8 py-3 rounded-full hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200">
              Start Learning →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
