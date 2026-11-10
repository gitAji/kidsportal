"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLightbulb, FaRobot, FaSmileWink, FaBrain, FaCheckCircle, FaSpinner, FaArrowLeft, FaHome,
    FaArrowRight, FaPlay, FaStar, FaVolumeUp, FaBookOpen, FaGraduationCap,
    FaCalculator, FaFlask, FaLaptopCode, FaGlobeAmericas, FaCode, FaFeatherAlt, FaLock,
} from 'react-icons/fa';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';
import { getConceptEmoji } from '@/app/utils/conceptEmoji';
import { trackEvent } from '@/app/utils/trackEvent';
import { getConceptVisual } from '@/app/utils/conceptVisuals';
import { getNarrationLang } from '@/app/utils/narrationLang';

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
    { match: /lifeskills|life.?skills/i, icon: FaGraduationCap, gradient: 'from-teal-500 to-emerald-500', glow: 'bg-teal-300/30' },
];
const DEFAULT_THEME = { icon: FaGlobeAmericas, gradient: 'from-blue-500 to-cyan-500', glow: 'bg-blue-300/30' };

function getSubjectTheme(taskData) {
    const key = `${taskData?.subjectId || ''} ${taskData?.taskId || ''}`;
    return SUBJECT_THEMES.find(t => t.match.test(key)) || DEFAULT_THEME;
}

