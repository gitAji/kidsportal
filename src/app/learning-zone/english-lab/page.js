"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBook } from 'react-icons/fa';
import { useChild } from '../../providers/ChildProvider';
import { getTimeStatus } from '@/app/utils/timeLimits';
import { getChildStats } from '@/app/utils/firestoreService';
import TimeLimitBlockedScreen from '../../components/child/TimeLimitBlockedScreen';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import MinimalBackButton from '../../components/child/MinimalBackButton';
import TileBuilder from '../../components/buildLab/TileBuilder';
import englishLevels from '../../components/buildLab/englishLevels';

export default function EnglishLabPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <MinimalBackButton />
      <div className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider mb-4">
            <FaBook /> Build Lab
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 drop-shadow-sm">
            Tap Words, Build Sentences!
          </h1>
          <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto">
            Read the clue, then tap the words in the right order to build the sentence.
          </p>
        </motion.div>

        <TileBuilder levels={englishLevels} accent="amber" promptLabel="Build this sentence" />
      </div>
    </div>
  );
}
