"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaPlusCircle, FaPlay, FaShieldAlt, FaStar } from "react-icons/fa";

const FLOATERS = [
  { emoji: "🚀", top: "10%", left: "5%",  delay: 0,   dur: 5.5 },
  { emoji: "⭐", top: "18%", right: "6%", delay: 0.6, dur: 4.8 },
  { emoji: "🎨", top: "60%", left: "3%",  delay: 1.1, dur: 6.2 },
  { emoji: "🧪", top: "72%", right: "4%", delay: 1.6, dur: 5.8 },
  { emoji: "📚", top: "35%", right: "8%", delay: 0.3, dur: 5   },
  { emoji: "🎮", top: "82%", left: "7%",  delay: 0.9, dur: 6   },
];

const SUBJECTS = ["🧮 Math", "🔬 Science", "📖 English", "💻 Coding", "🌿 Tamil"];

const TRUST_ITEMS = [
  { icon: <FaShieldAlt />, text: "Safe & Ad-Free", color: "text-teal-600 bg-teal-50 border-teal-100" },
  { icon: <FaStar />,      text: "4.9 / 5 Stars",  color: "text-amber-500 bg-amber-50 border-amber-100" },
  { icon: "🏅",            text: "10K+ Families",   color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
];

const STATS = [
  { value: "10K+", label: "Happy Families",  grad: "from-sky-500 to-indigo-500" },
  { value: "4.9★", label: "App Rating",       grad: "from-amber-400 to-orange-400" },
  { value: "150+", label: "Learning Levels",  grad: "from-teal-400 to-emerald-500" },
];

export default function HeroSection() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

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
      </div>

      {/* Floating emoji (desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {FLOATERS.map(({ emoji, top, left, right, delay, dur }) => (
          <motion.span
            key={emoji}
            className="absolute text-4xl select-none drop-shadow-lg"
            style={{ top, left, right }}
            animate={{ y: ["-12px", "12px"], rotate: [-3, 3] }}
            transition={{ duration: dur, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }}
          >
            {emoji}
          </motion.span>
        ))}
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
              className="max-w-5xl mx-auto"
            >
              {/* Trust pills row */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8"
              >
                {TRUST_ITEMS.map(({ icon, text, color }) => (
                  <span key={text} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${color}`}>
                    <span className="text-sm">{icon}</span> {text}
                  </span>
                ))}
              </motion.div>

              {/* Badge */}
              <div className="flex justify-center mb-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm border border-sky-100"
                >
                  <span className="text-indigo-500 text-xs">✦</span>
                  <span className="text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-widest">The Ultimate Kids Learning Portal</span>
                  <span className="text-sky-400 text-xs">✦</span>
                </motion.div>
              </div>

              {/* Headline */}
              <div className="text-center mb-5">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-800 leading-[1.06] tracking-tight"
                >
                  Where Kids
                  <br className="hidden sm:block" />
                  <span className="relative inline-block ml-2 sm:ml-0">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500">
                      Fall in Love with Learning
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 10" fill="none">
                      <path d="M2 7 Q 100 1, 200 7 Q 300 13, 398 7" stroke="url(#ug)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                      <defs>
                        <linearGradient id="ug" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0ea5e9"/>
                          <stop offset="50%" stopColor="#6366f1"/>
                          <stop offset="100%" stopColor="#8b5cf6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                className="text-center text-slate-500 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed"
              >
                Expert curriculum · AI tutor · Fun games &amp; rewards — all in one safe, ad-free platform your
                child will <span className="text-slate-700 font-bold">love</span> every day.
              </motion.p>

              {/* Subject pills */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-10"
              >
                {SUBJECTS.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-semibold shadow-sm hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 transition-all cursor-default">
                    {s}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              >
                <Link href="/register"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-xl shadow-sky-200/60 hover:shadow-sky-300/70 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaPlusCircle className="group-hover:rotate-90 transition-transform duration-300" />
                  Start Free — No Credit Card
                </Link>

                <Link href="#gradesCard" scroll={true}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg text-slate-700 bg-white border-2 border-slate-200 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaPlay className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform" />
                  Explore Curriculum
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
                className="grid grid-cols-3 gap-3 sm:gap-5 max-w-md sm:max-w-xl mx-auto"
              >
                {STATS.map(({ value, label, grad }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-white border border-slate-100 rounded-2xl px-3 py-4 shadow-sm hover:shadow-md transition-shadow">
                    <span className={`text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br ${grad}`}>{value}</span>
                    <span className="text-slate-400 text-[10px] sm:text-xs font-semibold text-center">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Social proof */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.56 }}
                className="flex items-center justify-center gap-3 mt-8 text-slate-400 text-xs sm:text-sm font-medium"
              >
                <div className="flex -space-x-2">
                  {["🧒", "👦", "👧", "🧑"].map((e, i) => (
                    <span key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 flex items-center justify-center text-xs border-2 border-white shadow-sm">
                      {e}
                    </span>
                  ))}
                </div>
                <span>Loved by 10,000+ families worldwide</span>
                <span className="text-yellow-400 tracking-tight">★★★★★</span>
              </motion.div>
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
