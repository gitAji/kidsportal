"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGraduationCap, FaLayerGroup, FaTimes, FaImage, FaSync, FaLightbulb
} from 'react-icons/fa';
import TeacherAdminGuard from './TeacherAdminGuard';

// ── Static metadata ──────────────────────────────────────────────
const GRADES = [
    { id: 'grade-1', name: 'Grade 1' },
    { id: 'grade-2', name: 'Grade 2' },
    { id: 'grade-3', name: 'Grade 3' },
    { id: 'grade-4', name: 'Grade 4' },
    { id: 'grade-5', name: 'Grade 5' },
];
const SUBJECTS = [
    { id: 'english', name: 'English' },
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'tamil', name: 'Tamil' },
];
const TASK_TYPES = ['lesson', 'quiz', 'exam'];

const EMPTY_QUESTION = {
    questionText: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    imageUrl: ''
};

const EMPTY_TASK = {
    taskId: '',
    taskName: '',
    type: 'lesson',
    timeLimit: 0,
    content: '',
    questions: []
};

const EMPTY_LEVEL = {
    levelId: '',
    levelName: '',
    moduleName: '', // Added module support
    isLocked: false,
    xpReward: 50,
    tasks: [],
    description: '',
    badgeEmoji: '⭐',
    researchContext: '',
};

