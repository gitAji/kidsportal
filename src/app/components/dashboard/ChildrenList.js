'use client';

import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, query, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomAvatar from '../ui/CustomAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaChartBar, FaStar, FaCheckCircle, FaGraduationCap, FaClock, FaTimes, FaPlay, FaUserCircle, FaKey } from 'react-icons/fa';
import { getChildStats, grantBonusTime } from '@/app/utils/firestoreService';
import { loadStats } from '@/app/utils/achievements';
import { computeLevelProgress } from '@/app/utils/childProgress';
import { getDateKey } from '@/app/utils/timeLimits';
import { DEFAULT_LEARNING_SUBJECTS } from '@/app/utils/learningData';

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

function ChildQuickStats({ child, learningSubjects }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fs = await getChildStats(child.id);
        if (!cancelled) setStats(Object.keys(fs).length ? fs : loadStats(child.id));
      } catch {
        if (!cancelled) setStats(loadStats(child.id));
      }
    })();
    return () => { cancelled = true; };
  }, [child.id]);

  if (!stats) {
    return (
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
      </div>
    );
  }

  const tasks = stats.totalTasksCompleted || 0;
  const xp = stats.totalScore || 0;
  const completedTaskIds = new Set(stats.completedTasks_list || []);
  const { totalLevels, completedLevels } = computeLevelProgress(child, learningSubjects, completedTaskIds);

  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
        <FaCheckCircle className="text-[10px]" /> {tasks} tasks
      </span>
      {totalLevels > 0 && (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
          <FaGraduationCap className="text-[10px]" /> {completedLevels}/{totalLevels} levels
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
        <FaStar className="text-[10px]" /> {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

// Shown on a child's card when they've hit their screen-time limit and
// asked for more. A quick preset grant (or dismiss) is one click away —
// no need to dig into that child's settings.
function TimeRequestBanner({ child, onGrant, onDismiss }) {
  const [busy, setBusy] = useState(false);

  const handleGrant = async (minutes) => {
    if (busy) return;
    setBusy(true);
    try {
      await onGrant(child, minutes);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 mb-2">
        <FaClock className="text-amber-500 text-xs flex-shrink-0" />
        <p className="text-xs font-bold text-amber-700">{child.name} is asking for more time!</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {[15, 30, 60].map((minutes) => (
          <button
            key={minutes}
            type="button"
            disabled={busy}
            onClick={() => handleGrant(minutes)}
            className="text-[11px] font-black uppercase tracking-wide bg-amber-500 text-white px-3 py-1.5 rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            +{minutes} min
          </button>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => onDismiss(child)}
          className="text-[11px] font-bold uppercase tracking-wide text-amber-600 px-2 py-1.5 hover:text-amber-800 transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <FaTimes className="text-[10px]" /> Not now
        </button>
      </div>
    </motion.div>
  );
}

const ChildrenList = ({ refreshKey } = {}) => {
  const [children, setChildren] = useState([]);
  const [learningSubjects, setLearningSubjects] = useState(DEFAULT_LEARNING_SUBJECTS);
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

        const [querySnapshot, parentSnap] = await Promise.all([
          getDocs(q),
          getDoc(doc(db, 'users', parentUid)).catch(() => null),
        ]);

        const childrenData = querySnapshot.docs.map(childDoc => ({
          id: childDoc.id,
          ...childDoc.data(),
          parentUid: parentUid,
        }));

        setChildren(childrenData);
        if (parentSnap?.exists() && Array.isArray(parentSnap.data().learningSubjects) && parentSnap.data().learningSubjects.length > 0) {
          setLearningSubjects(parentSnap.data().learningSubjects);
        }
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to load children data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
    // refreshKey is bumped by the parent right after a learner is added or
    // edited, so this list updates immediately without a page reload.
  }, [refreshKey]);

  // Live-watch each child's own doc so a "please give me more time" request
  // (or its removal, after a grant/dismiss) shows up without a refresh.
  useEffect(() => {
    if (!auth.currentUser || children.length === 0) return;
    const parentUid = auth.currentUser.uid;
    const unsubscribes = children.map((child) =>
      onSnapshot(doc(db, 'users', parentUid, 'children', child.id), (snap) => {
        if (!snap.exists()) return;
        setChildren((prev) => prev.map((c) => (
          c.id === child.id ? { id: child.id, ...snap.data(), parentUid } : c
        )));
      })
    );
    return () => unsubscribes.forEach((unsub) => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length]);

  const handleManageChild = (child) => {
    sessionStorage.setItem('childUser', JSON.stringify(child));
    router.push('/child-dashboard');
  };

  const handleGrantTime = async (child, minutes) => {
    try {
      await grantBonusTime(child.id, getDateKey(), minutes);
      await updateDoc(doc(db, 'users', child.parentUid, 'children', child.id), {
        timeExtensionRequest: null,
      });
    } catch (err) {
      console.error('Failed to grant bonus time', err);
    }
  };

  const handleDismissTimeRequest = async (child) => {
    try {
      await updateDoc(doc(db, 'users', child.parentUid, 'children', child.id), {
        timeExtensionRequest: null,
      });
    } catch (err) {
      console.error('Failed to dismiss time request', err);
    }
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
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md" title="Child Username">
                        <FaUserCircle className="text-slate-400" /> {child.username}
                      </div>
                      {child.password && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md" title="Child Password">
                          <FaKey className="text-slate-400" /> {child.password}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sessionStorage.setItem('childUser', JSON.stringify(child));
                      router.push('/learning-zone');
                    }}
                    className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                    title="Launch Learning Zone"
                  >
                    <FaPlay className="text-sm ml-0.5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                    <FaArrowRight className="text-sm" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <ChildQuickStats child={child} learningSubjects={learningSubjects} />
                <Link
                  href={`/analytics/${child.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-500 hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  <FaChartBar className="text-[10px]" /> Report
                </Link>
              </div>

              <AnimatePresence>
                {child.timeExtensionRequest?.status === 'pending' && (
                  <TimeRequestBanner
                    child={child}
                    onGrant={handleGrantTime}
                    onDismiss={handleDismissTimeRequest}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChildrenList;