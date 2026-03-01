"use client";
import { motion } from "framer-motion";

// Shimmer pulse base class - reusable
const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`bg-slate-100/80 rounded-2xl ${shimmer} ${className}`} />
  );
}

// ── Subject Card Skeleton (for Learning Zone) ──────────────────
function SubjectCardSkeleton() {
  return (
    <div className="h-[240px] sm:h-[260px] rounded-[2rem] bg-white border border-slate-100 p-8 shadow-sm flex flex-col justify-between overflow-hidden">
      <div className="space-y-4">
        <SkeletonBlock className="h-16 w-16 rounded-2xl" />
        <SkeletonBlock className="h-8 w-2/3" />
      </div>
      <SkeletonBlock className="h-10 w-32 rounded-full" />
    </div>
  );
}

// ── Grade card skeleton (for home page grid) ──────────────────────
function GradeCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm flex flex-col gap-4">
      <SkeletonBlock className="h-14 w-14 rounded-2xl" />
      <SkeletonBlock className="h-5 w-3/4" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
      <SkeletonBlock className="h-9 w-full mt-2 rounded-xl" />
    </div>
  );
}

// ── Dashboard panel skeleton ──────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-14 w-14 rounded-full flex-shrink-0" />
        <div className="flex-grow space-y-2">
          <SkeletonBlock className="h-5 w-1/2" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white border border-slate-100 p-4 space-y-2">
            <SkeletonBlock className="h-8 w-8 rounded-xl" />
            <SkeletonBlock className="h-6 w-2/3" />
            <SkeletonBlock className="h-3 w-full" />
          </div>
        ))}
      </div>
      {/* Content rows */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
          <SkeletonBlock className="h-10 w-10 rounded-xl flex-shrink-0" />
          <div className="flex-grow space-y-1.5">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
          <SkeletonBlock className="h-8 w-20 rounded-xl flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ── Full-page loading spinner (branded premium) ───────────────────
function PageLoader({ message = "Preparing your adventure..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 font-outfit">
      <div className="relative w-24 h-24">
        {/* Outer Glow Ring */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-[-10px] bg-blue-500/10 rounded-full blur-xl"
        />

        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[3px] border-slate-100 border-t-blue-600 border-r-cyan-400"
        />

        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border-[3px] border-slate-100 border-b-indigo-500 border-l-purple-400"
        />

        {/* Center Mascot-like Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              backgroundColor: ["#2563eb", "#06b6d4", "#2563eb"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          />
        </div>
      </div>

      <div className="text-center space-y-2">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-900 font-black text-lg tracking-tight"
        >
          {message}
        </motion.p>
        <p className="text-slate-400 text-sm font-medium">Please stay on this page</p>
      </div>
    </div>
  );
}

// ── Default export: dynamic skeleton handler ──────────────────
export default function SkeletonLoader({ variant = "grid", message, count = 8 }) {
  if (variant === "page") return <PageLoader message={message} />;
  if (variant === "dashboard") return <DashboardSkeleton />;
  if (variant === "subjects") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
        {[...Array(count)].map((_, i) => (
          <SubjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Default: grade card grid
  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-8">
        {[...Array(count)].map((_, i) => (
          <GradeCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

// Named exports for specific use cases
export { GradeCardSkeleton, DashboardSkeleton, PageLoader, SubjectCardSkeleton };