// ── Question Editor ──────────────────────────────────────────────────────────
function QuestionEditor({ question, onChange, onRemove, index }) {
    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">Q{index + 1}</span>
                <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors"><FaTimes /></button>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">Question Text</label>
                <input value={question.questionText} onChange={e => onChange({ ...question, questionText: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>

            {/* Image URL Field */}
            <div>
                <label className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <FaImage className="text-purple-400" /> Image URL <span className="text-slate-300 font-normal">(optional — paste a link to show a picture)</span>
                </label>
                <input
                    value={question.imageUrl || ''}
                    onChange={e => onChange({ ...question, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.png"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {question.imageUrl && (
                    <div className="mt-2 relative group">
                        <img
                            src={question.imageUrl}
                            alt="Question preview"
                            className="max-h-40 rounded-xl border-2 border-purple-200 object-contain bg-white shadow-sm"
                            onError={e => { e.target.style.display = 'none'; }}
                            onLoad={e => { e.target.style.display = 'block'; }}
                        />
                        <button
                            onClick={() => onChange({ ...question, imageUrl: '' })}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Type</label>
                    <select value={question.type} onChange={e => onChange({ ...question, type: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="identification">Identification</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Correct Answer</label>
                    <input value={question.correctAnswer} onChange={e => onChange({ ...question, correctAnswer: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
            </div>
            {question.type === 'multiple-choice' && (
                <div className="grid grid-cols-2 gap-2">
                    {question.options.map((opt, oi) => (
                        <div key={oi}>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Option {oi + 1}</label>
                            <input value={opt} onChange={e => { const os = [...question.options]; os[oi] = e.target.value; onChange({ ...question, options: os }); }}
                                className="w-full border border-slate-100 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Task Editor ──────────────────────────────────────────────────────────────
function TaskEditor({ task, onChange, onRemove, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs">{index + 1}</div>
                    <div>
                        <p className="font-bold text-slate-700 text-sm">{task.taskName || 'Untitled Task'}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{task.type} · {task.taskId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-red-300 hover:text-red-500 transition-colors p-2"><FaTrash size={14} /></button>
                    <div className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                        <FaChevronDown className="text-slate-300" size={12} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 bg-slate-50/50 space-y-4 pt-4 border-t border-slate-100">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-tighter">Task Type</label>
                                    <select value={task.type} onChange={e => onChange({ ...task, type: e.target.value })}
                                        className={`w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-300 ${task.type === 'lesson' ? 'text-green-600' : task.type === 'quiz' ? 'text-blue-600' : 'text-red-600'}`}>
                                        {TASK_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1 lg:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-tighter">Task Name</label>
                                    <input value={task.taskName} onChange={e => onChange({ ...task, taskName: e.target.value })}
                                        placeholder="e.g. Master the Vowels" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-tighter">Time Limit (s)</label>
                                    <div className="relative">
                                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                                        <input type="number" value={task.timeLimit || 0} onChange={e => onChange({ ...task, timeLimit: parseInt(e.target.value) || 0 })}
                                            className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-tighter">Internal Task ID</label>
                                <input value={task.taskId} onChange={e => onChange({ ...task, taskId: e.target.value })}
                                    placeholder="short-slug-id" className="w-full border border-slate-200 rounded-xl px-3 py-1 text-[10px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-300" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <FaBookOpen className="text-slate-400 text-xs" />
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Teaching Content / Instructions</label>
                                </div>
                                <textarea value={task.content} onChange={e => onChange({ ...task, content: e.target.value })} rows={3}
                                    placeholder="Enter the lesson text or instructions for the quiz..."
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                            </div>

                            {/* Questions Section - Only for Quiz/Exam */}
                            {(task.type === 'quiz' || task.type === 'exam') && (
                                <div className="space-y-3 pt-2 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FaCheckSquare className="text-blue-500 text-sm" />
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Questions ({task.questions?.length || 0})</label>
                                        </div>
                                        <button onClick={() => onChange({ ...task, questions: [...(task.questions || []), { ...EMPTY_QUESTION }] })}
                                            className="text-[10px] bg-blue-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-sm flex items-center gap-1">
                                            <FaPlus size={8} /> Add Question
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(task.questions || []).map((q, qi) => (
                                            <QuestionEditor key={qi} question={q} index={qi}
                                                onChange={updated => { const qs = [...task.questions]; qs[qi] = updated; onChange({ ...task, questions: qs }); }}
                                                onRemove={() => { const qs = task.questions.filter((_, i) => i !== qi); onChange({ ...task, questions: qs }); }} />
                                        ))}
                                        {(!task.questions || task.questions.length === 0) && (
                                            <div className="text-center py-6 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold">
                                                No questions added yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Teacher Admin Content ────────────────────────────────────────────────────
function TeacherAdminPageContent() {
    const router = useRouter();
    const [selectedGrade, setSelectedGrade] = useState('grade-1');
    const [selectedSubject, setSelectedSubject] = useState('english');
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuggestions, setSyncSuggestions] = useState(null);

    // Derive grade-scoped subjectId to match the learning zone format
    // e.g. grade-1 + english → english-1, grade-3 + math → math-3
    const getFullSubjectId = useCallback(() => {
        const gradeNum = selectedGrade.replace('grade-', '');
        return `${selectedSubject}-${gradeNum}`;
    }, [selectedGrade, selectedSubject]);

    const handleSyncResearch = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/sync-research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gradeId: selectedGrade, subjectId: selectedSubject }),
            });
            const data = await res.json();
            setSyncSuggestions(data.suggestedLevels);
        } catch (error) {
            alert('Failed to sync research. Please check API settings.');
        } finally {
            setIsSyncing(false);
        }
    };

    const addSuggestedLevel = (suggestion) => {
        const newLevel = {
            ...EMPTY_LEVEL,
            levelId: `${selectedGrade}_${selectedSubject}_${suggestion.levelId}`,
            levelName: suggestion.levelName,
            description: suggestion.description,
            researchContext: suggestion.researchContext,
            tasks: Array.from({ length: suggestion.taskCount }, (_, i) => ({
                ...EMPTY_TASK,
                taskId: `task-${i + 1}`,
                taskName: `Learning Task ${i + 1}`
            }))
        };
        setLevels([...levels, newLevel]);
        setSyncSuggestions(syncSuggestions.filter(s => s.levelId !== suggestion.levelId));
    };

    // Fetch existing levels from Firestore
    const fetchLevels = useCallback(async () => {
        setLoading(true);
        const fullSubjectId = getFullSubjectId();
        try {
            const q = query(
                collection(db, 'levels'),
                where('gradeId', '==', selectedGrade),
                where('subjectId', '==', fullSubjectId)
            );
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ _docId: d.id, ...d.data() }));
            data.sort((a, b) => a.levelId.localeCompare(b.levelId));
            setLevels(data.length > 0 ? data : []);
        } catch (e) {
            console.error('Fetch error:', e);
        }
        setLoading(false);
    }, [selectedGrade, selectedSubject, getFullSubjectId]);

    useEffect(() => { fetchLevels(); }, [fetchLevels]);

    const addLevel = () => {
        const n = levels.length + 1;
        const fullSubjectId = getFullSubjectId();
        setLevels(ls => [...ls, {
            ...EMPTY_LEVEL,
            levelId: `${fullSubjectId}-level-${n}`,
            levelName: `Level ${n}`,
            tasks: [],
        }]);
        setExpandedLevel(levels.length);
    };

    const updateLevel = (index, updated) => {
        setLevels(ls => ls.map((l, i) => i === index ? updated : l));
    };

    const removeLevel = (index) => {
        setLevels(ls => ls.filter((_, i) => i !== index));
    };

    const saveAll = async () => {
        setSaveStatus('saving');
        const fullSubjectId = getFullSubjectId();
        try {
            for (const level of levels) {
                const { _docId, ...data } = level;
                const id = `${selectedGrade}_${fullSubjectId}_${level.levelId}`;
                await setDoc(doc(db, 'levels', id), {
                    ...data,
                    gradeId: selectedGrade,
                    subjectId: fullSubjectId,
                    updatedAt: serverTimestamp(),
                }, { merge: true });
            }
            setSaveStatus('success');
            fetchLevels();
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const deleteLevel = async (level, index) => {
        if (!confirm(`Delete "${level.levelName}"? This cannot be undone.`)) return;
        if (level._docId) {
            await deleteDoc(doc(db, 'levels', level._docId));
        }
        removeLevel(index);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <FaGraduationCap className="text-blue-500 text-xl" />
                    <h1 className="text-xl font-extrabold text-gray-800">Teacher Admin — Curriculum Builder</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as</span>
                        <span className="text-xs font-bold text-slate-600">Educator</span>
                    </div>
                    <button onClick={saveAll}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm text-white transition-all shadow-md ${saveStatus === 'saving' ? 'bg-yellow-500' :
                            saveStatus === 'success' ? 'bg-green-500' :
                                saveStatus === 'error' ? 'bg-red-500' :
                                    'bg-blue-600 hover:bg-blue-700'
                            }`}>
                        <FaSave />
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error!' : 'Save All'}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Selectors */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8">
                    <h2 className="font-extrabold text-gray-700 mb-4 flex items-center gap-2"><FaLayerGroup /> Select Grade & Subject</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Grade</label>
                            <div className="flex flex-wrap gap-2">
                                {GRADES.map(g => (
                                    <button key={g.id} onClick={() => setSelectedGrade(g.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedGrade === g.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Subject</label>
                            <div className="flex flex-wrap gap-2">
                                {SUBJECTS.map(s => (
                                    <button key={s.id} onClick={() => setSelectedSubject(s.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedSubject === s.id ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Levels */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-extrabold text-gray-800 text-lg">
                        Levels for {GRADES.find(g => g.id === selectedGrade)?.name} · {SUBJECTS.find(s => s.id === selectedSubject)?.name}
                        <span className="ml-2 text-sm font-normal text-gray-400">({levels.length} levels)</span>
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handleSyncResearch} disabled={isSyncing}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${isSyncing ? 'bg-slate-200 text-slate-400' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                            <FaSync className={isSyncing ? 'animate-spin' : ''} />
                            {isSyncing ? 'Researching...' : 'Sync from Research'}
                        </button>
                        <button onClick={addLevel}
                            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-colors shadow-md">
                            <FaPlus /> Add Level
                        </button>
                    </div>
                </div>

                {syncSuggestions && syncSuggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-purple-50 border-2 border-purple-200 rounded-[2.5rem] p-6 mb-8 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-purple-900 font-extrabold flex items-center gap-2"><FaLightbulb className="text-amber-500" /> Research-Driven Suggestions</h3>
                            <button onClick={() => setSyncSuggestions(null)} className="text-purple-300 hover:text-purple-600"><FaTimes /></button>
                        </div>
                        <div className="space-y-3">
                            {syncSuggestions.map((suggestion, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-purple-100">
                                    <div>
                                        <div className="font-bold text-purple-800">{suggestion.levelName}</div>
                                        <p className="text-xs text-purple-500">{suggestion.description}</p>
                                        <div className="mt-1 flex gap-2">
                                            <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-50 px-2 py-0.5 rounded-full">{suggestion.difficulty}</span>
                                            <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full">{suggestion.taskType}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => addSuggestedLevel(suggestion)}
                                        className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md">
                                        Add to Curriculum
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-center py-16 text-gray-400 text-lg font-bold">Loading levels...</div>
                ) : levels.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="text-5xl mb-4">📚</div>
                        <p className="text-xl font-bold text-gray-500">No levels yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click &quot;Add Level&quot; to create the curriculum</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {levels.map((level, li) => (
                                <motion.div key={li} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                    {/* Level header */}
                                    <div
                                        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => setExpandedLevel(expandedLevel === li ? null : li)}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{level.badgeEmoji || '⭐'}</span>
                                            <div>
                                                <p className="font-extrabold text-gray-800">{level.levelName || `Level ${li + 1}`}</p>
                                                <p className="text-xs text-gray-400">{level.levelId} · {level.tasks?.length || 0} tasks</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${level.isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {level.isLocked ? '🔒 Locked' : '🔓 Open'}
                                            </span>
                                            <button onClick={e => { e.stopPropagation(); deleteLevel(level, li); }} className="text-red-400 hover:text-red-600 transition-colors p-1"><FaTrash /></button>
                                            {expandedLevel === li ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                                        </div>
                                    </div>

                                    {/* Level body */}
                                    {expandedLevel === li && (
                                        <div className="px-6 pb-6 border-t border-slate-100 space-y-4 pt-4">
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Level ID</label>
                                                    <input value={level.levelId} onChange={e => updateLevel(li, { ...level, levelId: e.target.value })}
                                                        placeholder="level1" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Level Name</label>
                                                    <input value={level.levelName} onChange={e => updateLevel(li, { ...level, levelName: e.target.value })}
                                                        placeholder="The Alphabet" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Module Name</label>
                                                    <input value={level.moduleName || ''} onChange={e => updateLevel(li, { ...level, moduleName: e.target.value })}
                                                        placeholder="Basics" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Badge Emoji</label>
                                                    <input value={level.badgeEmoji} onChange={e => updateLevel(li, { ...level, badgeEmoji: e.target.value })}
                                                        placeholder="⭐" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-2">
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Level Description</label>
                                                    <textarea value={level.description || ''} onChange={e => updateLevel(li, { ...level, description: e.target.value })}
                                                        placeholder="Briefly describe what students will learn..." rows={2}
                                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">XP Reward</label>
                                                        <input type="number" value={level.xpReward || 50} min={0}
                                                            onChange={e => updateLevel(li, { ...level, xpReward: parseInt(e.target.value) || 0 })}
                                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Status</label>
                                                        <button onClick={() => updateLevel(li, { ...level, isLocked: !level.isLocked })}
                                                            className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all ${level.isLocked ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                                                            {level.isLocked ? '🔒 Locked' : '🔓 Open'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tasks */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="font-bold text-gray-700 text-sm">Tasks ({level.tasks?.length || 0})</p>
                                                    <button
                                                        onClick={() => updateLevel(li, { ...level, tasks: [...(level.tasks || []), { ...EMPTY_TASK, taskId: `task_${(level.tasks?.length || 0) + 1}` }] })}
                                                        className="text-xs bg-cyan-500 text-white px-3 py-1.5 rounded-full hover:bg-cyan-600 transition-colors flex items-center gap-1 font-semibold">
                                                        <FaPlus /> Add Task
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {(level.tasks || []).map((task, ti) => (
                                                        <TaskEditor key={ti} task={task} index={ti}
                                                            onChange={updated => { const ts = [...level.tasks]; ts[ti] = updated; updateLevel(li, { ...level, tasks: ts }); }}
                                                            onRemove={() => { const ts = level.tasks.filter((_, i) => i !== ti); updateLevel(li, { ...level, tasks: ts }); }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Export default wrapped with Guard ────────────────────────────────────────
export default function TeacherAdminPage() {
    return (
        <TeacherAdminGuard>
            <TeacherAdminPageContent />
        </TeacherAdminGuard>
    );
}
