"use client";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight, FaCheckCircle, FaUsers, FaBookOpen, FaStar,
} from "react-icons/fa";
import { DEFAULT_LEARNING_SUBJECTS } from "@/app/utils/learningData";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";
import AddChildForm from "@/app/components/dashboard/AddChildForm";

// Same subject list/colors as the Profile settings page, so a family sees
// identical choices whether they're setting this up now or changing it
// later — deliberately duplicated rather than shared, to keep this page
// self-contained and not risk touching profile/page.js.
const SUBJECTS = [
  { id: "English", label: "🇬🇧 English", color: "blue" },
  { id: "Tamil", label: "🇮🇳 Tamil", color: "orange" },
  { id: "Math", label: "🔢 Math", color: "purple" },
  { id: "Science", label: "🔬 Science", color: "green" },
  { id: "Art", label: "🎨 Art", color: "pink" },
  { id: "Music", label: "🎵 Music", color: "indigo" },
  { id: "History", label: "📜 History", color: "amber" },
  { id: "Geography", label: "🌍 Geography", color: "teal" },
  { id: "Computer Science", label: "💻 Computer Science", color: "cyan" },
  { id: "Coding", label: "⌨️ Coding", color: "violet" },
  { id: "Physical Education", label: "⚽ Physical Education", color: "red" },
  { id: "Norwegian", label: "🇳🇴 Norwegian", color: "blue" },
  { id: "French", label: "🇫🇷 French", color: "blue" },
  { id: "Spanish", label: "🇪🇸 Spanish", color: "yellow" },
  { id: "German", label: "🇩🇪 German", color: "slate" },
];

const CHILD_COUNT_OPTIONS = [1, 2, 3, 4, 5];

