"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCode } from 'react-icons/fa';
import { useChild } from '../../providers/ChildProvider';
import { getTimeStatus } from '@/app/utils/timeLimits';
import { getChildStats } from '@/app/utils/firestoreService';
import TimeLimitBlockedScreen from '../../components/child/TimeLimitBlockedScreen';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import CodingLab from '../../components/codingLab/CodingLab';

export default function CodingLabPage() {
  const { childUser } = useChild();
  const router = useRouter();
  const [timeStatus, setTimeStatus] = useState(null);

  useEffect(() => {
    if (!childUser && !sessionStorage.getItem('childUser')) {
      router.push('/child-login');
    }
  }, [childUser, router]);

  // Same screen-time gate as the subject/level pages: checked once on entry,
  // never mid-program, so a limit hit doesn't interrupt a maze in progress.
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
        console.error('Failed to check time status', err);
        setTimeStatus(getTimeStatus({ timeLimits: childUser.timeLimits }));
      }
    };
    checkTimeStatus();
  }, [childUser?.id, childUser?.timeLimits]);

  if (!childUser) return <SkeletonLoader />;
  if (timeStatus?.isBlocked) return <TimeLimitBlockedScreen status={timeStatus} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider mb-4">
          <FaCode /> Build Lab
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-600 drop-shadow-sm">
          Snap Blocks, Build Things!
        </h1>
        <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
          Drag blocks together to guide a robot through a maze, recreate patterns, or draw whatever you like.
        </p>
      </motion.div>

      <CodingLab />
    </div>
  );
}
