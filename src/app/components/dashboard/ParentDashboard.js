import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { doc, onSnapshot, collection, query, getDocs } from "firebase/firestore";
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Subscription from "./Subscription";
import ChildrenList from "./ChildrenList";
import AddChildForm from "./AddChildForm";
import Notifications from "./Notifications";
import { DashboardSkeleton } from "../ui/SkeletonLoader";
import Modal from "../ui/Modal";
import { getChildStats, getChildAchievements } from "@/app/utils/firestoreService";
import { loadStats, loadUnlockedAchievements } from "@/app/utils/achievements";
import { computeLevelProgress } from "@/app/utils/childProgress";
import { resolveSubscription } from "@/lib/subscriptionStatus";
import { childLimitForPlan } from "@/lib/pricingConfig";
import { FaPlus, FaBell, FaUserFriends, FaUserCircle, FaCrown, FaCheckCircle, FaStar, FaTrophy, FaClock, FaChartLine, FaGraduationCap, FaLock } from 'react-icons/fa';
import { motion } from "framer-motion";

const ParentDashboard = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [childrenRefreshKey, setChildrenRefreshKey] = useState(0);
  const router = useRouter();

  // Children live in a Firestore subcollection, so writes to it (adding or
  // editing a learner) never trigger the onSnapshot listener on the parent
  // doc below. Pulled out so it can also be called directly right after a
  // save, instead of waiting for a parent-doc change that will never come.
  const refreshChildrenAndOverview = useCallback(async (data) => {
    if (!auth.currentUser) return;
    const childrenCollectionRef = collection(db, 'users', auth.currentUser.uid, 'children');
    const childrenSnapshot = await getDocs(query(childrenCollectionRef));
    const childrenData = childrenSnapshot.docs.map(childDoc => ({
      id: childDoc.id,
      ...childDoc.data()
    }));
    setParentData({ ...data, children: childrenData });

    // Family-wide learning overview (mirrors the totals shown on /analytics)
    const learningSubjects = Array.isArray(data.learningSubjects) && data.learningSubjects.length > 0
      ? data.learningSubjects
      : ["English", "Math", "Science", "Tamil"];
    let tasks = 0, score = 0, achievements = 0, minutes = 0, levelsDone = 0, levelsTotal = 0;
    for (const kid of childrenData) {
      let s;
      try {
        const fs = await getChildStats(kid.id);
        const fa = await getChildAchievements(kid.id);
        s = Object.keys(fs).length ? fs : loadStats(kid.id);
        achievements += fa.length || loadUnlockedAchievements(kid.id).length;
      } catch {
        s = loadStats(kid.id);
        achievements += loadUnlockedAchievements(kid.id).length;
      }
      tasks += s.totalTasksCompleted || 0;
      score += s.totalScore || 0;
      minutes += Math.round((s.totalTimeTaken || 0) / 60);
      const completedTaskIds = new Set(s.completedTasks_list || []);
      const progress = computeLevelProgress(kid, learningSubjects, completedTaskIds);
      levelsDone += progress.completedLevels;
      levelsTotal += progress.totalLevels;
    }
    setOverview({ tasks, score, achievements, minutes, levelsDone, levelsTotal, childCount: childrenData.length });
    setOverviewLoading(false);
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const parentDocRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(parentDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          await refreshChildrenAndOverview(docSnap.data());
        } else {
          setParentData(null);
          setOverviewLoading(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [refreshChildrenAndOverview]);

  // A learner was just added or edited — re-pull the children subcollection
  // and bump ChildrenList's refresh key so both update immediately, with no
  // page reload.
  const handleChildSaved = () => {
    setShowAddChildModal(false);
    if (parentData) refreshChildrenAndOverview(parentData);
    setChildrenRefreshKey((k) => k + 1);
  };

  if (loading) return <DashboardSkeleton />;

  const displayName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Parent';
  const childLimit = childLimitForPlan(resolveSubscription(parentData)?.plan);
  const childCount = overview?.childCount ?? 0;
  const atChildLimit = childCount >= childLimit;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 overflow-hidden flex-shrink-0">
              {auth.currentUser?.photoURL
                ? <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                : <FaUserCircle className="text-xl" />}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                Welcome back, <span className="text-blue-600">{displayName}</span>
              </h1>
              <p className="text-sm text-slate-400 font-medium">Manage your family's learning journey</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/analytics"
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition-all bg-white"
            >
              <FaChartLine className="text-xs" /> Full Analytics
            </Link>
            <div className="flex flex-col items-end gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => atChildLimit ? setShowLimitModal(true) : setShowAddChildModal(true)}
                className={`group flex items-center justify-center gap-2 px-6 py-3 font-black rounded-full shadow-lg transition-all text-sm uppercase tracking-widest border-2 border-transparent ${atChildLimit
                  ? 'bg-slate-100 text-slate-400 hover:border-slate-200'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-cyan-400/40 hover:border-white/20'
                  }`}
              >
                {atChildLimit
                  ? <><FaLock className="text-xs" /> Add Learner</>
                  : <><FaPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" /> Add Learner</>}
              </motion.button>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider pr-1">
                {childCount} / {childLimit} learners used
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* Family learning overview */}
        {overviewLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : overview && overview.childCount > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <OverviewCard icon={<FaCheckCircle />} label="Tasks Completed" value={overview.tasks} color="emerald" />
            <OverviewCard
              icon={<FaGraduationCap />}
              label="Levels Completed"
              value={overview.levelsTotal > 0 ? `${overview.levelsDone}/${overview.levelsTotal}` : "—"}
              color="blue"
            />
            <OverviewCard icon={<FaStar />} label="Family XP" value={overview.score.toLocaleString()} color="amber" />
            <OverviewCard icon={<FaTrophy />} label="Badges Earned" value={overview.achievements} color="violet" />
            <OverviewCard icon={<FaClock />} label="Learning Minutes" value={`${overview.minutes}m`} color="blue" />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Children List */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              icon={<FaUserFriends className="text-blue-500" />}
              title="Your Learners"
            >
              <Suspense fallback={<DashboardSkeleton />}>
                <ChildrenList refreshKey={childrenRefreshKey} />
              </Suspense>
            </SectionCard>
          </div>

          {/* Right: Subscription + Notifications */}
          <div className="flex flex-col gap-6">
            <SectionCard
              icon={<FaCrown className="text-amber-500" />}
              title="Subscription"
            >
              <Suspense fallback={<div className="animate-pulse h-32 bg-slate-50 rounded-xl" />}>
                <Subscription />
              </Suspense>
            </SectionCard>

            <SectionCard
              icon={<FaBell className="text-blue-400" />}
              title="Notifications"
              flex
            >
              <Suspense fallback={<div className="animate-pulse h-24 bg-slate-50 rounded-xl" />}>
                <Notifications notifications={parentData?.notifications} />
              </Suspense>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <Suspense fallback={null}>
          <Modal onClose={() => setShowAddChildModal(false)} unstyled>
            <AddChildForm
              onClose={() => setShowAddChildModal(false)}
              onSaveSuccess={handleChildSaved}
            />
          </Modal>
        </Suspense>
      )}

      {/* Child limit reached */}
      {showLimitModal && (
        <Modal onClose={() => setShowLimitModal(false)}>
          <div className="text-center pt-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl">
              <FaLock />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Learner limit reached</h3>
            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
              Your current plan allows up to {childLimit} child profile{childLimit !== 1 ? 's' : ''}, and you&apos;ve used all {childCount}.
              Upgrade to add more learners to your family.
            </p>
            <Link
              href="/pricing"
              className="block w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-black rounded-2xl hover:scale-[1.01] shadow-lg shadow-blue-200 transition-all"
            >
              Upgrade Plan
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── Family Overview Stat Card ──────────────────────────────────────
function OverviewCard({ icon, label, value, color = "blue" }) {
  const palette = {
    blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", icon: "bg-blue-100" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", icon: "bg-amber-100" },
    violet: { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-600", icon: "bg-violet-100" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", icon: "bg-emerald-100" },
  };
  const p = palette[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`${p.bg} rounded-2xl p-5 border ${p.border} flex items-center gap-4`}
    >
      <div className={`w-11 h-11 ${p.icon} rounded-xl flex items-center justify-center ${p.text} text-lg flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-black ${p.text} leading-tight truncate`}>{value}</p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Shared Section Card ────────────────────────────────────────────
function SectionCard({ icon, title, children, flex = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden ${flex ? 'flex flex-col flex-grow' : 'flex flex-col'}`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-8 py-5 bg-gradient-to-b from-white to-slate-50/50 border-b border-slate-100/60 relative">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-lg relative z-10">
          {icon}
        </div>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest relative z-10">{title}</h2>
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-slate-100 to-transparent opacity-50 rounded-bl-[100px]" />
      </div>
      {/* Card body */}
      <div className={`p-8 ${flex ? 'flex-grow flex flex-col' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}

export default ParentDashboard;