function StepShell({ eyebrow, title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <span className="text-blue-500 font-black uppercase tracking-[3px] text-[10px] mb-2 block">{eyebrow}</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 font-medium mt-2 max-w-lg mx-auto">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [uid, setUid] = useState(null);

  const [step, setStep] = useState("subjects"); // "subjects" | "count" | "children" | "finish"
  const [subjects, setSubjects] = useState(DEFAULT_LEARNING_SUBJECTS);
  const [childCount, setChildCount] = useState(null);
  const [childIndex, setChildIndex] = useState(0);
  const [childrenCreated, setChildrenCreated] = useState(0);
  const [savingSubjects, setSavingSubjects] = useState(false);

  const justSavedRef = useRef(false);
  useEffect(() => { justSavedRef.current = false; }, [childIndex]);

  // Auth gate + skip straight to the dashboard for anyone who's already
  // been through this (or had children added some other way) — onboarding
  // should never block a returning parent.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUid(u.uid);
      try {
        const childrenSnap = await getDocs(query(collection(db, "users", u.uid, "children"), limit(1)));
        if (!childrenSnap.empty) {
          router.push("/dashboard");
          return;
        }
      } catch (err) {
        console.error("Onboarding: failed to check existing children", err);
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const finishOnboarding = () => setStep("finish");

  const handleContinueFromSubjects = async () => {
    if (subjects.length === 0 || !uid) return;
    setSavingSubjects(true);
    try {
      await setDoc(doc(db, "users", uid), { learningSubjects: subjects }, { merge: true });
    } catch (err) {
      console.error("Failed to save learning subjects", err);
    }
    setSavingSubjects(false);
    setStep("count");
  };

  const handlePickCount = (n) => {
    setChildCount(n);
    setChildIndex(0);
    setStep("children");
  };

  useEffect(() => {
    if (step === "children" && childCount !== null && childIndex >= childCount) {
      finishOnboarding();
    }
  }, [step, childIndex, childCount]);

  useEffect(() => {
    if (step === "finish") {
      const t = setTimeout(() => router.push("/dashboard"), 2200);
      return () => clearTimeout(t);
    }
  }, [step, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-2xl"><DashboardSkeleton /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      <div className="absolute top-8 left-8 z-50">
        <Link href="/">
          <div className="relative w-[200px] h-[60px] transition-transform hover:scale-105 active:scale-95">
            <Image src="/logo.png" alt="KidsPortal" fill className="object-contain object-left" priority />
          </div>
        </Link>
      </div>

      {step !== "finish" && (
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-8 right-8 z-50 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors"
        >
          Skip for now →
        </button>
      )}

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full pt-20 md:pt-0">
        <AnimatePresence mode="wait">
          {step === "subjects" && (
            <StepShell
              key="subjects"
              eyebrow="Step 1 of 2"
              title="What should your child learn?"
              subtitle="Pick as many as you like — you can always change this later in Settings."
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {SUBJECTS.map((subj) => {
                  const isSelected = subjects.includes(subj.id);
                  return (
                    <button
                      type="button"
                      key={subj.id}
                      onClick={() => setSubjects((prev) =>
                        prev.includes(subj.id) ? prev.filter((s) => s !== subj.id) : [...prev, subj.id]
                      )}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${isSelected
                        ? `bg-${subj.color}-50 border-${subj.color}-400 text-${subj.color}-700 shadow-sm`
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                        }`}
                    >
                      <span className="text-base">{subj.label.split(" ")[0]}</span>
                      <span className="truncate">{subj.label.split(" ").slice(1).join(" ")}</span>
                      {isSelected && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
              {subjects.length === 0 && (
                <p className="text-xs text-red-500 font-bold text-center -mt-4 mb-6">⚠️ Please select at least one subject</p>
              )}
              <button
                onClick={handleContinueFromSubjects}
                disabled={subjects.length === 0 || savingSubjects}
                className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-black text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                {savingSubjects ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Continue <FaArrowRight className="text-sm" /></>
                )}
              </button>
            </StepShell>
          )}

          {step === "count" && (
            <StepShell
              key="count"
              eyebrow="Step 2 of 2"
              title="How many children will be learning?"
              subtitle="We'll help you set up a profile for each one, right now."
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-500">
                <FaUsers className="text-3xl" />
              </div>
              <div className="grid grid-cols-5 gap-3 mb-8 mt-6">
                {CHILD_COUNT_OPTIONS.map((n) => (
                  <motion.button
                    key={n}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePickCount(n)}
                    className="aspect-square rounded-2xl border-2 border-slate-200 text-slate-700 font-black text-2xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center"
                  >
                    {n}{n === 5 ? "+" : ""}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setStep("subjects")}
                className="w-full text-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                ← Back
              </button>
            </StepShell>
          )}

          {step === "children" && childCount !== null && childIndex < childCount && (
            <motion.div
              key={`child-${childIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6">
                <FaBookOpen /> Profile {childIndex + 1} of {childCount}
              </div>
              <AddChildForm
                onSaveSuccess={() => {
                  justSavedRef.current = true;
                  setChildrenCreated((c) => c + 1);
                  setChildIndex((i) => i + 1);
                }}
                onClose={() => {
                  if (!justSavedRef.current) {
                    // A real Cancel, not a post-save close — stop adding
                    // children and wrap up with whatever was already saved.
                    finishOnboarding();
                  }
                }}
              />
            </motion.div>
          )}

          {step === "finish" && (
            <StepShell key="finish" eyebrow="All set" title="You're ready to go!">
              <div className="flex flex-col items-center gap-6 py-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-4xl shadow-xl shadow-blue-500/30"
                >
                  <FaStar />
                </motion.div>
                <p className="text-slate-500 font-medium text-center max-w-sm">
                  {childrenCreated > 0
                    ? `${childrenCreated} learner profile${childrenCreated === 1 ? "" : "s"} ready to go. Taking you to your dashboard…`
                    : "Taking you to your dashboard — you can add a learner profile anytime."}
                </p>
                <Link
                  href="/dashboard"
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-3 hover:shadow-xl active:scale-[0.98]"
                >
                  Go to Dashboard <FaCheckCircle />
                </Link>
              </div>
            </StepShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
