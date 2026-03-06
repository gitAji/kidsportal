"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useChild } from '@/app/providers/ChildProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile, FaStar, FaTrophy, FaSignOutAlt, FaCog, FaMedal, FaArrowLeft, FaHome, FaBolt } from 'react-icons/fa';
import { loadStats } from '@/app/utils/achievements';

export default function ChildLearningZoneHeader() {
  const { childUser } = useChild();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const [stats, setStats] = useState({ stars: 0, level: 1, points: 0 });

  useEffect(() => {
    const refreshHeaderStats = () => {
      const childId = childUser?.uid || childUser?.id;
      if (childId) {
        const localStats = loadStats(childId);
        setStats({
          stars: localStats.totalStars || 0,
          level: localStats.currentLevel || 1,
          points: localStats.totalScore || 0
        });
      }
    };

    refreshHeaderStats();
    // Refresh on focus (helpful when coming back from a task)
    window.addEventListener('focus', refreshHeaderStats);
    return () => window.removeEventListener('focus', refreshHeaderStats);
  }, [childUser]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setIsLoggingOut(true);

    // Smooth transition delay
    await new Promise(resolve => setTimeout(resolve, 800));

    localStorage.removeItem('childUser');
    sessionStorage.removeItem('childUser');
    router.push('/child-login');
  };

  if (!childUser && !isLoggingOut) return null;

  const renderAvatar = (large = false) => {
    const size = large ? 48 : 40;

    if (childUser?.photoURL) {
      return (
        <div className={`relative ${large ? 'w-12 h-12' : 'w-10 h-10'}`}>
          <Image
            src={childUser.photoURL}
            alt="Avatar"
            width={size}
            height={size}
            className="rounded-2xl object-cover w-full h-full border-2 border-white shadow-md"
          />
        </div>
      );
    }

    const iconClass = `${large ? 'w-12 h-12 text-2xl' : 'w-10 h-10 text-xl'} rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg border-2 border-white/50`;

    switch (childUser?.avatar) {
      case 'paw': return <div className={iconClass}><FaPaw /></div>;
      case 'rocket': return <div className={iconClass}><FaRocket /></div>;
      case 'car': return <div className={iconClass}><FaCar /></div>;
      case 'tree': return <div className={iconClass}><FaTree /></div>;
      case 'smile': return <div className={iconClass}><FaSmile /></div>;
      default: return <div className={iconClass}><FaUserCircle /></div>;
    }
  };

  return (
    <>
      {/* Logout Transition Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-center"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] animate-pulse absolute -inset-4 blur-2xl opacity-50" />
                <Image src="/logo.png" alt="Logo" width={200} height={60} className="relative z-10 w-auto h-16" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">{t('see_you_soon')}</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[4px] text-xs">{t('preparing_logout')}</p>

              <div className="mt-12 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-3 h-3 bg-blue-600 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-[400] w-full px-4 py-3">
        {/* Main Header Bar (Row 1) */}
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-full px-6 py-2 flex items-center justify-between mb-3 ring-8 ring-white/10">

          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/learning-zone" className="group flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative flex items-center h-14 md:h-16">
                <Image src="/logo.png" alt="KidsPortal" width={180} height={50} className="w-auto h-10 md:h-12 drop-shadow-sm object-contain" />
              </div>
            </Link>
          </div>

          {/* Center: Dynamic Stats (Visible on desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 bg-amber-50/50 border border-amber-100 rounded-2xl px-4 py-1.5 shadow-sm transition-transform hover:scale-105">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                <FaStar className="animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700/60 leading-none mb-0.5">{t('stars_earned')}</span>
                <span className="text-sm font-black text-amber-900 leading-none">{stats.stars}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-1.5 shadow-sm transition-transform hover:scale-105">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <FaTrophy />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700/60 leading-none mb-0.5">{t('current_level')}</span>
                <span className="text-sm font-black text-blue-900 leading-none">{stats.level}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-purple-50/50 border border-purple-100 rounded-2xl px-4 py-1.5 shadow-sm transition-transform hover:scale-105">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                <FaBolt />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-700/60 leading-none mb-0.5">XP Points</span>
                <span className="text-sm font-black text-purple-900 leading-none">{stats.points}</span>
              </div>
            </div>
          </div>

          {/* Right: Profile & Dropdown */}
          <div className="flex items-center gap-3">
            {/* Mobile Stars Indicator */}
            <div className="md:hidden flex items-center gap-1.5 bg-amber-100/50 px-3 py-1.5 rounded-full border border-amber-200">
              <FaStar className="text-amber-500 text-xs" />
              <span className="text-xs font-black text-amber-700">{stats.stars}</span>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-2xl transition-all hover:bg-slate-50 active:scale-95 group"
              >
                {renderAvatar()}
                <div className="hidden sm:flex flex-col items-start px-1 mr-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none mb-1">
                    {childUser?.name || 'Explorer'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 leading-none">
                    {childUser?.grade || 'Lvl ' + stats.level}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                    className="absolute right-0 top-full mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[500]"
                  >
                    {/* Dropdown Header */}
                    <div className="bg-gradient-to-br from-slate-50 to-white px-6 py-6 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        {renderAvatar(true)}
                        <div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{childUser?.name}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('explorer_rank')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Content */}
                    <div className="p-3">
                      <Link
                        href="/learning-zone/rewards"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-black text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <FaMedal />
                        </div>
                        <span>{t('achievements')}</span>
                      </Link>

                      <Link
                        href="/learning-zone/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-black text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <FaCog />
                        </div>
                        <span>{t('settings')}</span>
                      </Link>

                      <div className="my-2 border-t border-slate-50" />

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-3xl text-sm font-black text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center text-lg group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                          <FaSignOutAlt />
                        </div>
                        <span>{t('logout')}</span>
                      </button>
                    </div>

                    {/* Dropdown Footer */}
                    <div className="bg-slate-50/50 px-6 py-3 text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[3px]">{t('next_level')}: {stats.level + 1}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}
