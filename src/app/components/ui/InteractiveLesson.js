"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaRobot, FaSmileWink, FaBrain, FaCheckCircle, FaSpinner, FaArrowLeft, FaHome, FaArrowRight, FaPlay, FaStar, FaVolumeUp, FaBookOpen, FaGraduationCap, FaLanguage } from 'react-icons/fa';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useRouter } from 'next/navigation';
import AudioPlayer from './AudioPlayer';

export default function InteractiveLesson({ taskData, childUser, onComplete }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('lesson');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPromptType, setCurrentPromptType] = useState(null);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const { language, toggleLanguage, languageLoaded } = useLanguage();
    const isTamilSubject = taskData?.subjectId?.toLowerCase().includes('tamil') ||
        taskData?.taskId?.toLowerCase().includes('tamil') ||
        typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('tamil');

    // Safely split text into sentences, filter out empty strings, and remove Markdown characters like ** or #
    const cleanContent = (taskData.content || "").replace(/[*#_]/g, "");
    const sentences = (cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent]).map(s => s.trim()).filter(s => s.length > 0);
    const isLastSentence = currentSentenceIndex === sentences.length - 1;
    const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;

    const handleNext = () => {
        if (!isLastSentence) {
            setCurrentSentenceIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSentenceIndex > 0) {
            setCurrentSentenceIndex(prev => prev - 1);
        }
    };

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
                    gradeId: childUser?.gradeId || 'elementary school'
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
                <div className="max-w-5xl mx-auto flex items-center justify-center px-4 sm:px-6 py-3">
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
                            {currentSentenceIndex + 1}/{sentences.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-10 flex-grow flex flex-col z-10">

                {/* Lesson Title Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 sm:mb-10"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-100/60 text-blue-600 rounded-full px-4 py-1.5 mb-3">
                        <FaBookOpen className="text-xs" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Interactive Lesson</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                        {taskData.taskName}
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
                                    <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{currentSentenceIndex + 1} of {sentences.length}</p>
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

                        {/* Card Language Toggle */}
                        {isTamilSubject && languageLoaded && (
                            <div className="absolute top-16 sm:top-20 right-5 sm:right-8 z-20">
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-[10px] shadow drop-shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <FaLanguage size={14} />
                                    <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                                </button>
                            </div>
                        )}

                        {/* Content Area with Animation */}
                        <div className="px-5 sm:px-8 py-8 sm:py-12 md:py-16 min-h-[200px] sm:min-h-[280px] flex flex-col items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSentenceIndex}
                                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30, scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="w-full text-center"
                                >
                                    <p className="text-xl sm:text-3xl md:text-4xl text-slate-800 font-extrabold leading-snug sm:leading-tight max-w-2xl mx-auto">
                                        {sentences[currentSentenceIndex]}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Card Bottom Actions Bar */}
                        <div className="bg-slate-50/60 border-t border-slate-100/60 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
                            {/* Listen Button */}
                            <AudioPlayer
                                text={sentences[currentSentenceIndex]}
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
                                        onClick={onComplete}
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
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-white">AI Tutor Assistant</h3>
                            <p className="text-indigo-200 font-bold text-xs sm:text-sm">Ask me anything about this lesson!</p>
                        </div>
                    </div>

                    {/* Tutor Action Buttons */}
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
                </motion.div>
            </div>
        </div>
    );
}
