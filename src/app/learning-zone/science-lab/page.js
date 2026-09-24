"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import { useChild } from '../../providers/ChildProvider';
import { getTimeStatus } from '@/app/utils/timeLimits';
import { getChildStats } from '@/app/utils/firestoreService';
import TimeLimitBlockedScreen from '../../components/child/TimeLimitBlockedScreen';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import MinimalBackButton from '../../components/child/MinimalBackButton';
import SortBuilder from '../../components/buildLab/SortBuilder';
import scienceLevels from '../../components/buildLab/scienceLevels';

export default function ScienceLabPage() {
  const { childUser } = useChild();
  const router = useRouter();
  const [timeStatus, setTimeStatus] = useState(null);

  useEffect(() => {
    if (!childUser && !sessionStorage.getItem('childUser')) {
      router.push('/child-login');
    }
  }, [childUser, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <MinimalBackButton />
      <div className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider mb-4">
            <FaLeaf /> Build Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 drop-shadow-sm">
            Sort Creatures, Build Habitats!
          </h1>
          <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
            Tap a creature, then tap the habitat where it really lives.
          </p>
        </motion.div>

        <SortBuilder levels={scienceLevels} accent="emerald" />
      </div>
    </div>
  );
}
