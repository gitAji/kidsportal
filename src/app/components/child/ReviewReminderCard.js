"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaTimes, FaArrowLeft, FaArrowRight, FaCheckCircle, FaRedo, FaVolumeUp } from 'react-icons/fa';
import AudioPlayer from '../ui/AudioPlayer';
import { getWeakSpots } from '@/app/utils/reviewQueue';

const subjectDisplayNames = {
    english: 'English', math: 'Math', science: 'Science', tamil: 'Tamil',
    computerscience: 'Computer Science', coding: 'Coding',
};

function subjectLabel(subjectId) {
    const prefix = (subjectId || '').replace(/-\d+$/, '').toLowerCase();
    return subjectDisplayNames[prefix] || (prefix.charAt(0).toUpperCase() + prefix.slice(1));
}

const REVIEW_PROMPT_PREFIX = 'kidsportal_review_prompt_';

// A once-a-day popup on the Learning Zone home screen that re-surfaces a
// few questions the child is still getting wrong (per getWeakSpots), as
// flip-cards — tap to reveal the answer, same mechanic as the grade 1-3
// lesson tiles — with a shortcut back into that level for real practice.
// "Once a day" is the spaced-repetition interval: frequent enough to help,
// not so frequent it nags.
export default function ReviewReminderCard({ childUser }) {
    const router = useRouter();
    const childId = childUser?.uid || childUser?.id;
    const [weakSpots, setWeakSpots] = useState([]);
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (!childId) return;
        const todayKey = new Date().toDateString();
        const lastShown = typeof window !== 'undefined' ? localStorage.getItem(`${REVIEW_PROMPT_PREFIX}${childId}`) : todayKey;
        if (lastShown === todayKey) return;

        let cancelled = false;
        (async () => {
            const spots = await getWeakSpots(childId, { maxItems: 3 });
            if (cancelled || spots.length === 0) return;
            setWeakSpots(spots);
            // A short delay so this doesn't compete with the welcome banner
            // for attention the instant the page mounts.
            setTimeout(() => { if (!cancelled) setVisible(true); }, 2500);
        })();
        return () => { cancelled = true; };
    }, [childId]);

    const markShownToday = () => {
        if (!childId || typeof window === 'undefined') return;
        localStorage.setItem(`${REVIEW_PROMPT_PREFIX}${childId}`, new Date().toDateString());
    };

    const dismiss = () => {
        setVisible(false);
        markShownToday();
    };

    const goTo = (idx) => {
        setRevealed(false);
        setActiveIndex(idx);
    };

    const current = weakSpots[activeIndex];
    const isLast = activeIndex === weakSpots.length - 1;

    const practiceAgain = () => {
        markShownToday();
        setVisible(false);
        router.push(`/learning-zone/subjects/${current.subjectId}/${current.levelId}/${current.taskId}`);
    };

    if (!visible || !current) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', bounce: 0.35 }}
                    className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative"
                >
                    <button
                        onClick={dismiss}
                        aria-label="Maybe later"
                        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 text-slate-400 hover:bg-white hover:text-slate-600 flex items-center justify-center shadow-sm transition-colors"
                    >
                        <FaTimes />
                    </button>

                    <div className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 px-6 pt-7 pb-6 text-white text-center">
                        <div className="w-14 h-14 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner mb-2">
                            <FaBrain />
                        </div>
                        <h2 className="text-xl font-black">Quick Review Time!</h2>
                        <p className="text-indigo-100 font-bold text-sm mt-1">Let's practice a few tricky ones together.</p>
                    </div>

                    <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                                {subjectLabel(current.subjectId)}
                            </span>
                            <span className="text-xs font-black text-slate-400">
                                {activeIndex + 1}/{weakSpots.length}
                            </span>
                        </div>

                        <div className="relative min-h-[11rem]" style={{ perspective: 1000, WebkitPerspective: 1000 }}>
                            <motion.div
                                className="relative w-full h-full"
                                style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
                                animate={{ rotateY: revealed ? 180 : 0 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                {/* Front — the question, tap to reveal the answer */}
                                <button
                                    type="button"
                                    onClick={() => setRevealed(true)}
                                    disabled={revealed}
                                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                    className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white p-5 flex flex-col items-center justify-center gap-3 text-center shadow-lg active:scale-95 transition-transform"
                                >
                                    <p className="font-bold text-base leading-snug">{current.question}</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Tap to see the answer</span>
                                </button>

                                {/* Back — the correct answer, revealed */}
                                <div
                                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                    className="absolute inset-0 w-full h-full rounded-2xl bg-white border-2 border-emerald-100 shadow-md p-5 flex flex-col items-center justify-center gap-2 text-center"
                                >
                                    {revealed && (
                                        <>
                                            <FaCheckCircle className="text-emerald-500 text-2xl" />
                                            <p className="font-black text-slate-800 text-lg leading-snug">{current.correctAnswer}</p>
                                            <AudioPlayer
                                                text={`${current.question}. The answer is ${current.correctAnswer}.`}
                                                lang="en-GB"
                                                icon={<FaVolumeUp className="text-xs" />}
                                                customClassName="mt-1 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                                            />
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                onClick={() => goTo(activeIndex - 1)}
                                disabled={activeIndex === 0}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm transition-all ${activeIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <FaArrowLeft className="text-xs" /> Prev
                            </button>

                            <div className="flex items-center gap-1.5">
                                {weakSpots.map((_, i) => (
                                    <span key={i} className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                ))}
                            </div>

                            {!isLast ? (
                                <button
                                    onClick={() => goTo(activeIndex + 1)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    Next <FaArrowRight className="text-xs" />
                                </button>
                            ) : (
                                <span className="w-16" />
                            )}
                        </div>

                        <button
                            onClick={practiceAgain}
                            className="w-full mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <FaRedo className="text-sm" /> Practice This Level Again
                        </button>
                        <button
                            onClick={dismiss}
                            className="w-full mt-2 text-slate-400 font-bold text-sm py-2 hover:text-slate-600 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
