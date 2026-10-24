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
import { DEFAULT_LEARNING_SUBJECTS } from "@/app/utils/learningData";
import { FaPlus, FaBell, FaUserFriends, FaUserCircle, FaCrown, FaCheckCircle, FaStar, FaTrophy, FaClock, FaChartLine, FaGraduationCap, FaLock } from 'react-icons/fa';

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
      : DEFAULT_LEARNING_SUBJECTS;
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
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
              {auth.currentUser?.photoURL
                ? <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                : <FaUserCircle className="text-lg" />}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 leading-tight">
                Welcome back, <span className="text-blue-600">{displayName}</span>
              </h1>
              <p className="text-sm text-slate-500">Manage your family's learning journey</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/analytics"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors bg-white flex-1 sm:flex-initial"
            >
              <FaChartLine className="text-xs" /> Full Analytics
            </Link>
            <div className="flex flex-col items-end gap-1 flex-1 sm:flex-initial">
              <button
                onClick={() => atChildLimit ? setShowLimitModal(true) : setShowAddChildModal(true)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-colors text-sm ${atChildLimit
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {atChildLimit
                  ? <><FaLock className="text-xs" /> Add Learner</>
                  : <><FaPlus className="text-xs" /> Add Learner</>}
              </button>
              <p className="text-[11px] text-slate-400 pr-1">
                {childCount} / {childLimit} learners used
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">

        {/* Family learning overview */}
        {overviewLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : overview && overview.childCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              className="block w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
    blue: { text: "text-blue-600", icon: "bg-blue-50" },
    amber: { text: "text-amber-600", icon: "bg-amber-50" },
    violet: { text: "text-violet-600", icon: "bg-violet-50" },
    emerald: { text: "text-emerald-600", icon: "bg-emerald-50" },
  };
  const p = palette[color];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 flex items-center gap-4">
      <div className={`w-10 h-10 ${p.icon} rounded-lg flex items-center justify-center ${p.text} text-base flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold text-slate-800 leading-tight truncate">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Shared Section Card ────────────────────────────────────────────
function SectionCard({ icon, title, children, flex = false }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${flex ? 'flex flex-col flex-grow' : 'flex flex-col'}`}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-base">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      {/* Card body */}
      <div className={`p-5 sm:p-6 ${flex ? 'flex-grow flex flex-col' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default ParentDashboard;
