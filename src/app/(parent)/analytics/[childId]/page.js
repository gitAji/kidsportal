"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import {
  getChildStats, getChildAchievements, getChildTaskHistory,
} from "@/app/utils/firestoreService";
import { loadStats, loadUnlockedAchievements, ACHIEVEMENTS } from "@/app/utils/achievements";
import { getSubjectsByGrade } from "@/app/utils/learningData";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaArrowLeft, FaStar, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle,
  FaMedal, FaBookOpen, FaBrain, FaHistory, FaRedo, FaGraduationCap,
  FaChartPie, FaLayerGroup, FaPrint, FaFire,
} from "react-icons/fa";
import CustomAvatar from "@/app/components/ui/CustomAvatar";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";

// Same friendly names used in the Learning Zone, kept in sync here so a
// parent sees the same subject names their child sees.
const SUBJECT_DISPLAY_NAMES = {
  english: "English", math: "Math", science: "Science", ariviyal: "Science",
  tamil: "Tamil", computerscience: "Computer Science",
};
function subjectDisplayName(subjectId) {
  const prefix = (subjectId || "").replace(/-\d+$/, "").toLowerCase();
  return SUBJECT_DISPLAY_NAMES[prefix] || (prefix ? prefix[0].toUpperCase() + prefix.slice(1) : "Subject");
}

function deriveGradeId(child) {
  if (!child?.grade) return child?.gradeId || null;
  const gradeNum = parseInt(String(child.grade).replace("Grade ", ""), 10);
  return !isNaN(gradeNum) ? `grade-${gradeNum}` : String(child.grade).toLowerCase().replace(" ", "-");
}

// Accuracy across a set of task-history entries, computed from each entry's
// own per-question breakdown (entry.history[].isCorrect) — independent of
// the XP `score` field, so it reflects "% answered correctly" cleanly.
function accuracyFor(entries) {
  let correct = 0, total = 0;
  entries.forEach((e) => {
    if (Array.isArray(e.history) && e.history.length > 0) {
      correct += e.history.filter((h) => h.isCorrect).length;
      total += e.history.length;
    }
  });
  return total > 0 ? Math.round((correct / total) * 100) : null;
}

function formatDate(ts) {
  if (!ts) return "";
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function tierForPct(pct) {
  if (pct === null) return null;
  if (pct === 100) return { label: "Gold", emoji: "🥇", color: "text-amber-500 bg-amber-50 border-amber-100" };
  if (pct >= 75) return { label: "Silver", emoji: "🥈", color: "text-slate-500 bg-slate-50 border-slate-200" };
  if (pct >= 50) return { label: "Bronze", emoji: "🥉", color: "text-orange-500 bg-orange-50 border-orange-100" };
  return { label: "Needs Practice", emoji: "💪", color: "text-rose-500 bg-rose-50 border-rose-100" };
}

// ── Small presentational pieces ────────────────────────────────────
function StatTile({ icon, label, value, color = "blue" }) {
  const palette = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", icon: "bg-violet-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", icon: "bg-rose-100" },
    slate: { bg: "bg-slate-50", text: "text-slate-600", icon: "bg-slate-100" },
  };
  const p = palette[color] || palette.blue;
  return (
    <div className={`${p.bg} rounded-2xl p-5 border ${p.bg.replace("50", "100")} flex items-center gap-4`}>
      <div className={`w-11 h-11 ${p.icon} rounded-xl flex items-center justify-center ${p.text} text-lg flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-black ${p.text} leading-tight`}>{value}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, right, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">{title}</h2>
        {right && <div className="ml-auto">{right}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ModuleBadge({ status, pct }) {
  if (status === "finished") {
    return <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1"><FaCheckCircle className="text-[10px]" /> Finished</span>;
  }
  if (status === "in-progress") {
    return <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">{pct}% In Progress</span>;
  }
  return <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">Not Started</span>;
}

// ── Main Page ────────────────────────────────────────────────────
export default function ChildReportPage() {
  const { childId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [stats, setStats] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [history, setHistory] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setLoading(false); router.push("/login"); return; }
      try {
        const childSnap = await getDoc(doc(db, "users", u.uid, "children", childId));
        if (!childSnap.exists()) {
          setError("This learner couldn't be found.");
          setLoading(false);
          return;
        }
        const childData = { id: childSnap.id, ...childSnap.data() };
        setChild(childData);

        // Parent's chosen subjects for this family (falls back to the same
        // default set used across the Learning Zone).
        let learningSubjects = ["English", "Math", "Science", "Tamil"];
        try {
          const parentSnap = await getDoc(doc(db, "users", u.uid));
          if (parentSnap.exists() && parentSnap.data().learningSubjects) {
            learningSubjects = parentSnap.data().learningSubjects;
          }
        } catch { /* use default */ }

        const gradeId = deriveGradeId(childData);
        const gradeSubjects = gradeId ? getSubjectsByGrade(gradeId, learningSubjects) : [];
        setSubjects(gradeSubjects);

        const [fsStats, fsAch, fsHistory] = await Promise.all([
          getChildStats(childId).catch(() => ({})),
          getChildAchievements(childId).catch(() => []),
          getChildTaskHistory(childId, 500).catch(() => []),
        ]);

        setStats(Object.keys(fsStats).length ? fsStats : loadStats(childId));
        setAchievements(
          fsAch.length ? fsAch : loadUnlockedAchievements(childId).map((id) => ACHIEVEMENTS.find((a) => a.id === id)).filter(Boolean)
        );
        setHistory(fsHistory);
      } catch (e) {
        console.error("Failed to load child report:", e);
        setError("We couldn't load this report right now.");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [childId, router]);

  // ── Derived report data ──────────────────────────────────────────
  const completedTaskIds = useMemo(() => new Set(stats?.completedTasks_list || []), [stats]);

  const subjectReports = useMemo(() => {
    return subjects.map((subject) => {
      const levels = (subject.levels || []).map((level) => {
        const tasks = level.tasks || [];
        const totalTasks = tasks.length;
        const completedCount = tasks.filter((t) => completedTaskIds.has(t.taskId)).length;
        const isCompleted = totalTasks > 0 && completedCount === totalTasks;
        return { levelId: level.levelId, levelName: level.levelName, moduleName: level.moduleName || "Levels", totalTasks, completedCount, isCompleted };
      });

      const totalLevels = levels.length;
      const completedLevels = levels.filter((l) => l.isCompleted).length;
      const pct = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

      const moduleMap = {};
      levels.forEach((l) => {
        if (!moduleMap[l.moduleName]) moduleMap[l.moduleName] = [];
        moduleMap[l.moduleName].push(l);
      });
      const modules = Object.entries(moduleMap).map(([name, lvls]) => {
        const done = lvls.filter((l) => l.isCompleted).length;
        const status = done === lvls.length ? "finished" : done > 0 ? "in-progress" : "not-started";
        const totalTasksInModule = lvls.reduce((n, l) => n + l.totalTasks, 0);
        const completedTasksInModule = lvls.reduce((n, l) => n + l.completedCount, 0);
        const modulePct = totalTasksInModule > 0 ? Math.round((completedTasksInModule / totalTasksInModule) * 100) : 0;
        return { name, total: lvls.length, done, status, pct: modulePct };
      });

      const allSubjectEntries = history.filter((h) => h.subjectId === subject.subjectId);
      const gradedSubjectEntries = allSubjectEntries.filter((h) => h.type === "quiz" || h.type === "exam");
      const accuracy = accuracyFor(gradedSubjectEntries);
      const subjectXP = allSubjectEntries.reduce((n, h) => n + (h.score || 0), 0);

      return {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName || subjectDisplayName(subject.subjectId),
        totalLevels, completedLevels, pct, levels, modules, accuracy, subjectXP,
      };
    });
  }, [subjects, completedTaskIds, history]);

  // Quick lookup: levelId -> { levelName, subjectName } for friendly names
  // in the exam-results and activity-log sections below.
  const levelLookup = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      (s.levels || []).forEach((l) => {
        map[l.levelId] = { levelName: l.levelName, subjectName: s.subjectName || subjectDisplayName(s.subjectId) };
      });
    });
    return map;
  }, [subjects]);

  const gradedEntries = useMemo(() => history.filter((h) => h.type === "quiz" || h.type === "exam"), [history]);
  const overallAccuracy = useMemo(() => accuracyFor(gradedEntries), [gradedEntries]);
  const examEntries = useMemo(
    () => history.filter((h) => h.type === "exam").map((e) => ({ ...e, pct: accuracyFor([e]) })),
    [history]
  );

  // Group every exam attempt by the level it belongs to, so a parent can see
  // exactly how many times an exam was attempted and the result of each try
  // — not just the latest one.
  const examsByLevel = useMemo(() => {
    const map = {};
    examEntries.forEach((e) => {
      const key = e.levelId || "unknown";
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.values(map)
      .map((attempts) => {
        const sorted = [...attempts].sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
        const numbered = sorted.map((a, i) => ({ ...a, seq: i + 1 }));
        const bestPct = Math.max(...sorted.map((a) => a.pct ?? 0));
        const latest = sorted[sorted.length - 1];
        return { levelId: latest.levelId, subjectId: latest.subjectId, attempts: numbered, attemptCount: sorted.length, bestPct, latest };
      })
      .sort((a, b) => (b.latest.timestamp?.seconds || 0) - (a.latest.timestamp?.seconds || 0));
  }, [examEntries]);

  const totalLevelsAll = subjectReports.reduce((n, s) => n + s.totalLevels, 0);
  const completedLevelsAll = subjectReports.reduce((n, s) => n + s.completedLevels, 0);
  const overallPct = totalLevelsAll > 0 ? Math.round((completedLevelsAll / totalLevelsAll) * 100) : 0;

  if (loading) return <DashboardSkeleton />;

  if (error || !child) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-black text-slate-700 mb-4">{error || "Learner not found."}</p>
        <Link href="/analytics" className="text-blue-600 font-bold hover:underline">← Back to Analytics</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-6 sm:px-8 py-6 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <CustomAvatar child={child} size="text-3xl" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{child.name}&apos;s Report</h1>
              <p className="text-sm text-slate-400 font-medium mt-0.5">{child.grade || "Elementary"} • Full learning report</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition-all bg-white"
            >
              <FaPrint className="text-xs" /> Print
            </button>
            <Link
              href="/analytics"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition-all bg-white"
            >
              <FaArrowLeft className="text-xs" /> Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-8">

        {/* ── Overall Results ── */}
        <SectionCard icon={<FaChartPie className="text-blue-500" />} title="Overall Results">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <StatTile icon={<FaGraduationCap />} label="Levels Completed" value={`${completedLevelsAll} / ${totalLevelsAll}`} color="blue" />
            <StatTile icon={<FaChartPie />} label="Overall Accuracy" value={overallAccuracy !== null ? `${overallAccuracy}%` : "—"} color="emerald" />
            <StatTile icon={<FaStar />} label="Total XP" value={(stats?.totalScore || 0).toLocaleString()} color="amber" />
            <StatTile icon={<FaClock />} label="Learning Minutes" value={`${Math.round((stats?.totalTimeTaken || 0) / 60)}m`} color="violet" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <StatTile icon={<FaBookOpen />} label="Lessons Done" value={stats?.lessonsCompleted || 0} color="slate" />
            <StatTile icon={<FaBrain />} label="Quizzes Done" value={stats?.quizzesCompleted || 0} color="slate" />
            <StatTile icon={<FaMedal />} label="Exams Done" value={stats?.examsCompleted || 0} color="slate" />
            <StatTile icon={<FaFire />} label="Days Learning" value={stats?.uniqueDays || 0} color="rose" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-500">Overall curriculum progress</p>
              <p className="text-sm font-black text-blue-600">{overallPct}%</p>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { emoji: "🥇", label: "Gold Medals", count: stats?.goldMedals || 0 },
              { emoji: "🥈", label: "Silver Medals", count: stats?.silverMedals || 0 },
              { emoji: "🥉", label: "Bronze Medals", count: stats?.bronzeMedals || 0 },
            ].map((m) => (
              <div key={m.label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                <div className="text-2xl mb-1">{m.emoji}</div>
                <p className="text-lg font-black text-slate-800">{m.count}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Per-Subject Progress & Modules ── */}
        <SectionCard icon={<FaLayerGroup className="text-violet-500" />} title="Subjects, Levels & Modules">
          {subjectReports.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 text-center py-8">No subjects set up for this learner's grade yet.</p>
          ) : (
            <div className="space-y-6">
              {subjectReports.map((s) => (
                <div key={s.subjectId} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-800">{s.subjectName}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        {s.completedLevels} of {s.totalLevels} levels complete
                        {s.accuracy !== null && <> • {s.accuracy}% accuracy on quizzes &amp; exams</>}
                        {" "}• {s.subjectXP.toLocaleString()} XP earned
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="text-sm font-black text-slate-700 w-10 text-right">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.modules.map((m) => (
                      <div key={m.name} className="flex items-center justify-between gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate">{m.name.replace(/^Module \d+:\s*/, "")}</p>
                          <p className="text-[11px] font-medium text-slate-400">{m.done} of {m.total} levels</p>
                        </div>
                        <ModuleBadge status={m.status} pct={m.pct} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Exam Results ── */}
        <SectionCard
          icon={<FaMedal className="text-amber-500" />}
          title="Exam Results"
          right={<span className="text-xs font-bold text-slate-400">{examEntries.length} attempt{examEntries.length === 1 ? "" : "s"} across {examsByLevel.length} exam{examsByLevel.length === 1 ? "" : "s"}</span>}
        >
          {examsByLevel.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 text-center py-8">No exams taken yet.</p>
          ) : (
            <div className="space-y-4">
              {examsByLevel.map((group) => {
                const lookup = levelLookup[group.levelId] || {};
                const bestTier = tierForPct(group.bestPct);
                return (
                  <div key={group.levelId} className="border border-slate-100 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">
                          {lookup.levelName || group.levelId} <span className="text-slate-400 font-medium">· {lookup.subjectName || subjectDisplayName(group.subjectId)}</span>
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">
                          {group.attemptCount} attempt{group.attemptCount === 1 ? "" : "s"} • Best score: {group.bestPct}%
                        </p>
                      </div>
                      {bestTier && (
                        <span className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider rounded-full px-2.5 py-1 border flex-shrink-0 ${bestTier.color}`}>
                          {bestTier.emoji} Best: {bestTier.label}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      {group.attempts.map((a) => {
                        const tier = tierForPct(a.pct);
                        return (
                          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full px-2 py-1 flex-shrink-0">
                                Attempt {a.seq}
                              </span>
                              <p className="text-xs text-slate-400 font-medium truncate">{formatDate(a.timestamp)}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {tier && (
                                <span className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider rounded-full px-2.5 py-1 border ${tier.color}`}>
                                  {tier.emoji} {tier.label}
                                </span>
                              )}
                              <span className="text-sm font-black text-slate-700">{a.pct !== null ? `${a.pct}%` : "—"}</span>
                              <span className="text-xs font-bold text-slate-400">({a.score ?? 0} pts)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* ── Full Detailed Activity Log ── */}
        <SectionCard icon={<FaHistory className="text-blue-500" />} title="Full Detailed Activity Log" right={<span className="text-xs font-bold text-slate-400">{history.length} attempt{history.length === 1 ? "" : "s"}</span>}>
          {history.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 text-center py-8">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1 custom-scrollbar">
              {history.map((entry) => {
                const lookup = levelLookup[entry.levelId] || {};
                const pct = (entry.type === "quiz" || entry.type === "exam") ? accuracyFor([entry]) : null;
                return (
                  <div key={entry.id} className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider rounded-full px-2 py-1 flex-shrink-0 ${entry.type === "exam" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        entry.type === "quiz" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                        {entry.type || "task"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">
                          {lookup.levelName || entry.levelId} <span className="text-slate-400 font-medium">· {lookup.subjectName || subjectDisplayName(entry.subjectId)}</span>
                        </p>
                        <p className="text-xs text-slate-400 font-medium">{formatDate(entry.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {entry.isRetake && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2 py-1">
                          <FaRedo className="text-[9px]" /> Retake
                        </span>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full px-2 py-1">
                        Attempt #{entry.attemptNumber || 1}
                      </span>
                      {pct !== null && <span className="text-xs font-black text-slate-600">{pct}%</span>}
                      <span className="text-sm font-black text-blue-600">{entry.score ?? 0} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* ── Stickers / Achievements ── */}
        <SectionCard icon={<FaTrophy className="text-amber-500" />} title="Stickers Earned">
          {achievements.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 text-center py-8">No stickers earned yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-2xl">{ach.emoji}</span>
                  <p className="text-xs font-black text-slate-700 leading-tight line-clamp-2">{ach.name}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
