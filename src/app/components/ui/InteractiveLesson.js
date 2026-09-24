"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLightbulb, FaRobot, FaSmileWink, FaBrain, FaCheckCircle, FaSpinner, FaArrowLeft, FaHome,
    FaArrowRight, FaPlay, FaStar, FaVolumeUp, FaBookOpen, FaGraduationCap, FaLanguage, FaCrown,
    FaCalculator, FaFlask, FaLaptopCode, FaGlobeAmericas, FaCode, FaFeatherAlt,
} from 'react-icons/fa';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';

const SWIPE_THRESHOLD = 80;

// A visual identity per subject — icon + gradient — used to theme the
// companion panel and give each lesson a distinct feel instead of every
// subject looking like the same blue card. Matched loosely against
// subjectId/taskId since those aren't perfectly standardized across the
// curriculum data.
const SUBJECT_THEMES = [
    { match: /math/i, icon: FaCalculator, gradient: 'from-blue-500 to-indigo-500', glow: 'bg-blue-300/30' },
    { match: /science/i, icon: FaFlask, gradient: 'from-emerald-500 to-teal-500', glow: 'bg-emerald-300/30' },
    { match: /computerscience|computer.?science/i, icon: FaLaptopCode, gradient: 'from-sky-500 to-blue-600', glow: 'bg-sky-300/30' },
    { match: /coding/i, icon: FaCode, gradient: 'from-violet-500 to-purple-500', glow: 'bg-violet-300/30' },
    { match: /tamil/i, icon: FaFeatherAlt, gradient: 'from-orange-500 to-rose-500', glow: 'bg-orange-300/30' },
    { match: /english/i, icon: FaBookOpen, gradient: 'from-cyan-500 to-blue-500', glow: 'bg-cyan-300/30' },
];
const DEFAULT_THEME = { icon: FaGlobeAmericas, gradient: 'from-blue-500 to-cyan-500', glow: 'bg-blue-300/30' };

function getSubjectTheme(taskData) {
    const key = `${taskData?.subjectId || ''} ${taskData?.taskId || ''}`;
    return SUBJECT_THEMES.find(t => t.match.test(key)) || DEFAULT_THEME;
}

