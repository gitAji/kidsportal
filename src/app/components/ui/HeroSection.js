"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket, FaPlayCircle, FaCompass, FaTrophy, FaCheck, FaTimes,
  FaCalculator, FaMicroscope, FaBookOpen, FaCode, FaLanguage,
} from "react-icons/fa";

// Faint science-themed background motifs (an atom + a molecule) instead of
// foreground floaters — they read as texture behind the copy rather than
// competing with it, and fit "learning" more broadly than a math-only motif.
function AtomDecoration({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <circle cx="60" cy="60" r="7" fill="currentColor" />
      <ellipse cx="60" cy="60" rx="52" ry="20" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="60" cy="60" rx="52" ry="20" stroke="currentColor" strokeWidth="2.5" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="52" ry="20" stroke="currentColor" strokeWidth="2.5" transform="rotate(120 60 60)" />
      <circle cx="112" cy="60" r="5" fill="currentColor" />
    </svg>
  );
}

function MoleculeDecoration({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <line x1="38" y1="40" x2="72" y2="26" stroke="currentColor" strokeWidth="2.5" />
      <line x1="38" y1="40" x2="30" y2="80" stroke="currentColor" strokeWidth="2.5" />
      <line x1="38" y1="40" x2="80" y2="70" stroke="currentColor" strokeWidth="2.5" />
      <line x1="80" y1="70" x2="100" y2="42" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="38" cy="40" r="11" fill="currentColor" />
      <circle cx="72" cy="26" r="7" fill="currentColor" />
      <circle cx="30" cy="80" r="7" fill="currentColor" />
      <circle cx="80" cy="70" r="9" fill="currentColor" />
      <circle cx="100" cy="42" r="6" fill="currentColor" />
    </svg>
  );
}

// Mirrors SUBJECT_STYLE_MAP (src/app/utils/subjectStyles.js) so the hero's
// color-coding matches what kids actually see once they're in the Learning
// Zone, instead of inventing a second palette just for this page.
const SUBJECT_TABS = [
  { label: "Math", icon: FaCalculator, bg: "bg-[#72C6FF]", color: "text-[#1C7DC9]" },
  { label: "Science", icon: FaMicroscope, bg: "bg-[#FFC972]", color: "text-[#B9811F]" },
  { label: "English", icon: FaBookOpen, bg: "bg-[#FF9B9B]", color: "text-[#D94F4F]" },
  { label: "Coding", icon: FaCode, bg: "bg-[#C48CFF]", color: "text-[#8A3FE5]" },
  { label: "Tamil", icon: FaLanguage, bg: "bg-[#72E5A8]", color: "text-[#2F9A64]" },
];

const GEOMETRY_OPTIONS = [
  { label: "Square", shape: "square" },
  { label: "Triangle", shape: "triangle" },
  { label: "Circle", shape: "circle" },
];
const GEOMETRY_ANSWER = "Triangle";

function ShapeGlyph({ shape, active }) {
  if (shape === "triangle") {
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 3 L24 23 L2 23 Z" stroke={active ? "#10b981" : "#94a3b8"} strokeWidth="3" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (shape === "circle") {
    return <div className={`w-7 h-7 rounded-full border-[3px] ${active ? "border-sky-400" : "border-slate-300"}`} />;
  }
  return <div className={`w-7 h-7 rounded-md border-[3px] ${active ? "border-amber-400" : "border-slate-300"}`} />;
}

