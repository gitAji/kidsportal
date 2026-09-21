'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomAvatar from '../ui/CustomAvatar';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChartBar, FaStar, FaCheckCircle } from 'react-icons/fa';
import { getChildStats } from '@/app/utils/firestoreService';
import { loadStats } from '@/app/utils/achievements';

function formatLastActive(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return 'Active now';
  if (diffMins < 60) return `Active ${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `Active ${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `Active ${diffDays}d ago`;
  return `Active ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
}

function ChildQuickStats({ childId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fs = await getChildStats(childId);
        if (!cancelled) setStats(Object.keys(fs).length ? fs : loadStats(childId));
      } catch {
        if (!cancelled) setStats(loadStats(childId));
      }
    })();
    return () => { cancelled = true; };
  }, [childId]);

  if (!stats) {
    return (
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
      </div>
    );
  }

  const tasks = stats.totalTasksCompleted || 0;
  const xp = stats.totalScore || 0;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
        <FaCheckCircle className="text-[10px]" /> {tasks} tasks
      </span>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
        <FaStar className="text-[10px]" /> {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!auth.currentUser) {
        setError("No user logged in.");
        setLoading(false);
        return;
      }

      try {
        const parentUid = auth.currentUser.uid;
        const childrenCollectionRef = collection(db, 'users', parentUid, 'children');
        const q = query(childrenCollectionRef);

        const querySnapshot = await getDocs(q);

        const childrenData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          parentUid: parentUid,
        }));

        setChildren(childrenData);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to load children data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleManageChild = (child) => {
    sessionStorage.setItem('childUser', JSON.stringify(child));
    router.push('/child-dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-5xl"
        >
          🎨
        </motion.div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 font-black bg-red-50 p-6 rounded-[2rem] border-2 border-red-100">Error: {error}</p>;
  }

  if (children.length === 0) {
    return (
      <div className="text-center p-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="text-6xl mb-6 text-slate-300">👋</div>
        <p className="text-xl text-slate-800 font-bold">Your explorers are waiting!</p>
        <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto text-sm">Click &quot;Add Child&quot; to launch their first learning adventure.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children.map((child, index) => {
          const lastActive = formatLastActive(child.lastActive);
          return (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-xl transition-all"
            >
              <div
                onClick={() => handleManageChild(child)}
                className="flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <CustomAvatar child={child} size="text-3xl" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-800 truncate">{child.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Grade {child.grade} Explorer</span>
                      {lastActive && (
                        <span className="text-[10px] font-bold text-slate-400">• {lastActive}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all flex-shrink-0">
                  <FaArrowRight className="text-sm" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <ChildQuickStats childId={child.id} />
                <Link
                  href={`/analytics/${child.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-500 hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  <FaChartBar className="text-[10px]" /> Report
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChildrenList;