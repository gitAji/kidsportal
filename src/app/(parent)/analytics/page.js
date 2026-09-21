"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getChildStats, getChildAchievements } from "@/app/utils/firestoreService";
import { loadStats, loadUnlockedAchievements } from "@/app/utils/achievements";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaArrowRight, FaStar, FaTrophy, FaClock,
  FaCheckCircle, FaFire, FaUsers, FaChartLine,
  FaHome,
} from "react-icons/fa";
import CustomAvatar from "@/app/components/ui/CustomAvatar";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";

// ── Design tokens (shared with dashboard) ─────────────────────────
const CHILD_COLORS = [
  { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600", dot: "bg-rose-400" },
  { bg: "bg-cyan-50", border: "border-cyan-100", text: "text-cyan-600", dot: "bg-cyan-400" },
  { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", dot: "bg-amber-400" },
  { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-600", dot: "bg-violet-400" },
];

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, color = "blue", delay = 0 }) {
  const palette = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", icon: "bg-violet-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100" },
  };
  const p = palette[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      className={`${p.bg} rounded-2xl p-6 border ${p.bg.replace("50", "100")} flex items-center gap-5`}
    >
      <div className={`w-12 h-12 ${p.icon} rounded-2xl flex items-center justify-center ${p.text} text-xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-black ${p.text} leading-tight`}>{value}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Child Summary Card ────────────────────────────────────────────
function ChildSummaryCard({ child, index }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const c = CHILD_COLORS[index % CHILD_COLORS.length];

  useEffect(() => {
    (async () => {
      try {
        const fs = await getChildStats(child.id);
        setStats(Object.keys(fs).length ? fs : loadStats(child.id));
      } catch {
        setStats(loadStats(child.id));
      }
      setLoading(false);
    })();
  }, [child.id]);

  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100" />
        <div className="space-y-1.5 flex-grow">
          <div className="h-4 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-slate-50 rounded-xl" />
        <div className="h-16 bg-slate-50 rounded-xl" />
      </div>
      <div className="h-10 bg-slate-100 rounded-xl" />
    </div>
  );

  const totalTasks = stats?.totalTasksCompleted || 0;
  const timeTaken = Math.round((stats?.totalTimeTaken || 0) / 60);
  const xp = stats?.totalScore || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, type: "spring", stiffness: 120 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 transition-all group"
    >
      {/* Coloured top accent */}
      <div className={`h-1.5 w-full ${c.dot}`} />

      <div className="p-6">
        {/* Child header */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <CustomAvatar child={child} size="text-2xl" />
          </div>
          <div className="min-w-0 flex-grow">
            <h3 className={`text-base font-black ${c.text} truncate leading-tight`}>{child.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{child.grade || "Elementary"}</p>
          </div>
          <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Tasks", value: totalTasks },
            { label: "XP", value: xp.toLocaleString() },
            { label: "Mins", value: `${timeTaken}` },
          ].map((s) => (
            <div key={s.label} className={`${c.bg} rounded-xl p-3 text-center border ${c.border}`}>
              <p className={`text-lg font-black ${c.text} leading-tight`}>{s.value}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/analytics/${child.id}`}
          className={`w-full py-3 rounded-xl border ${c.border} ${c.bg} ${c.text} font-black text-sm hover:opacity-80 transition-all flex items-center justify-center gap-2`}
        >
          View Full Report <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Section Card (matches dashboard) ─────────────────────────────
function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ tasks: 0, score: 0, achievements: 0, minutes: 0 });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setLoading(false); return; }
      try {
        const snap = await getDocs(query(collection(db, 'users', u.uid, 'children')));
        const kids = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setChildren(kids);

        let tasks = 0, score = 0, achievements = 0, minutes = 0;
        for (const kid of kids) {
          const fs = await getChildStats(kid.id);
          const fa = await getChildAchievements(kid.id);
          const s = Object.keys(fs).length ? fs : loadStats(kid.id);
          tasks += s.totalTasksCompleted || 0;
          score += s.totalScore || 0;
          achievements += fa.length || loadUnlockedAchievements(kid.id).length;
          minutes += Math.round((s.totalTimeTaken || 0) / 60);
        }
        setTotals({ tasks, score, achievements, minutes });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const weeklyGoal = 20;
  const weeklyPct = Math.min(Math.round((totals.tasks / weeklyGoal) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
              Family <span className="text-blue-600">Analytics</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Track every learner's progress at a glance</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Enrolled learners */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
              <div className="flex -space-x-2">
                {children.slice(0, 3).map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg bg-white border-2 border-white flex items-center justify-center shadow-sm overflow-hidden">
                    <CustomAvatar child={c} size="text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-none">{children.length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Learners</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition-all bg-white"
            >
              <FaHome className="text-xs" /> Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<FaCheckCircle />} label="Tasks Completed" value={totals.tasks} color="emerald" delay={0.05} />
          <StatCard icon={<FaStar />} label="Family XP" value={totals.score.toLocaleString()} color="amber" delay={0.10} />
          <StatCard icon={<FaTrophy />} label="Badges Earned" value={totals.achievements} color="violet" delay={0.15} />
          <StatCard icon={<FaClock />} label="Learning Minutes" value={`${totals.minutes}m`} color="blue" delay={0.20} />
        </div>

        {/* Individual breakdown */}
        <SectionCard
          icon={<FaChartLine className="text-blue-500" />}
          title="Individual Progress"
        >
          {children.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FaUsers className="text-3xl text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">No learners added yet.</p>
              <Link href="/dashboard" className="text-blue-500 font-bold text-xs hover:underline mt-1 inline-block">
                Go to Dashboard to add children →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child, i) => (
                <ChildSummaryCard
                  key={child.id}
                  child={child}
                  index={i}
                />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Weekly goal */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
            <FaFire className="text-orange-400 text-base" />
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">Weekly Goal Progress</h2>
            <span className="ml-auto text-sm font-black text-blue-600">{weeklyPct}%</span>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500 font-medium">
                Your family completed <span className="font-black text-slate-800">{totals.tasks}</span> out of <span className="font-black text-slate-800">{weeklyGoal}</span> target tasks this week.
              </p>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${weeklyPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">0 tasks</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{weeklyGoal} tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