function ActivityPreviewCard() {
  const [selected, setSelected] = useState(null);

  function handlePick(label) {
    if (selected) return; // lock in the first answer, same as the real quiz UI
    setSelected(label);
  }

  function handleReset() {
    setSelected(null);
  }

  const isCorrect = selected === GEOMETRY_ANSWER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 p-6 sm:p-7 w-full max-w-md mx-auto lg:mx-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-xl flex-shrink-0">
            🧮
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Interactive Activity</p>
            <p className="font-black text-slate-800 text-sm sm:text-base truncate">Math Wizards: Geometry Quest</p>
          </div>
        </div>
        <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 text-[11px] font-bold border border-sky-100">
          Ages 6-10
        </span>
      </div>

      {/* Question */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-5">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Lesson 3 &bull; Level 12</p>
        <p className="font-bold text-slate-800 text-base sm:text-lg leading-snug mb-5">
          Which shape has exactly 3 sides and 3 angles?
        </p>

        <div className="grid grid-cols-3 gap-3">
          {GEOMETRY_OPTIONS.map(({ label, shape }) => {
            const isPicked = selected === label;
            const showAsCorrect = selected && label === GEOMETRY_ANSWER;
            const showAsWrong = isPicked && label !== GEOMETRY_ANSWER;
            return (
              <button
                key={label}
                type="button"
                onClick={() => handlePick(label)}
                aria-pressed={isPicked}
                disabled={!!selected}
                className={`relative flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                  showAsCorrect
                    ? "bg-emerald-50 border-emerald-300"
                    : showAsWrong
                    ? "bg-red-50 border-red-300"
                    : "bg-white border-slate-100"
                } ${!selected ? "hover:border-indigo-200 hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}`}
              >
                <ShapeGlyph shape={shape} active={showAsCorrect || (!selected)} />
                <span className={`text-xs font-bold ${showAsCorrect ? "text-emerald-700" : showAsWrong ? "text-red-600" : "text-slate-500"}`}>
                  {label}
                </span>
                {showAsCorrect && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    <FaCheck />
                  </span>
                )}
                {showAsWrong && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                    <FaTimes />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={isCorrect ? "correct" : "wrong"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-bold ${
                isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              <span>{isCorrect ? "🎉 Correct! A triangle has 3 sides and 3 angles." : "Not quite — a triangle has 3 sides. Try again!"}</span>
              <button
                type="button"
                onClick={handleReset}
                className="flex-shrink-0 underline underline-offset-2 hover:opacity-70"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress + streak */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-400 mb-2">Child Progress Tracking</p>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: "78%" }} />
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <span className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs">
            <FaTrophy />
          </span>
          <div className="leading-tight">
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-wide">Daily Streak</p>
            <p className="text-xs font-bold text-slate-700">7 Days!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState("Math");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsub();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eef6ff] via-[#f0f4ff] to-[#f5f0ff] min-h-[88vh] flex items-center">

      {/* Soft blob decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-[100px]" />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        {/* Atom + molecule background motifs (desktop) — kept to the left
            margin so they never sit behind the activity preview card */}
        <motion.div
          className="hidden lg:block absolute text-sky-400/40"
          style={{ top: "4%", left: "2%", width: 190, height: 190 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <AtomDecoration className="w-full h-full" />
        </motion.div>
        <motion.div
          className="hidden lg:block absolute text-violet-400/35"
          style={{ bottom: "6%", left: "1%", width: 150, height: 150 }}
          animate={{ y: ["-8px", "8px"] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <MoleculeDecoration className="w-full h-full" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <AnimatePresence mode="wait">
          {loading ? (
            <div key="loading" className="h-48" />

          ) : user ? (
            /* ── Logged-in ── */
            <motion.div key="in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white border border-sky-100 shadow-sm text-sky-600 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" /> Welcome Back
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-5 leading-tight">
                Hey{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
                  {user.displayName || "Explorer"}
                </span>
                , ready to learn? 🎉
              </h1>
              <p className="text-slate-500 text-base sm:text-lg mb-8 font-medium max-w-lg mx-auto leading-relaxed">
                Your children are making great progress! Jump into the dashboard to see achievements and manage their profiles.
              </p>
              <Link href="/dashboard"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-sky-200/60 hover:-translate-y-0.5 hover:shadow-sky-300/70 transition-all"
              >
                <FaRocket /> Go to Dashboard
              </Link>
            </motion.div>

          ) : (
            /* ── Public ── */
            <motion.div key="out" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center max-w-6xl mx-auto"
            >
              {/* Left: copy */}
              <div className="text-center lg:text-left">
                {/* Headline */}
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-6xl font-black text-slate-800 leading-[1.08] tracking-tight mb-5"
                >
                  Where Kids Fall in Love
                  <br className="hidden lg:block" />{" "}
                  with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500">
                    Learning
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="text-slate-500 text-base sm:text-lg font-medium max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
                >
                  Expert-designed curriculum, AI-guided tutoring, and gamified rewards — all inside a safe, ad-free platform your child will look forward to every single day.
                </motion.p>

                {/* Subject tabs */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                  className="mb-9"
                >
                  <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-3">Explore Core Subjects:</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    {SUBJECT_TABS.map(({ label, icon: Icon, bg, color }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setActiveSubject(label)}
                        className={`flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          activeSubject === label
                            ? "bg-white text-slate-800 shadow-md shadow-slate-200/70 ring-1 ring-slate-100"
                            : "text-slate-500 hover:bg-white/60"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] ${bg} ${color}`}>
                          <Icon />
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
                >
                  <Link href="/register"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-xl shadow-sky-200/60 hover:shadow-sky-300/70 hover:-translate-y-1 transition-all duration-300"
                  >
                    <FaPlayCircle className="text-xl" />
                    Start Free Trial <span className="font-normal opacity-90">— No Credit Card</span>
                  </Link>

                  <Link href="#gradesCard" scroll={true}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg text-slate-700 bg-white border-2 border-slate-200 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-y-1 transition-all duration-300"
                  >
                    <FaCompass className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    Explore Curriculum
                  </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
                  className="flex items-center justify-center lg:justify-start gap-3"
                >
                  <div className="flex -space-x-2 flex-shrink-0">
                    {["🧒", "👦", "👧", "🧑"].map((e, i) => (
                      <span key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 flex items-center justify-center text-sm border-2 border-white shadow-sm">
                        {e}
                      </span>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 text-sm tracking-tight">★★★★★</span>
                      <span className="text-slate-700 font-bold text-sm">4.9/5</span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm font-medium">
                      Trusted by <span className="font-bold text-slate-600">10,000+</span> happy families worldwide
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right: activity preview */}
              <ActivityPreviewCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 70" fill="none" className="w-full">
          <path d="M0 35 Q 180 0, 360 35 Q 540 70, 720 35 Q 900 0, 1080 35 Q 1260 70, 1440 35 L1440 70 L0 70 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