export default function InteractiveLesson({ taskData, childUser, onComplete }) {
    const router = useRouter();
    const isPremium = !!childUser?.isSubscriptionActive;
    const [activeTab, setActiveTab] = useState('lesson');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPromptType, setCurrentPromptType] = useState(null);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [translatedContent, setTranslatedContent] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [starsEarned, setStarsEarned] = useState(0);
    const [starPop, setStarPop] = useState(false);
    const [mascotMessage, setMascotMessage] = useState(null);
    const theme = getSubjectTheme(taskData);
    const ThemeIcon = theme.icon;
    const isTamilSubject = taskData?.subjectId?.toLowerCase().includes('tamil') ||
        taskData?.taskId?.toLowerCase().includes('tamil') ||
        (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('tamil'));

    const [contentLanguage, setContentLanguage] = useState(isTamilSubject ? 'ta' : 'en');
    const { language, languageLoaded, t } = useLanguage();

    // Once the parent's global learning-language preference has loaded,
    // default non-Tamil-subject content to it too — so a family that picked
    // Tamil in Settings gets Tamil content everywhere, not just the Tamil
    // subject, and doesn't have to manually re-toggle on every lesson.
    useEffect(() => {
        if (!isTamilSubject && languageLoaded && language === 'ta') {
            setContentLanguage('ta');
        }
    }, [isTamilSubject, languageLoaded, language]);

    // Check if the current content appears to be English
    const isEnglishContent = useCallback((text) => {
        if (!text) return true;
        const englishLetters = text.match(/[a-zA-Z]/g);
        return englishLetters && englishLetters.length > (text.length * 0.2); // If > 20% are English letters
    }, []);

    React.useEffect(() => {
        setTranslatedContent(null);
        setCurrentSentenceIndex(0);
        if (!taskData?.content) return;

        // Force translation if target language differs from detected/likely source
        // If content is English but user wants Tamil -> Translate to TA
        // If content is Tamil but user wants English -> Translate to EN
        const contentIsEn = isEnglishContent(taskData.content);
        const needsTranslation = (contentIsEn && contentLanguage === 'ta') || (!contentIsEn && contentLanguage === 'en');
        const targetLang = contentLanguage === 'ta' ? 'ta' : 'en';

        if (needsTranslation) {
            const fetchTranslation = async () => {
                setIsTranslating(true);
                try {
                    const res = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: taskData.content, targetLanguage: targetLang })
                    });
                    const data = await res.json();
                    if (data.translatedText) {
                        setTranslatedContent(data.translatedText);
                    }
                } catch (e) {
                    console.error("Translation failed", e);
                } finally {
                    setIsTranslating(false);
                }
            };
            fetchTranslation();
        }
    }, [taskData, contentLanguage, isEnglishContent]);

    // Safely split text into sentences, filter out empty strings, and remove Markdown characters like ** or #
    // Clean strings like "[EXAM 2] Question" or "Quizz 1: Question" or "Lesson 2 - Question"
    const cleanStr = (str) => {
        if (!str) return "";
        return str
            .replace(/^\[.*?\]\s*/i, "")
            .replace(/^(quizz|quiz|exam|lesson)\s*\d+[:\s-]*/i, "")
            .trim();
    };

    const displayContent = translatedContent || taskData?.content || "";
    const cleanContent = displayContent.replace(/[*#_]/g, "");
    const sentences = (cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent])
        .map(s => cleanStr(s.trim()))
        .filter(s => s.length > 0);
    const validCurrentSentenceIndex = Math.min(currentSentenceIndex, Math.max(0, sentences.length - 1));
    const isLastSentence = validCurrentSentenceIndex === sentences.length - 1;
    const progress = sentences.length > 0 ? ((validCurrentSentenceIndex + 1) / sentences.length) * 100 : 0;

    const handleNext = () => {
        if (!isLastSentence) {
            setCurrentSentenceIndex(prev => prev + 1);
            setStarsEarned(prev => prev + 1);
            setStarPop(true);
            setTimeout(() => setStarPop(false), 500);
        }
    };

    const handlePrev = () => {
        if (currentSentenceIndex > 0) {
            setCurrentSentenceIndex(prev => prev - 1);
        }
    };

    const handleSwipe = (offsetX) => {
        if (offsetX <= -SWIPE_THRESHOLD) handleNext();
        else if (offsetX >= SWIPE_THRESHOLD) handlePrev();
    };

    const handleFinish = () => {
        import('canvas-confetti').then(({ default: confetti }) => {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        });
        onComplete();
    };

    // A friendly professor companion, reusing the same character/name the
    // child picked in Settings — lessons previously showed no mascot at all,
    // unlike quizzes.
    const professor = childUser?.professorCharacter === 'panda'
        ? { name: t('panda_name'), img: '/images/smart-panda.png' }
        : { name: t('owl_name'), img: '/images/professor-owl.png' };

    // Cheer the student on at a few key moments rather than on every single
    // sentence, so the mascot feels encouraging instead of chatty.
    useEffect(() => {
        if (sentences.length === 0) return;
        let message = null;
        if (validCurrentSentenceIndex === 0) {
            message = `Hi! I'm ${professor.name}. Let's learn together!`;
        } else if (isLastSentence) {
            message = "Last one — you've got this!";
        } else if (validCurrentSentenceIndex === Math.floor(sentences.length / 2)) {
            message = "Halfway there, great job!";
        }
        if (message) {
            setMascotMessage(message);
            const clear = setTimeout(() => setMascotMessage(null), 5000);
            return () => clearTimeout(clear);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on milestone changes, not every render
    }, [validCurrentSentenceIndex, sentences.length, isLastSentence]);

    const fetchTutorHelp = async (actionType) => {
        setIsLoading(true);
        setAiResponse('');
        setCurrentPromptType(actionType);

        try {
            const res = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: taskData.content,
                    actionType,
                    gradeId: childUser?.gradeId || 'elementary school',
                    aiContext: taskData.aiContext
                })
            });
            const data = await res.json();
            if (data.response) {
                setAiResponse(data.response);
            } else {
                setAiResponse("Oops! The AI tutor is taking a nap. Try again later!");
            }
        } catch (e) {
            setAiResponse("Uh oh! The robot lost connection. Try again!");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col items-center w-full relative overflow-hidden">

            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-100/60 via-indigo-50/30 to-transparent -z-10" />
            <div className="absolute top-20 -left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl -z-10" />
            <div className="absolute top-40 -right-20 w-60 h-60 bg-indigo-200/15 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-40 left-10 w-32 h-32 bg-cyan-200/15 rounded-full blur-3xl -z-10" />

            {/* Sticky Top Navigation */}
            <div className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 px-4 sm:px-6 py-3">
                    {/* Center: Compact Progress */}
                    <div className="flex items-center gap-3 w-full max-w-sm">
                        <div className="flex-1 h-2 bg-slate-200/60 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                            />
                        </div>
                        <span className="text-xs font-black text-slate-400 whitespace-nowrap">
                            {validCurrentSentenceIndex + 1}/{sentences.length}
                        </span>
                    </div>

                    {/* Stars collected this lesson */}
                    <motion.div
                        animate={starPop ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-black text-xs whitespace-nowrap"
                    >
                        <FaStar className="text-amber-400" /> {starsEarned}
                    </motion.div>
                </div>
            </div>

            {/* Main Content — full-width on large screens, with a companion
                panel alongside the lesson instead of everything living in a
                single narrow centered column. */}
            <div className="w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-10 flex-grow z-10 xl:grid xl:grid-cols-[1fr_360px] xl:gap-10 xl:items-start">
              <div className="flex flex-col min-w-0">

                {/* Lesson Title Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 sm:mb-10"
                >
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${theme.gradient} text-white rounded-full px-4 py-1.5 mb-3 shadow-md`}>
                        <ThemeIcon className="text-xs" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{taskData.subjectId || 'Interactive Lesson'}</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                        {cleanStr(taskData.taskName)}
                    </h1>
                </motion.div>

                {/* Concept Card — The Star of the Page */}
                <div className="relative mb-6 sm:mb-10">
                    {/* Card Container */}
                    <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100/80 overflow-hidden">

                        {/* Card Top Accent Bar */}
                        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

                        {/* Concept Number Badge */}
                        <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <FaGraduationCap className="text-sm sm:text-base" />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Concept</p>
                                    <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{validCurrentSentenceIndex + 1} of {sentences.length}</p>
                                </div>
                            </div>

                            {/* Step Dots */}
                            <div className="flex gap-1.5 sm:gap-2">
                                {sentences.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSentenceIndex(idx)}
                                        className={`rounded-full transition-all duration-300 ${idx === currentSentenceIndex
                                            ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md shadow-blue-400/30'
                                            : idx < currentSentenceIndex
                                                ? 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-blue-300 hover:bg-blue-400 cursor-pointer'
                                                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-200 hover:bg-slate-300 cursor-pointer'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Optional Video Header */}
                        {taskData.videoUrl && (
                            <div className="w-full aspect-video bg-slate-100 border-b border-slate-100 overflow-hidden relative group">
                                <iframe
                                    src={taskData.videoUrl}
                                    className="w-full h-full"
                                    title="Lesson Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {/* Card Language Toggle */}
                        {languageLoaded && (
                            <div className={`absolute ${taskData.videoUrl ? 'bottom-5' : 'top-16 sm:top-20'} right-5 sm:right-8 z-20`}>
                                <button
                                    onClick={() => setContentLanguage(prev => prev === 'en' ? 'ta' : 'en')}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-[10px] shadow drop-shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <FaLanguage size={14} />
                                    <span>{contentLanguage === 'en' ? 'தமிழ்' : 'English'}</span>
                                </button>
                            </div>
                        )}

                        {/* Content Area with Animation — swipeable on touch devices.
                            A giant watermark icon + a couple of slowly floating
                            accent shapes give the concept some visual presence
                            instead of it being a plain wall of text. */}
                        <div className="relative px-5 sm:px-8 py-8 sm:py-12 md:py-16 min-h-[220px] sm:min-h-[300px] flex flex-col items-center justify-center touch-pan-y overflow-hidden">
                            <ThemeIcon className={`absolute -z-0 text-[9rem] sm:text-[13rem] text-transparent bg-clip-text bg-gradient-to-br ${theme.gradient} opacity-[0.06] pointer-events-none select-none`} />
                            <motion.div
                                animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                                className={`hidden sm:flex absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} items-center justify-center text-white shadow-lg opacity-90`}
                            >
                                <ThemeIcon className="text-lg" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                                className="hidden sm:flex absolute bottom-8 right-8 w-8 h-8 rounded-full bg-amber-300/80 items-center justify-center text-white shadow-md"
                            >
                                <FaStar className="text-xs" />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={validCurrentSentenceIndex}
                                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30, scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.7}
                                    onDragEnd={(_, info) => handleSwipe(info.offset.x)}
                                    className="relative w-full text-center cursor-grab active:cursor-grabbing"
                                >
                                    <p className="text-xl sm:text-3xl md:text-4xl text-slate-800 font-extrabold leading-snug sm:leading-tight max-w-2xl mx-auto">
                                        {isTranslating ? <span className="animate-pulse text-indigo-400">Translating...</span> : sentences[validCurrentSentenceIndex]}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Card Bottom Actions Bar */}
                        <div className="bg-slate-50/60 border-t border-slate-100/60 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
                            {/* Listen Button */}
                            <AudioPlayer
                                text={sentences[validCurrentSentenceIndex]}
                                lang="en-US"
                                label="Listen"
                                icon={<FaVolumeUp />}
                                customClassName="inline-flex items-center gap-2 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-blue-600 rounded-xl sm:rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-blue-50 transition-all cursor-pointer border border-blue-100 text-sm sm:text-base"
                            />

                            {/* Navigation Buttons */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentSentenceIndex === 0}
                                    className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all ${currentSentenceIndex === 0
                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        : 'bg-white text-slate-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-slate-200'
                                        }`}
                                >
                                    <FaArrowLeft className="text-xs" />
                                    <span className="hidden sm:inline">Prev</span>
                                </button>

                                {!isLastSentence ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-1.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                                    >
                                        Next <FaArrowRight className="text-xs" />
                                    </button>
                                ) : (
                                    <motion.button
                                        onClick={handleFinish}
                                        animate={{ scale: [1, 1.03, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="flex items-center gap-1.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                                    >
                                        <FaCheckCircle className="text-xs sm:text-sm" /> Done!
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Interactive Tutor Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100/80 overflow-hidden"
                >
                    {/* Tutor Header */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-5 sm:p-6 flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg border-2 border-white/30">
                            <FaRobot />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-black text-white">AI Tutor Assistant</h3>
                                {!isPremium && (
                                    <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                        <FaCrown className="text-[9px]" /> Premium
                                    </span>
                                )}
                            </div>
                            <p className="text-indigo-200 font-bold text-xs sm:text-sm">Ask me anything about this lesson!</p>
                        </div>
                    </div>

                    {!isPremium ? (
                        /* Upsell — AI Tutor is a Premium-only feature */
                        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                <FaCrown />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-lg leading-tight">Unlock the AI Tutor with Premium</p>
                                <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm">
                                    Get simpler explanations, fun examples, and challenge questions from your AI tutor on every lesson.
                                </p>
                            </div>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-black text-sm shadow-lg hover:scale-105 transition-all"
                            >
                                <FaCrown /> Upgrade to Premium
                            </Link>
                        </div>
                    ) : (
                    /* Tutor Action Buttons */
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <button
                                onClick={() => fetchTutorHelp('simplify')}
                                disabled={isLoading}
                                className="group bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-700 font-bold py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl border-2 border-indigo-100 hover:border-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-1.5 sm:gap-2 disabled:opacity-50"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaSmileWink className="text-xl sm:text-2xl text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-black leading-tight text-center">Explain simpler</span>
                            </button>

                            <button
                                onClick={() => fetchTutorHelp('example')}
                                disabled={isLoading}
                                className="group bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-700 font-bold py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-1.5 sm:gap-2 disabled:opacity-50"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaStar className="text-xl sm:text-2xl text-emerald-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-black leading-tight text-center">Give example</span>
                            </button>

                            <button
                                onClick={() => fetchTutorHelp('practice')}
                                disabled={isLoading}
                                className="group bg-fuchsia-50/60 hover:bg-fuchsia-100/80 text-fuchsia-700 font-bold py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl border-2 border-fuchsia-100 hover:border-fuchsia-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-1.5 sm:gap-2 disabled:opacity-50"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaBrain className="text-xl sm:text-2xl text-fuchsia-400 group-hover:text-fuchsia-500 transition-colors" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-black leading-tight text-center">Challenge me</span>
                            </button>
                        </div>

                        {/* AI Response Area */}
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-indigo-50/50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-100 flex items-center justify-center gap-3 text-indigo-600 font-bold text-sm sm:text-base"
                                >
                                    <FaSpinner className="animate-spin text-xl sm:text-2xl" /> The AI is thinking...
                                </motion.div>
                            ) : aiResponse ? (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-100 shadow-sm"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                            <FaRobot className="text-sm" />
                                        </div>
                                        <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed break-words">
                                            {aiResponse}
                                        </p>
                                    </div>
                                    <div className="flex justify-end mt-3 pt-3 border-t border-indigo-100/50">
                                        <AudioPlayer
                                            text={aiResponse}
                                            label="Listen"
                                            icon={<FaVolumeUp />}
                                            customClassName="inline-flex items-center gap-2 bg-white px-4 py-2 text-indigo-600 rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all cursor-pointer border border-indigo-100 text-sm"
                                        />
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                    )}
                </motion.div>
              </div>

              {/* Companion Panel — desktop/large-screen only. Puts the
                  mascot front and center in a real illustrated panel next
                  to the lesson instead of tucked into a tiny corner bubble,
                  and uses the extra width full-width layouts are supposed
                  to give back to the page rather than just stretching the
                  same narrow card. */}
              <div className="hidden xl:flex flex-col gap-5 sticky top-24">
                <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${theme.gradient} p-6 shadow-xl text-white`}>
                    <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${theme.glow} blur-2xl`} />
                    <div className={`absolute -bottom-14 -left-10 w-40 h-40 rounded-full ${theme.glow} blur-2xl`} />

                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                        className="relative w-32 h-32 mx-auto"
                    >
                        <div className="w-full h-full rounded-full bg-white shadow-lg border-4 border-white/70 overflow-hidden relative">
                            <Image src={professor.img} alt={professor.name} fill className="object-contain p-3" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                        >
                            <FaStar className="text-white text-xs" />
                        </motion.div>
                    </motion.div>

                    <p className="relative text-center font-black text-lg mt-4">{professor.name}</p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mascotMessage || 'idle'}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="relative mt-4 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center"
                        >
                            <p className="text-sm font-bold leading-snug">
                                {mascotMessage || "You're doing great — keep going!"}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Quick stats — reuses numbers already on screen so the
                    panel earns its width instead of being empty space. */}
                <div className="bg-white rounded-[1.75rem] shadow-md border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Lesson</span>
                        <ThemeIcon className="text-slate-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-2xl p-3 text-center">
                            <p className="text-2xl font-black text-slate-800">{starsEarned}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stars</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-3 text-center">
                            <p className="text-2xl font-black text-slate-800">{Math.round(progress)}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complete</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Persistent Professor Companion — mobile/tablet only; the
                desktop companion panel above replaces this once there's
                room for it. */}
            <div className="xl:hidden fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
                <AnimatePresence>
                    {mascotMessage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="mb-3 max-w-[220px] bg-white rounded-2xl rounded-br-sm shadow-xl border border-slate-100 px-4 py-3"
                        >
                            <p className="text-sm font-bold text-slate-700 leading-snug">{mascotMessage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl border-4 border-white overflow-hidden relative pointer-events-auto"
                >
                    <Image src={professor.img} alt={professor.name} fill className="object-contain p-1.5" />
                </motion.div>
            </div>
        </div>
    );
}