export default function InteractiveLesson({ taskData, childUser, onComplete }) {
    const router = useRouter();
    // The AI Tutor Assistant is its own $25/month add-on (separate from the
    // main Premium plan) — gated on that purchase alone, not subscription status.
    const hasAiTutorPack = !!childUser?.isAiTutorPackActive;
    const [activeTab, setActiveTab] = useState('lesson');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPromptType, setCurrentPromptType] = useState(null);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [starsEarned, setStarsEarned] = useState(0);
    const [starPop, setStarPop] = useState(false);
    const [mascotMessage, setMascotMessage] = useState(null);
    // Which word the narration is currently speaking, as a {charIndex,
    // charLength} range into the currently-speaking tile's text — drives
    // the read-along highlight. null = nothing highlighted.
    const [activeWordRange, setActiveWordRange] = useState(null);
    // Early grades: a "tap to discover" board instead of swiping through
    // cards. Every fact is visible at once as a face-down tile; tapping one
    // reveals it (with narration) — exploring rather than a forced linear
    // order. revealedTiles holds the indices already uncovered.
    const [revealedTiles, setRevealedTiles] = useState(() => new Set());
    const [speakingTileIndex, setSpeakingTileIndex] = useState(null);
    const theme = getSubjectTheme(taskData);
    const ThemeIcon = theme.icon;
    // Grades 1-3 get the tap-to-discover board (see revealedTiles above)
    // instead of swiping through sentence cards.
    const gradeNum = parseInt((childUser?.gradeId || taskData?.gradeId || '').replace(/[^0-9]/g, ''), 10);
    const isEarlyGrade = gradeNum >= 1 && gradeNum <= 3;
    const childId = childUser?.uid || childUser?.id;
    // Some lessons (e.g. shape/geometry concepts) have a dedicated
    // interactive visual instead of the card-based flow — tapping an
    // actual shape to count its sides, or tracing a rectangle's perimeter,
    // teaches those concepts far better than flipping a card and reading a
    // paragraph. See utils/conceptVisuals.js.
    const conceptVisual = getConceptVisual(taskData?.taskId);
    const { t } = useLanguage();

    React.useEffect(() => {
        setCurrentSentenceIndex(0);
    }, [taskData]);

    // Safely split text into sentences, filter out empty strings, and remove Markdown characters like ** or #
    // Clean strings like "[EXAM 2] Question" or "Quizz 1: Question" or "Lesson 2 - Question"
    const cleanStr = (str) => {
        if (!str) return "";
        return str
            .replace(/^\[.*?\]\s*/i, "")
            .replace(/^(quizz|quiz|exam|lesson)\s*\d+[:\s-]*/i, "")
            .trim();
    };

    // Each full sentence is one unit of content. Early grades used to chop
    // these further into sub-sentence fragments (6-word or mid-clause cuts)
    // to keep cards short, but that routinely produced nonsense fragments
    // ("and the second digit tells") with no complete thought on screen —
    // worse than a slightly longer, grammatical sentence.
    const displayContent = taskData?.content || "";
    const cleanContent = displayContent.replace(/[*#_]/g, "");
    const sentences = (cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent])
        .map(s => cleanStr(s.trim()))
        .filter(s => s.length > 0);
    const validCurrentSentenceIndex = Math.min(currentSentenceIndex, Math.max(0, sentences.length - 1));
    const isLastSentence = validCurrentSentenceIndex === sentences.length - 1;
    const progress = sentences.length === 0 ? 0
        : isEarlyGrade ? (revealedTiles.size / sentences.length) * 100
            : ((validCurrentSentenceIndex + 1) / sentences.length) * 100;
    const progressLabel = isEarlyGrade ? `${revealedTiles.size}/${sentences.length}` : `${validCurrentSentenceIndex + 1}/${sentences.length}`;

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

    // The read-along highlight only ever means something for the card
    // currently on screen — drop it the moment that card changes, instead
    // of leaving a stale word lit up from the previous card.
    useEffect(() => {
        setActiveWordRange(null);
    }, [validCurrentSentenceIndex]);

    // A new lesson (or a retake) starts with every tile face-down again.
    useEffect(() => {
        setRevealedTiles(new Set());
        setSpeakingTileIndex(null);
        setActiveWordRange(null);
    }, [taskData?.taskId]);

    const allTilesRevealed = sentences.length > 0 && revealedTiles.size === sentences.length;

    // Tapping a tile is the whole interaction for early grades: flip it
    // face-up, pop a sound, and start its narration (the AudioPlayer that
    // mounts for a just-revealed tile autoPlays on its own). Tapping an
    // already-revealed tile just replays it.
    const handleTileTap = (idx) => {
        if (!revealedTiles.has(idx)) {
            setRevealedTiles(prev => new Set(prev).add(idx));
            setStarsEarned(prev => prev + 1);
            setStarPop(true);
            setTimeout(() => setStarPop(false), 500);
            trackEvent(childId, 'lesson_card_viewed', {
                taskId: taskData?.taskId, subjectId: taskData?.subjectId,
                cardIndex: idx + 1, totalCards: sentences.length, mode: 'discover-tile',
            });
        }
        if (typeof Audio !== 'undefined') {
            const pop = new Audio('/sounds/pop.mp3');
            pop.volume = 0.5;
            pop.play().catch(() => {});
        }
    };

    // Renders a tile's text with the word the narration is saying right
    // now highlighted, using the {charIndex, charLength} boundary
    // AudioPlayer reports — a read-along effect like Khan Academy Kids /
    // Epic!, built on the browser's own speech boundaries rather than any
    // new content or AI call.
    const renderReadAlongText = (text) => {
        if (!activeWordRange || activeWordRange.charIndex < 0 || !text) return text;
        const { charIndex, charLength } = activeWordRange;
        const end = charLength > 0 ? charIndex + charLength : text.indexOf(' ', charIndex) === -1 ? text.length : text.indexOf(' ', charIndex);
        if (charIndex >= text.length) return text;
        return (
            <>
                {text.slice(0, charIndex)}
                <span className="bg-amber-200/80 text-slate-900 rounded-md px-1 -mx-1 transition-colors">
                    {text.slice(charIndex, end)}
                </span>
                {text.slice(end)}
            </>
        );
    };

    const handleFinish = () => {
        import('canvas-confetti').then(({ default: confetti }) => {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        });
        trackEvent(childId, 'lesson_completed', { taskId: taskData?.taskId, subjectId: taskData?.subjectId, totalCards: sentences.length });
        onComplete();
    };

    // Logs each card as the child reaches it — this is what shows where in a
    // lesson kids actually stop reading/listening, not just whether they
    // finished it. Early grades log per-tile reveals instead (handleTileTap),
    // since there's no single "current card" in the discovery board.
    useEffect(() => {
        if (isEarlyGrade || sentences.length === 0) return;
        trackEvent(childId, 'lesson_card_viewed', {
            taskId: taskData?.taskId,
            subjectId: taskData?.subjectId,
            cardIndex: validCurrentSentenceIndex + 1,
            totalCards: sentences.length,
            mode: 'sentence',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- log once per card change, not on every taskData/sentences identity change
    }, [validCurrentSentenceIndex, childId, isEarlyGrade]);

    // A friendly professor companion, reusing the same character/name the
    // child picked in Settings — lessons previously showed no mascot at all,
    // unlike quizzes.
    // scale compensates for the source artwork itself: the panda character
    // sits with noticeably more empty padding around it on its canvas than
    // the owl (measured ~67% vs ~82% horizontal fill), so at the same frame
    // size it renders visibly smaller unless scaled up to match.
    const professor = childUser?.professorCharacter === 'panda'
        ? { id: 'panda', name: t('panda_name'), img: '/images/smart-panda.png', scale: 1.22 }
        : { id: 'owl', name: t('owl_name'), img: '/images/professor-owl.png', scale: 1 };

    // Cheer the student on at a few key moments rather than on every single
    // sentence, so the mascot feels encouraging instead of chatty. Early
    // grades key this off tiles discovered instead of a linear position.
    useEffect(() => {
        if (sentences.length === 0 || !isEarlyGrade) return;
        let message = null;
        if (revealedTiles.size === 1) {
            message = `Hi! I'm ${professor.name}. Tap every tile to find what's hiding!`;
        } else if (allTilesRevealed) {
            message = "You found them all — amazing!";
        } else if (revealedTiles.size === Math.floor(sentences.length / 2)) {
            message = "Halfway there, great job!";
        }
        if (message) {
            setMascotMessage(message);
            const clear = setTimeout(() => setMascotMessage(null), 5000);
            return () => clearTimeout(clear);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on milestone changes, not every render
    }, [revealedTiles.size, sentences.length, isEarlyGrade, allTilesRevealed]);

    useEffect(() => {
        if (sentences.length === 0 || isEarlyGrade) return;
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
    }, [validCurrentSentenceIndex, sentences.length, isLastSentence, isEarlyGrade]);

    const fetchTutorHelp = async (actionType) => {
        setIsLoading(true);
        setAiResponse('');
        setCurrentPromptType(actionType);
        trackEvent(childId, 'ai_tutor_used', { taskId: taskData?.taskId, actionType });

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
                            {progressLabel}
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

            {/* Main Content */}
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-grow z-10 flex flex-col min-w-0">

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

                        {/* Concept Number Badge — not meaningful for a
                            dedicated concept visual, which tracks its own
                            tap-to-count progress instead of a sentence index. */}
                        {!conceptVisual && (
                        <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <FaGraduationCap className="text-sm sm:text-base" />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{isEarlyGrade ? 'Discovered' : 'Concept'}</p>
                                    <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{progressLabel}</p>
                                </div>
                            </div>

                            {/* Step Dots (older grades) */}
                            {!isEarlyGrade && (
                                <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[140px] sm:max-w-[220px]">
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
                            )}
                        </div>
                        )}

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

                        {conceptVisual ? (
                            <conceptVisual.Component {...conceptVisual.props} onComplete={handleFinish} />
                        ) : isEarlyGrade ? (
                            /* Tap-to-discover board: every fact in the lesson sits
                               face-down as a tile. The child explores in whatever
                               order they like instead of being forced through a
                               single linear sequence — tapping a tile is the
                               entire interaction, not a decoration on top of one. */
                            <div className="px-4 sm:px-8 py-8 sm:py-10">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {sentences.map((sentence, idx) => {
                                        const revealed = revealedTiles.has(idx);
                                        const speaking = speakingTileIndex === idx;
                                        const faceStyle = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
                                        return (
                                            <div
                                                key={idx}
                                                className="relative min-h-[9rem] sm:min-h-[11rem]"
                                                style={{ perspective: 1000, WebkitPerspective: 1000 }}
                                            >
                                                <motion.div
                                                    className="relative w-full h-full"
                                                    style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
                                                    animate={{ rotateY: revealed ? 180 : 0 }}
                                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                                >
                                                    {/* Front face — face-down, tap to flip */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTileTap(idx)}
                                                        disabled={revealed}
                                                        aria-label="Tap to flip this card"
                                                        style={faceStyle}
                                                        className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center gap-1.5 shadow-lg text-white active:scale-95 transition-transform`}
                                                    >
                                                        <span className="text-3xl sm:text-4xl">❓</span>
                                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-80">Tap me!</span>
                                                    </button>

                                                    {/* Back face — the revealed fact, pre-rotated so it faces
                                                        forward once the card above has flipped 180deg */}
                                                    <div
                                                        style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
                                                        className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-white border-2 border-amber-100 shadow-md p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center"
                                                    >
                                                        {revealed && (
                                                            <>
                                                                <span className="absolute top-2 right-2 text-amber-400">
                                                                    <FaStar className="text-sm" />
                                                                </span>
                                                                <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
                                                                    {getConceptEmoji(sentence, taskData?.subjectId)}
                                                                </span>
                                                                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                                                                    {speaking ? renderReadAlongText(sentence) : sentence}
                                                                </p>
                                                                <AudioPlayer
                                                                    text={sentence}
                                                                    lang={getNarrationLang(taskData?.subjectId)}
                                                                    icon={<FaVolumeUp className="text-xs" />}
                                                                    autoPlay
                                                                    onPlay={() => {
                                                                        setSpeakingTileIndex(idx);
                                                                        trackEvent(childId, 'audio_listen_used', { taskId: taskData?.taskId, cardIndex: idx + 1 });
                                                                    }}
                                                                    onWordBoundary={(charIndex, charLength) => setActiveWordRange(charIndex < 0 ? null : { charIndex, charLength })}
                                                                    customClassName="p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
                                    {!allTilesRevealed ? (
                                        <p className="text-sm font-bold text-slate-400">Tap every tile to find what's hiding!</p>
                                    ) : (
                                        <motion.button
                                            onClick={handleFinish}
                                            animate={{ scale: [1, 1.03, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="flex items-center gap-1.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all text-base"
                                        >
                                            <FaCheckCircle /> Done!
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
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
                                                {sentences[validCurrentSentenceIndex]}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Card Bottom Actions Bar */}
                                <div className="bg-slate-50/60 border-t border-slate-100/60 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
                                    {/* Listen Button */}
                                    <AudioPlayer
                                        text={sentences[validCurrentSentenceIndex]}
                                        lang={getNarrationLang(taskData?.subjectId)}
                                        label="Listen"
                                        icon={<FaVolumeUp />}
                                        onPlay={() => trackEvent(childId, 'audio_listen_used', { taskId: taskData?.taskId, cardIndex: validCurrentSentenceIndex + 1 })}
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
                            </>
                        )}
                    </div>
                </div>

                {/* AI Interactive Tutor Section */}
                {!hasAiTutorPack && childUser ? (
                    /* The pack isn't active for this child — a kid shouldn't see a
                       big upsell card for a feature that's off, just a small,
                       unobtrusive sign. A parent turns it on from their dashboard. */
                    <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 font-black text-xs sm:text-sm uppercase tracking-wide">
                        <FaLock className="text-[10px] sm:text-xs" />
                        <span>AI Teacher: Off</span>
                    </div>
                ) : (
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
                                {!hasAiTutorPack && (
                                    <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                        <FaRobot className="text-[9px]" /> Add-on
                                    </span>
                                )}
                            </div>
                            <p className="text-indigo-200 font-bold text-xs sm:text-sm">Ask me anything about this lesson!</p>
                        </div>
                    </div>

                    {!hasAiTutorPack ? (
                            /* Teacher/admin preview (no childUser) — not a kid, so the
                               upsell link to pricing is fine here. */
                            <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                    <FaRobot />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-lg leading-tight">Buy this AI Tutor Pack to enable your AI teacher!</p>
                                    <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm">
                                        Get simpler explanations, fun examples, and challenge questions from your AI tutor on every lesson — just $25/month.
                                    </p>
                                </div>
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-black text-sm shadow-lg hover:scale-105 transition-all"
                                >
                                    <FaRobot /> Add AI Tutor Pack
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
                )}
              </div>

            {/* AI Tutor Avatar (Matches Quiz/Exam design) */}
            <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col justify-end items-end pointer-events-none">
              {/* Mascot Speech Bubble */}
              <AnimatePresence mode="wait">
                {mascotMessage && (
                  <motion.div
                    key="speech-bubble"
                    initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                    className="bg-white/95 backdrop-blur-md rounded-3xl rounded-br-sm shadow-2xl p-4 md:p-5 mb-3 max-w-[260px] md:max-w-sm border-4 border-indigo-300 overflow-hidden pointer-events-auto relative"
                  >
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                      <FaStar className="text-yellow-400 text-xs" />
                    </div>
                    <p className="font-bold text-slate-700 text-sm md:text-base leading-snug">
                      {mascotMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Professor Character */}
              <div className="relative pointer-events-auto mt-2">
                {/* Name Tag */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden sm:block absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg border border-slate-700 z-30 whitespace-nowrap"
                >
                  {professor.name}
                </motion.div>

                <motion.div
                  animate={professor.id === 'panda'
                    // The panda's art has a raised waving paw — a little
                    // shoulder-to-shoulder rocking reads as it actually
                    // waving, instead of just bobbing in place.
                    ? { y: [0, -6, 0], rotate: [0, -4, 4, -4, 0] }
                    : { y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="w-16 h-16 sm:w-28 sm:h-28 md:w-44 md:h-44 flex items-center justify-center mr-2 relative z-20 group"
                >
                  <div className="relative w-full h-full bg-white rounded-full border-[5px] shadow-[0_10px_25px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center transition-all duration-300 border-indigo-200 group-hover:border-indigo-400 group-hover:shadow-[0_15px_35px_rgba(99,102,241,0.3)]">
                    <div className="relative w-[85%] h-[85%] mt-3" style={{ transform: `scale(${professor.scale || 1})` }}>
                      {/* No `priority` here: this is a decorative floating
                          mascot, not above-the-fold critical content.
                          `priority` makes Next.js inject a high-priority
                          preload for this image, which competes with the
                          JS bundle for bandwidth on a slow connection —
                          that delays hydration, which is what actually
                          makes the page feel frozen/unclickable for a few
                          seconds, not the image itself. */}
                      <Image
                        src={professor.img}
                        alt={professor.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
        </div>
    );
}
