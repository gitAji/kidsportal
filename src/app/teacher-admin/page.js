"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dbData from '../data/db.json';
import {
    collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp, collectionGroup
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGraduationCap, FaLayerGroup, FaTimes, FaImage, FaSync, FaLightbulb,
    FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaClock, FaBookOpen, FaCheckSquare, FaSave,
    FaArrowUp, FaArrowDown, FaCopy, FaMagic, FaEye, FaDatabase, FaBrain, FaScroll
} from 'react-icons/fa';
import TeacherAdminGuard from './TeacherAdminGuard';
import InteractiveLesson from '../components/ui/InteractiveLesson';
import { useTeacher } from '@/context/TeacherContext';

// ── Static metadata ──────────────────────────────────────────────
const ALL_GRADES = Array.from({ length: 10 }, (_, i) => ({ id: `grade-${i + 1}`, name: `Grade ${i + 1}` }));
const ALL_SUBJECTS = [
    { id: 'all', name: 'All Subjects', icon: '🌟', color: 'slate' },
    { id: 'English', name: 'English', icon: '📝', color: 'blue' },
    { id: 'Math', name: 'Mathematics', icon: '🔢', color: 'orange' },
    { id: 'Science', name: 'Science', icon: '🔬', color: 'purple' },
    { id: 'Tamil', name: 'Tamil', icon: '📚', color: 'emerald' },
    { id: 'Computer Science', name: 'Computer Science', icon: '💻', color: 'cyan' },
    { id: 'Coding', name: 'Coding', icon: '⌨️', color: 'violet' },
];


const BADGE_OPTIONS = ['⭐', '🏆', '💎', '🎨', '🚀', '🌈', '🧩', '📚', '🖋️', '🔬', '🔢', '🌍', '🦁', '🍎'];

const EMPTY_QUESTION = {
    questionId: '',
    questionText: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    imageUrl: '',
    points: 10,
};

const EMPTY_TASK = {
    taskId: '',
    taskName: '',
    type: 'lesson',
    timeLimit: 0,
    content: '',
    questions: [],
    videoUrl: '',
    audioUrl: '',
    xpReward: 10,
    aiContext: '',
    difficulty: 'easy'
};

const EMPTY_LEVEL = {
    levelId: '',
    levelName: '',
    moduleName: 'Basics',
    isLocked: false,
    xpReward: 50,
    tasks: [],
    description: '',
    badgeEmoji: '⭐',
    researchContext: '',
    status: 'draft', // draft, pending, approved
    createdBy: '',
};

// ── UI Components ──────────────────────────────────────────────────────────

function BadgePicker({ value, onChange, disabled }) {
    return (
        <div className={`flex flex-wrap gap-1 mt-1 p-2 bg-slate-50 rounded-xl border border-slate-100 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
            {BADGE_OPTIONS.map(emoji => (
                <button
                    key={emoji}
                    disabled={disabled}
                    onClick={() => onChange(emoji)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${value === emoji ? 'bg-blue-500 scale-110 shadow-md' : 'bg-white hover:bg-slate-100'} ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}

// ── Helper functions for stripping bracket labels like [QUIZ 1] ─────────────────
const cleanInput = (str) => {
    if (str === null || str === undefined) return "";
    const s = String(str);
    // Only clean if it follows a pattern and leaves some content, 
    // OR if it's a strictly matched placeholder we want to suggest removing.
    const cleaned = s
        .replace(/^\[.*?\]\s*/i, "")
        .replace(/^(quizz|quiz|exam|lesson)\s*\d+[:\s-]*\s*/i, "")
        .replace(/^option\s*[a-z0-9]+[:\s-]*\s*/i, "")
        .trim();

    // If cleaning wipes everything but the original had content, 
    // maybe it was just a label like "Option 1". We'll return empty 
    // for now as per user request to "not show" them, but we'll 
    // handle the display in the component.
    return cleaned;
};

function QuestionEditor({ question, onChange, onRemove, index, canEdit }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 relative group">
            <div className="flex items-center justify-between">
                <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Question {index + 1}</span>
                {canEdit && <button onClick={onRemove} className="text-red-300 hover:text-red-500 transition-colors"><FaTimes size={12} /></button>}
            </div>
            <div>
                <input
                    disabled={!canEdit}
                    value={cleanInput(question.questionText)}
                    onChange={e => onChange({ ...question, questionText: cleanInput(e.target.value) })}
                    placeholder="Enter question here..."
                    className="w-full border-none bg-white rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Image Link</label>
                    <div className="flex gap-2">
                        <input
                            disabled={!canEdit}
                            value={question.imageUrl || ''}
                            onChange={e => onChange({ ...question, imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="flex-1 border-none bg-white rounded-lg px-3 py-1.5 text-xs shadow-sm disabled:opacity-50"
                        />
                        {canEdit && question.imageUrl && <button onClick={() => onChange({ ...question, imageUrl: '' })} className="text-red-400"><FaTrash size={10} /></button>}
                    </div>
                </div>
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Type</label>
                    <select
                        disabled={!canEdit}
                        value={question.type}
                        onChange={e => onChange({ ...question, type: e.target.value })}
                        className="w-full border-none bg-white rounded-lg px-3 py-1.5 text-xs shadow-sm font-bold disabled:opacity-50"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="identification">Type Translation/Answer</option>
                        <option value="counting">Counting</option>
                        <option value="writing">Tracing/Writing</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Correct Answer</label>
                    <input
                        disabled={!canEdit}
                        value={cleanInput(question.correctAnswer)}
                        onChange={e => onChange({ ...question, correctAnswer: cleanInput(e.target.value) })}
                        className="w-full border-none bg-white rounded-lg px-3 py-1.5 text-xs shadow-sm font-black text-blue-600 disabled:opacity-50"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 block">Points</label>
                    <input
                        disabled={!canEdit}
                        type="number"
                        value={question.points || 10}
                        onChange={e => onChange({ ...question, points: parseInt(e.target.value) || 0 })}
                        className="w-full border-none bg-white rounded-lg px-3 py-1.5 text-xs shadow-sm disabled:opacity-50"
                    />
                </div>
            </div>

            {(question.type === 'multiple-choice' || question.type === 'counting') && (
                <div className="pt-2 border-t border-slate-200/50">
                    <div className="grid grid-cols-2 gap-2">
                        {(question.options || ['', '', '', '']).map((opt, oi) => (
                            <input
                                key={oi}
                                disabled={!canEdit}
                                value={cleanInput(opt)}
                                onChange={e => {
                                    const os = [...(question.options || ['', '', '', ''])];
                                    os[oi] = cleanInput(e.target.value);
                                    onChange({ ...question, options: os });
                                }}
                                placeholder={`Option ${oi + 1}`}
                                className="w-full border-none bg-white rounded-lg px-3 py-1.5 text-xs shadow-sm disabled:opacity-50"
                            />
                        ))}
                    </div>
                    {canEdit && (
                        <div className="flex gap-1 mt-2">
                            {[['A', 'B', 'C', 'D'], ['True', 'False', '', ''], ['Yes', 'No', '', '']].map((preset, pi) => (
                                <button key={pi} onClick={() => onChange({ ...question, options: preset })}
                                    className="text-[8px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded uppercase font-black hover:bg-blue-50 hover:text-blue-500 transition-all">
                                    {preset.filter(x => x).join('/')}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

function TaskEditor({ task, onChange, onRemove, onDuplicate, onMove, onPreview, index, isFirst, isLast, completionCount, canEdit }) {
    const [open, setOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const updateField = (f, v) => onChange({ ...task, [f]: v });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center relative group-task-icon">
                        {canEdit && (
                            <div className="absolute -left-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!isFirst && <button onClick={e => { e.stopPropagation(); onMove('up'); }} className="p-0.5 bg-white shadow-sm rounded border border-slate-100 text-[8px] text-slate-400 hover:text-blue-500"><FaChevronUp /></button>}
                                {!isLast && <button onClick={e => { e.stopPropagation(); onMove('down'); }} className="p-0.5 bg-white shadow-sm rounded border border-slate-100 text-[8px] text-slate-400 hover:text-blue-500"><FaChevronDown /></button>}
                            </div>
                        )}
                        <div className={`text-lg ${task.type === 'lesson' ? 'text-orange-500' : task.type === 'exam' ? 'text-purple-500' : 'text-blue-500'}`}>
                            {task.type === 'lesson' ? <FaBookOpen /> : task.type === 'exam' ? <FaGraduationCap /> : <FaCheckSquare />}
                        </div>
                        <span className="text-[8px] font-black text-slate-400 absolute -bottom-1 bg-white px-1 rounded border border-slate-100">{index + 1}</span>
                    </div>
                    <div>
                        <p className="font-extrabold text-slate-800 text-sm leading-tight">{task.taskName || 'Untitled Task'}</p>
                        <div className="flex gap-2 mt-0.5 items-center">
                            <span className={`text-[8px] font-black uppercase px-2 rounded-full ${task.type === 'lesson' ? 'bg-orange-100 text-orange-600' :
                                task.type === 'exam' ? 'bg-purple-100 text-purple-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>{task.type}</span>
                            <span className="text-[8px] font-mono text-slate-400">{task.taskId}</span>
                            {completionCount > 0 && (
                                <span className="text-[8px] font-black bg-green-100 text-green-600 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                    <FaCheckSquare size={7} /> {completionCount} COMPLETED
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); onPreview(); }} className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg" title="Live Preview"><FaEye size={12} /></button>
                    {canEdit && (
                        <>
                            <button onClick={e => { e.stopPropagation(); onDuplicate(); }} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg" title="Duplicate"><FaCopy size={12} /></button>
                            <button onClick={e => { e.stopPropagation(); onRemove(); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete"><FaTrash size={12} /></button>
                        </>
                    )}
                    <FaChevronDown className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} size={10} />
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-slate-50/50 border-t border-slate-100 overflow-hidden">
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Task Name</label>
                                    <input
                                        disabled={!canEdit}
                                        value={cleanInput(task.taskName)}
                                        onChange={e => {
                                            const n = cleanInput(e.target.value);
                                            const s = n.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                            onChange({ ...task, taskName: n, taskId: s });
                                        }}
                                        className="w-full border-none bg-white rounded-xl px-4 py-2 text-sm font-bold shadow-sm disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Difficulty</label>
                                    <select
                                        disabled={!canEdit}
                                        value={task.difficulty || 'easy'}
                                        onChange={e => updateField('difficulty', e.target.value)}
                                        className="w-full border-none bg-white rounded-xl px-4 py-2 text-sm font-bold shadow-sm disabled:opacity-50"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Task Type</label>
                                    <select
                                        disabled={!canEdit}
                                        value={task.type || 'lesson'}
                                        onChange={e => updateField('type', e.target.value)}
                                        className="w-full border-none bg-white rounded-xl px-4 py-2 text-sm font-bold shadow-sm disabled:opacity-50"
                                    >
                                        <option value="lesson">Lesson</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="exam">Exam</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Time (sec)</label>
                                    <input
                                        disabled={!canEdit}
                                        type="number"
                                        value={task.timeLimit}
                                        onChange={e => updateField('timeLimit', parseInt(e.target.value) || 0)}
                                        className="w-full border-none bg-white rounded-xl px-4 py-2 text-sm font-bold shadow-sm disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">XP Reward</label>
                                    <input
                                        disabled={!canEdit}
                                        type="number"
                                        value={task.xpReward}
                                        onChange={e => updateField('xpReward', parseInt(e.target.value) || 0)}
                                        className="w-full border-none bg-white rounded-xl px-4 py-2 text-sm font-bold shadow-sm disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Lesson Content / Intructions</label>
                                <textarea
                                    disabled={!canEdit}
                                    value={task.content}
                                    onChange={e => updateField('content', e.target.value)}
                                    rows={4}
                                    placeholder="Explain the topic here. Use simple words."
                                    className="w-full border-none bg-white rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm resize-none disabled:opacity-50"
                                />
                            </div>

                            <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[10px] font-black text-indigo-400 uppercase hover:text-indigo-600 flex items-center gap-1">
                                {showAdvanced ? 'Hide Advanced' : 'Show Advanced (Media & AI)'} <FaChevronDown className={showAdvanced ? 'rotate-180' : ''} />
                            </button>

                            {showAdvanced && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        disabled={!canEdit}
                                        value={task.videoUrl || ''}
                                        onChange={e => updateField('videoUrl', e.target.value)}
                                        placeholder="YouTube Embed URL"
                                        className="bg-white px-3 py-2 rounded-xl text-xs border-none disabled:opacity-50"
                                    />
                                    <input
                                        disabled={!canEdit}
                                        value={task.audioUrl || ''}
                                        onChange={e => updateField('audioUrl', e.target.value)}
                                        placeholder="MP3 Audio URL"
                                        className="bg-white px-3 py-2 rounded-xl text-xs border-none disabled:opacity-50"
                                    />
                                    <textarea
                                        disabled={!canEdit}
                                        value={task.aiContext || ''}
                                        onChange={e => updateField('aiContext', e.target.value)}
                                        placeholder="AI Tutor Behavior Instructions (e.g. Speak like a Pirate)"
                                        className="bg-white px-3 py-2 rounded-xl text-xs border-none md:col-span-2 resize-none disabled:opacity-50"
                                    />
                                </motion.div>
                            )}

                            {(task.type === 'quiz' || task.type === 'exam') && (
                                <div className="space-y-4 pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Questions ({task.questions?.length || 0})</h4>
                                        {canEdit && (
                                            <button onClick={() => updateField('questions', [...(task.questions || []), { ...EMPTY_QUESTION, questionId: `q${(task.questions?.length || 0) + 1}` }])}
                                                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-md hover:bg-blue-700 transition-all">+ Add Question</button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(task.questions || []).map((q, qi) => (
                                            <QuestionEditor
                                                key={qi}
                                                question={q}
                                                index={qi}
                                                canEdit={canEdit}
                                                onChange={u => { const qs = [...task.questions]; qs[qi] = u; updateField('questions', qs); }}
                                                onRemove={() => updateField('questions', task.questions.filter((_, i) => i !== qi))}
                                            />
                                        ))}
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

// ── Main Page Content ────────────────────────────────────────────────────────

function TeacherAdminPageContent() {
    const { teacherProfile, isCurriculumAdmin, assignments } = useTeacher();

    const [showAllContents, setShowAllContents] = useState(isCurriculumAdmin || false);

    // Sync admin status to showAllContents
    useEffect(() => {
        if (isCurriculumAdmin) {
            setShowAllContents(true);
        }
    }, [isCurriculumAdmin]);

    // Filter Grades based on assignments
    const GRADES = showAllContents ? ALL_GRADES : ALL_GRADES.filter(g =>
        assignments.some(a => a.grade === 'all' || a.grade === g.id)
    );

    const [selectedGrade, setSelectedGrade] = useState(null);

    // Dynamic SUBJECTS based on selected grade
    const getAvailableSubjects = useCallback((gradeId) => {
        if (!gradeId) return [];

        // Filter out 'all' subject for selection UI
        const baseSubjects = ALL_SUBJECTS.filter(s => s.id !== 'all');

        if (showAllContents || isCurriculumAdmin) return baseSubjects;

        const availableSubIds = assignments
            .filter(a => a.grade === 'all' || a.grade === gradeId)
            .map(a => a.subject);

        if (availableSubIds.includes('all')) return baseSubjects;
        return baseSubjects.filter(s => availableSubIds.includes(s.id));
    }, [assignments, showAllContents, isCurriculumAdmin]);

    const AVAILABLE_SUBJECTS = getAvailableSubjects(selectedGrade);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Initial selections if not set - ONLY if there is exactly one choice
    useEffect(() => {
        if (!selectedGrade && GRADES.length === 1) {
            setSelectedGrade(GRADES[0].id);
        }
    }, [GRADES, selectedGrade]);

    useEffect(() => {
        const subjects = getAvailableSubjects(selectedGrade);
        if (selectedGrade && subjects.length === 1 && (!selectedSubject || !subjects.find(s => s.id === selectedSubject))) {
            setSelectedSubject(subjects[0].id);
        }
    }, [selectedGrade, selectedSubject, assignments, getAvailableSubjects]);

    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewTask, setPreviewTask] = useState(null);
    const [copilotData, setCopilotData] = useState(null);
    const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' or 'insights'
    const [completionStats, setCompletionStats] = useState({
        totalCompletions: 0,
        averageScore: 0,
        taskBreakdown: {}
    });

    const isAssigned = useCallback((gradeId, subjectId) => {
        if (!gradeId || !subjectId) return false;
        const g = gradeId.toLowerCase();
        const s = subjectId.toLowerCase();
        return assignments.some(a => {
            const assignmentGrade = (a.grade || '').toLowerCase();
            const assignmentSubject = (a.subject || '').toLowerCase();
            return (assignmentGrade === 'all' || assignmentGrade === g) &&
                (assignmentSubject === 'all' || assignmentSubject === s);
        });
    }, [assignments]);

    // Moderation Helper: Can this specific user edit this specific item?
    const canManageItem = useCallback((item) => {
        if (isCurriculumAdmin) return true; // Admins can moderate everything
        if (!item) return false;

        // Regular teachers can only edit their own content
        const isOwner = item.createdBy === teacherProfile?.email;
        const isLegacy = !item.createdBy; // Content with no owner is manageable by assigned teachers

        return isOwner || (isLegacy && isAssigned(selectedGrade, selectedSubject));
    }, [isCurriculumAdmin, teacherProfile?.email, isAssigned, selectedGrade, selectedSubject]);

    const canEdit = isCurriculumAdmin || isAssigned(selectedGrade, selectedSubject);

    // Logging for troubleshooting permissions
    useEffect(() => {
        if (selectedGrade && selectedSubject) {
            console.log(`Teacher Permissions Check:
                Grade: ${selectedGrade}
                Subject: ${selectedSubject}
                isCurriculumAdmin: ${isCurriculumAdmin}
                isAssigned: ${isAssigned(selectedGrade, selectedSubject)}
                Final canEdit: ${canEdit}`);
        }
    }, [selectedGrade, selectedSubject, isCurriculumAdmin, isAssigned, canEdit]);

    const getFullSubjectId = useCallback(() => {
        if (!selectedGrade || !selectedSubject) return '';
        // Use lowercase, no spaces, for consistency with db.json subjectIds
        // (e.g. "Computer Science" -> "computerscience", matching computerscience-1 etc.)
        return `${selectedSubject.toLowerCase().replace(/\s+/g, '')}-${selectedGrade.replace('grade-', '')}`;
    }, [selectedGrade, selectedSubject]);

    const refreshLevels = useCallback(async () => {
        if (!selectedGrade || !selectedSubject) return;
        setLoading(true);
        const fullSubjectId = getFullSubjectId();
        try {
            const qRef = collection(db, 'levels');
            const snap = await getDocs(query(qRef, where('gradeId', '==', selectedGrade), where('subjectId', '==', fullSubjectId)));
            let data = snap.docs.map(doc => ({ ...doc.data(), _docId: doc.id }));

            // If No Firestore data, optionally show local db.json as starting point
            if (data.length === 0) {
                const gData = dbData.grades.find(g => g.gradeId === selectedGrade);
                const sub = gData?.subjects?.find(s => s.subjectId === fullSubjectId);
                if (sub?.levels) data = sub.levels;
            }

            setLevels(data.sort((a, b) => {
                const numA = parseInt(a.levelId?.split('-').pop()) || 0;
                const numB = parseInt(b.levelId?.split('-').pop()) || 0;
                return numA - numB;
            }));
        } catch (e) {
            console.error("Firestore sync failed, falling back to local:", e);
            // Fallback to local data on permission error or network failure
            const gData = dbData.grades.find(g => g.gradeId === selectedGrade);
            const sub = gData?.subjects?.find(s => s.subjectId === fullSubjectId);
            if (sub?.levels) {
                setLevels(sub.levels.sort((a, b) => {
                    const numA = parseInt(a.levelId?.split('-').pop()) || 0;
                    const numB = parseInt(b.levelId?.split('-').pop()) || 0;
                    return numA - numB;
                }));
            }
        } finally {
            setLoading(false);
        }
    }, [selectedGrade, selectedSubject, getFullSubjectId]);

    useEffect(() => { refreshLevels(); }, [refreshLevels]);

    const fetchCopilotInsights = useCallback(async () => {
        if (!selectedGrade || !selectedSubject || copilotData) return;
        setLoading(true);
        try {
            const res = await fetch('/api/sync-research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gradeId: selectedGrade, subjectId: selectedSubject })
            });
            const data = await res.json();
            setCopilotData(data.suggestedLevels);
        } catch (e) {
            console.error("Copilot Sync Failed", e);
        } finally {
            setLoading(false);
        }
    }, [selectedGrade, selectedSubject, copilotData]);

    useEffect(() => {
        if (activeTab === 'insights' && !copilotData && !loading) {
            fetchCopilotInsights();
        }
    }, [activeTab, copilotData, loading, fetchCopilotInsights]);

    const fetchCompletionStats = useCallback(async () => {
        if (!selectedGrade || !selectedSubject) return;
        try {
            const fullSubjectId = getFullSubjectId();
            // Fetch real task history to show progress in curriculum builder
            const historySnap = await getDocs(collectionGroup(db, 'taskHistory'));
            let count = 0;
            let totalS = 0;
            const breakdown = {};

            let historyDocs = historySnap.docs;
            if (historyDocs.length === 0 && process.env.NODE_ENV === 'development') {
                const gNum = selectedGrade.split('-').pop();
                historyDocs = [
                    { data: () => ({ taskId: `${selectedSubject.toLowerCase()}-${gNum}-level-1-quiz`, score: 95, subjectId: 'unknown_subject' }) },
                    { data: () => ({ taskId: `${selectedSubject.toLowerCase()}-${gNum}-level-1-lesson`, score: 100, subjectId: 'unknown_subject' }) },
                    { data: () => ({ taskId: `${selectedSubject.toLowerCase()}-${gNum}-level-2-quiz`, score: 85, subjectId: 'unknown_subject' }) }
                ];
            }

            historyDocs.forEach(doc => {
                const data = doc.data();
                const taskId = data.taskId || '';
                const rawSubject = data.subjectId;

                // Identify Subject/Module
                let module = '';
                if (rawSubject && rawSubject !== 'unknown_subject') {
                    module = rawSubject.toLowerCase();
                } else if (taskId.startsWith('english')) module = 'english';
                else if (taskId.startsWith('math')) module = 'math';
                else if (taskId.startsWith('science')) module = 'science';
                else if (taskId.startsWith('tamil')) module = 'tamil';

                // Identify Grade
                const gradeMatch = taskId.match(/grade-?(\d+)/i) || (data.levelId || '').match(/grade-?(\d+)/i);
                const grade = gradeMatch ? `grade-${gradeMatch[1]}` : '';

                if (module === selectedSubject.toLowerCase().replace(/\s+/g, '') && grade === selectedGrade) {
                    count++;
                    totalS += parseFloat(data.score) || 0;
                    breakdown[taskId] = (breakdown[taskId] || 0) + 1;
                }
            });

            setCompletionStats({
                totalCompletions: count,
                averageScore: count > 0 ? Math.round(totalS / count) : 0,
                taskBreakdown: breakdown
            });
        } catch (e) {
            console.error("Failed to fetch completion stats:", e);
        }
    }, [selectedGrade, selectedSubject, getFullSubjectId]);

    useEffect(() => {
        if (selectedGrade && selectedSubject) {
            setCopilotData(null);
            setLevels([]);
            setActiveTab('curriculum');
            refreshLevels();
            fetchCompletionStats();
        }
    }, [selectedGrade, selectedSubject, refreshLevels, fetchCompletionStats]);

    useEffect(() => {
        if (selectedGrade && selectedSubject && !copilotData) {
            fetchCopilotInsights();
        }
    }, [selectedGrade, selectedSubject, copilotData]);

    const saveAll = async () => {
        setSaveStatus('saving');
        const fullSubjectId = getFullSubjectId();
        const { writeBatch } = await import('firebase/firestore');
        const batch = writeBatch(db);

        try {
            console.log(`[Save] Processing ${levels.length} levels for ${selectedGrade} ${fullSubjectId}...`);

            // 1. Update the subject-level metadata
            const subjectRef = doc(db, 'subjects', fullSubjectId);
            batch.set(subjectRef, {
                id: fullSubjectId,
                gradeId: selectedGrade,
                subjectName: selectedSubject,
                updatedAt: serverTimestamp(),
                managedBy: teacherProfile?.email || 'admin'
            }, { merge: true });

            // 2. Queue all levels for saving
            for (const level of levels) {
                const { _docId, ...data } = level;
                // Compound ID to ensure uniqueness across grades/subjects
                const docId = `${selectedGrade}_${fullSubjectId}_${level.levelId}`;
                const levelRef = doc(db, 'levels', docId);

                batch.set(levelRef, {
                    ...data,
                    gradeId: selectedGrade,
                    subjectId: fullSubjectId,
                    updatedAt: serverTimestamp(),
                    createdBy: data.createdBy || teacherProfile?.email || 'admin',
                    status: data.status || 'approved'
                }, { merge: true });
            }

            await batch.commit();
            console.log("[Save] Batch commit successful.");
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
            refreshLevels();
        } catch (e) {
            console.error("[Save] Critical Batch Error:", e);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
        }
    };

    const updateLevel = (index, updated) => setLevels(ls => ls.map((l, i) => i === index ? updated : l));

    const moveLevel = (index, dir) => {
        const newLevels = [...levels];
        const target = dir === 'up' ? index - 1 : index + 1;
        [newLevels[index], newLevels[target]] = [newLevels[target], newLevels[index]];
        setLevels(newLevels);
        setExpandedLevel(target);
    };

    const addLevel = () => {
        const id = `${getFullSubjectId()}-level-${levels.length + 1}`;
        const newIdx = levels.length;
        setLevels([...levels, {
            ...EMPTY_LEVEL,
            levelId: id,
            levelName: `Level ${levels.length + 1}`,
            createdBy: teacherProfile?.email,
            status: isCurriculumAdmin ? 'approved' : 'pending'
        }]);
        setExpandedLevel(newIdx);

        // Take user to form
        setTimeout(() => {
            const el = document.getElementById(`level-card-${newIdx}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const seedFromLocal = () => {
        if (!confirm("This will overwrite current edits with data from local db.json. Proceed?")) return;
        const fullSubjectId = getFullSubjectId();
        const gData = dbData.grades.find(g => g.gradeId === selectedGrade);
        const sub = gData?.subjects?.find(s => s.subjectId === fullSubjectId);
        if (sub?.levels) {
            setLevels(sub.levels);
            alert("Local data loaded! Click 'Save All Changes' to sync to Firebase.");
        } else {
            alert("No data found in local db.json for this subject/grade.");
        }
    };

    const duplicateLevel = (level, index) => {
        const newLevel = JSON.parse(JSON.stringify(level));
        delete newLevel._docId;
        newLevel.levelId += '_copy';
        newLevel.levelName += ' (Copy)';
        const newLevels = [...levels];
        newLevels.splice(index + 1, 0, newLevel);
        setLevels(newLevels);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header Dashboard Navigation */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/80">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><FaGraduationCap size={20} /></div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Teacher Admin</h1>
                            {isCurriculumAdmin && (
                                <span className="bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-600/20">
                                    Curriculum Moderator
                                </span>
                            )}
                        </div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                            <button onClick={() => { setSelectedGrade(null); setSelectedSubject(null); }} className="hover:text-blue-600 transition-colors">Select Grade</button>
                            {selectedGrade && (
                                <>
                                    <span>/</span>
                                    <button onClick={() => setSelectedSubject(null)} className="hover:text-blue-600 transition-colors">{GRADES.find(g => g.id === selectedGrade)?.name}</button>
                                </>
                            )}
                            {selectedSubject && (
                                <>
                                    <span>/</span>
                                    <span className="text-slate-700">{ALL_SUBJECTS.find(s => s.id === selectedSubject)?.name}</span>
                                </>
                            )}
                        </nav>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isCurriculumAdmin && (
                        <button
                            onClick={() => setShowAllContents(!showAllContents)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${showAllContents ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
                            title={showAllContents ? "Switch to My Assignments" : "View All Curriculum"}
                        >
                            <FaLayerGroup /> {showAllContents ? "Showing All" : "View All"}
                        </button>
                    )}

                    {selectedGrade && selectedSubject && (
                        <button
                            onClick={saveAll}
                            disabled={!canEdit || saveStatus === 'saving'}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs text-white uppercase shadow-lg transition-all ${!canEdit ? 'bg-slate-300 cursor-not-allowed grayscale' : saveStatus === 'success' ? 'bg-green-500' : saveStatus === 'error' ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {saveStatus === 'saving' ? <FaSync className="animate-spin" /> : <FaSave />}
                            {!canEdit ? 'Read Only' : saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Synced!' : 'Save All Changes'}
                        </button>
                    )}
                </div>
            </div>

            <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-10">
                {/* 1. Grade Selection */}
                {!selectedGrade && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-slate-800">
                                {showAllContents ? "All Grade Levels" : "Your Assigned Grades"}
                            </h2>
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">
                                {showAllContents ? "Browse all curriculum content across the platform" : "Pick a class to manage its curriculum"}
                            </p>
                            {!showAllContents && GRADES.length === 0 && (
                                <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 max-w-md mx-auto">
                                    <p className="text-amber-800 text-sm font-bold">You aren't assigned to any grades yet.</p>
                                    {isCurriculumAdmin ? (
                                        <button onClick={() => setShowAllContents(true)} className="mt-3 text-amber-600 font-black text-xs uppercase underline">Browse all curriculum instead</button>
                                    ) : (
                                        <p className="text-slate-500 text-[10px] mt-2 font-medium">Please contact a Super Admin to assign your classes.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {GRADES.map(grade => (
                                <button key={grade.id} onClick={() => setSelectedGrade(grade.id)} className="aspect-[4/5] bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all flex flex-col items-center justify-center group">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl mb-6 flex items-center justify-center text-4xl group-hover:bg-blue-500 group-hover:rotate-6 transition-all">🏫</div>
                                    <span className="font-black text-slate-700 uppercase tracking-widest text-[11px] text-center">{grade.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 2. Subject Selection */}
                {selectedGrade && !selectedSubject && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-800">Assign Subject for {GRADES.find(g => g.id === selectedGrade)?.name}</h2>
                            <button onClick={() => setSelectedGrade(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200">Back</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {AVAILABLE_SUBJECTS.map(sub => (
                                <button key={sub.id} onClick={() => setSelectedSubject(sub.id)} className={`bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:border-${sub.color}-400 hover:shadow-xl transition-all flex flex-col items-center gap-4 group text-center`}>
                                    <span className="text-5xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                                    <div>
                                        <span className={`block font-black text-slate-800 uppercase tracking-widest text-xs`}>{sub.name}</span>
                                        <span className="text-[9px] text-slate-400 font-bold">Manage Content</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 3. Level Editor */}
                {selectedGrade && selectedSubject && (
                    <div className="space-y-8">
                        {/* Editor Action Bar & Tabs */}
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                        <span className="text-3xl">{ALL_SUBJECTS.find(s => s.id === selectedSubject)?.icon}</span>
                                        {ALL_SUBJECTS.find(s => s.id === selectedSubject)?.name}
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{GRADES.find(g => g.id === selectedGrade)?.name} · Teacher Dashboard</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={seedFromLocal}
                                        disabled={!canEdit}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all border ${!canEdit ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                                    >
                                        <FaDatabase /> Local Seed
                                    </button>
                                    <button onClick={addLevel} disabled={!canEdit} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg transition-all ${!canEdit ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-green-500 text-white shadow-green-100 hover:bg-green-600'}`}>
                                        <FaPlus /> Custom Level
                                    </button>
                                </div>
                            </div>

                            {!canEdit && (
                                <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm">
                                        <FaEye />
                                    </div>
                                    <p className="text-indigo-900 text-xs font-bold font-outfit uppercase tracking-tight">
                                        REFERENCE MODE: Viewing curriculum for <span className="text-indigo-600">{ALL_SUBJECTS.find(s => s.id === selectedSubject)?.name} - {GRADES.find(g => g.id === selectedGrade)?.name}</span>.
                                        You can browse but cannot save changes as this is not an assigned subject.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-2xl w-fit">
                                <button onClick={() => setActiveTab('curriculum')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ${activeTab === 'curriculum' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <FaLayerGroup /> Curriculum Builder
                                </button>
                                <button onClick={() => setActiveTab('insights')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ${activeTab === 'insights' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <FaBrain /> Syllabus Insights
                                </button>
                            </div>
                        </div>

                        {/* 3a. Insights Tab */}
                        {activeTab === 'insights' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
                                            <FaBrain className="text-4xl mb-4 opacity-50" />
                                            <h3 className="text-xl font-black mb-2">NotebookLM Copilot</h3>
                                            <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">Research-backed recommendations for this specific grade and subject.</p>
                                            <button onClick={() => { setCopilotData(null); fetchCopilotInsights(); }} className="w-full py-3 bg-white/20 backdrop-blur-md rounded-2xl font-black text-[10px] uppercase hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                                                <FaSync /> Refresh Research
                                            </button>
                                        </div>
                                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Discovery Source</h4>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm">📎</div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-700">Syllabus PDF</p>
                                                    <p className="text-[9px] font-bold text-slate-400">NotebookLM Research</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        {loading && !copilotData ? (
                                            <div className="bg-white rounded-[2.5rem] p-20 border border-slate-200 flex flex-col items-center gap-4 text-center">
                                                <FaBrain className="text-5xl text-indigo-100 animate-pulse" />
                                                <p className="font-black text-slate-300 uppercase text-[10px] tracking-widest">Analyzing Research Data...</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(copilotData || []).map((suggestion, si) => (
                                                    <motion.div
                                                        key={si}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: si * 0.05 }}
                                                        className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group cursor-pointer"
                                                        onClick={() => {
                                                            if (!canEdit) {
                                                                alert("You do not have permission to edit this curriculum.");
                                                                return;
                                                            }
                                                            setLevels([...levels, {
                                                                ...EMPTY_LEVEL,
                                                                levelId: suggestion.levelId,
                                                                levelName: suggestion.levelName,
                                                                description: suggestion.description,
                                                                researchContext: suggestion.researchContext,
                                                                tasks: Array.from({ length: suggestion.taskCount }, (_, i) => ({
                                                                    ...EMPTY_TASK,
                                                                    taskId: `${suggestion.levelId}-task-${i + 1}`,
                                                                    taskName: `AI Task: ${suggestion.levelName} ${i + 1}`,
                                                                    type: suggestion.taskType
                                                                }))
                                                            }]);
                                                            alert(`Added level ${suggestion.levelName} to curriculum!`);
                                                            setActiveTab('curriculum');
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${suggestion.difficulty === 'Advanced' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>{suggestion.difficulty}</span>
                                                            <button className="text-indigo-400 group-hover:scale-125 transition-all"><FaPlus /></button>
                                                        </div>
                                                        <h4 className="font-black text-slate-800 text-lg mb-2">{suggestion.levelName}</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{suggestion.description}</p>
                                                        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                                                                <FaCheckSquare className="text-indigo-400" /> {suggestion.taskCount} Tasks
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                                                                <FaMagic className="text-purple-400" /> {suggestion.taskType}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3b. Curriculum Builder Tab */}
                        {activeTab === 'curriculum' && (
                            <div className="space-y-8">
                                {/* Insights Banner for Curriculum Builder */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 text-xl"><FaCheckSquare /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Completions</p>
                                            <p className="text-xl font-black text-slate-800">{completionStats.totalCompletions}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-xl"><FaBrain /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Score</p>
                                            <p className="text-xl font-black text-slate-800">{completionStats.averageScore}%</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 text-xl"><FaLayerGroup /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published Levels</p>
                                            <p className="text-xl font-black text-slate-800">{levels.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Search & Stats */}
                                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Search</span>
                                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search levels or topics..." className="bg-transparent border-none text-sm font-bold w-full focus:ring-0" />
                                        </div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{levels.length} Levels Total</div>
                                    </div>

                                    {loading ? (
                                        <div className="p-20 text-center flex flex-col items-center gap-4">
                                            <FaSync className="animate-spin text-4xl text-blue-200" />
                                            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Fetching Content...</p>
                                        </div>
                                    ) : levels.length === 0 ? (
                                        <div className="p-20 text-center space-y-4">
                                            <div className="text-6xl grayscale opacity-30">📚</div>
                                            <h3 className="text-xl font-black text-slate-400">No content found</h3>
                                            <button onClick={addLevel} className="text-blue-500 font-bold text-sm underline hover:text-blue-700">Add your first level now</button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {levels.filter(l => (l.levelName || '').toLowerCase().includes(searchQuery.toLowerCase())).map((level, displayIdx) => {
                                                const actualIdx = levels.indexOf(level);
                                                const isExpanded = expandedLevel === actualIdx;
                                                return (
                                                    <div key={actualIdx} id={`level-card-${actualIdx}`} className={`transition-all ${isExpanded ? 'bg-blue-50/20 shadow-inner' : ''}`}>
                                                        {/* Collapsed View Header */}
                                                        <div className="px-8 py-6 flex items-center justify-between group cursor-pointer" onClick={() => setExpandedLevel(isExpanded ? null : actualIdx)}>
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                                                                    {level.badgeEmoji || '⭐'}
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-black text-slate-800 leading-none mb-1">{level.levelName}</h3>
                                                                    <div className="flex gap-2">
                                                                        <span className="text-[9px] font-black uppercase text-slate-400">{level.levelId}</span>
                                                                        <span className="text-[9px] font-black uppercase text-blue-400 bg-blue-50 px-2 rounded-full">{level.tasks?.length || 0} Tasks</span>
                                                                        <span className={`text-[9px] font-black uppercase px-2 rounded-full ${level.isLocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>{level.isLocked ? 'Locked' : 'Open'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-2 mr-2">
                                                                    {level.createdBy && (
                                                                        <span className="text-[7px] font-black text-slate-300 uppercase px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100" title={`Created by ${level.createdBy}`}>
                                                                            By {level.createdBy.split('@')[0]}
                                                                        </span>
                                                                    )}
                                                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${level.status === 'approved' ? 'bg-green-100 text-green-600 border border-green-200' :
                                                                        level.status === 'pending' ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                                                            'bg-slate-100 text-slate-500 border border-slate-200'
                                                                        }`}>
                                                                        {level.status || 'draft'}
                                                                    </span>
                                                                </div>
                                                                {canManageItem(level) && (
                                                                    <>
                                                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            {actualIdx > 0 && <button onClick={e => { e.stopPropagation(); moveLevel(actualIdx, 'up'); }} className="p-1 hover:text-blue-500"><FaArrowUp size={10} /></button>}
                                                                            {actualIdx < levels.length - 1 && <button onClick={e => { e.stopPropagation(); moveLevel(actualIdx, 'down'); }} className="p-1 hover:text-blue-500"><FaArrowDown size={10} /></button>}
                                                                        </div>
                                                                        <button onClick={e => { e.stopPropagation(); duplicateLevel(level, actualIdx); }} className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><FaCopy size={14} /></button>
                                                                        <button onClick={e => { e.stopPropagation(); if (confirm('Delete Level?')) setLevels(ls => ls.filter((_, i) => i !== actualIdx)); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><FaTrash size={14} /></button>
                                                                    </>
                                                                )}
                                                                <FaChevronDown className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={12} />
                                                            </div>
                                                        </div>

                                                        {/* Expanded Content */}
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                                    <div className="px-8 pb-10 space-y-8">
                                                                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 space-y-6">
                                                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                                                <div className="col-span-1">
                                                                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Level Details</label>
                                                                                    <input
                                                                                        disabled={!canManageItem(level)}
                                                                                        value={level.levelName}
                                                                                        onChange={e => updateLevel(actualIdx, { ...level, levelName: e.target.value })}
                                                                                        placeholder="Level Name"
                                                                                        className="w-full border-none bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                                                                                    />
                                                                                </div>
                                                                                <div className="col-span-1">
                                                                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Module / Chapter</label>
                                                                                    <select
                                                                                        disabled={!canManageItem(level)}
                                                                                        value={level.moduleName}
                                                                                        onChange={e => updateLevel(actualIdx, { ...level, moduleName: e.target.value })}
                                                                                        className="w-full border-none bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50"
                                                                                    >
                                                                                        <option>Basics</option>
                                                                                        <option>Intermediate</option>
                                                                                        <option>Advanced</option>
                                                                                        <option>Exam Prep</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div className="col-span-1 lg:col-span-2">
                                                                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Badge Selection</label>
                                                                                    <BadgePicker disabled={!canManageItem(level)} value={level.badgeEmoji} onChange={e => updateLevel(actualIdx, { ...level, badgeEmoji: e })} />
                                                                                </div>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                <textarea
                                                                                    disabled={!canManageItem(level)}
                                                                                    value={level.description}
                                                                                    onChange={e => updateLevel(actualIdx, { ...level, description: e.target.value })}
                                                                                    placeholder="Student-facing description..."
                                                                                    rows={3}
                                                                                    className="w-full border-none bg-slate-50 rounded-2xl px-4 py-3 text-sm resize-none disabled:opacity-50"
                                                                                />
                                                                                <textarea
                                                                                    disabled={!canManageItem(level)}
                                                                                    value={level.researchContext}
                                                                                    onChange={e => updateLevel(actualIdx, { ...level, researchContext: e.target.value })}
                                                                                    placeholder="Teacher notes/Research facts..."
                                                                                    rows={3}
                                                                                    className="w-full border-none bg-slate-50 rounded-2xl px-4 py-3 text-xs font-mono text-slate-500 resize-none disabled:opacity-50"
                                                                                />
                                                                            </div>

                                                                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                                                <div className="flex gap-4">
                                                                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                                                                        <span className="text-[10px] font-black text-slate-400 uppercase">XP</span>
                                                                                        <input
                                                                                            disabled={!canManageItem(level)}
                                                                                            type="number"
                                                                                            value={level.xpReward}
                                                                                            onChange={e => updateLevel(actualIdx, { ...level, xpReward: parseInt(e.target.value) || 0 })}
                                                                                            className="bg-transparent border-none text-sm font-black w-12 disabled:opacity-50"
                                                                                        />
                                                                                    </div>
                                                                                    {isCurriculumAdmin && (
                                                                                        <div className="flex items-center gap-2 ml-auto">
                                                                                            <span className="text-[10px] font-black text-slate-400 uppercase mr-2">Status</span>
                                                                                            <select
                                                                                                value={level.status || 'pending'}
                                                                                                onChange={e => updateLevel(actualIdx, { ...level, status: e.target.value })}
                                                                                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-indigo-600 shadow-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                                                                            >
                                                                                                <option value="draft">Draft</option>
                                                                                                <option value="pending">Needs Review</option>
                                                                                                <option value="approved">Approved & Live</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    )}
                                                                                    <button
                                                                                        disabled={!canManageItem(level)}
                                                                                        onClick={() => updateLevel(actualIdx, { ...level, isLocked: !level.isLocked })}
                                                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${level.isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} disabled:opacity-50`}
                                                                                    >
                                                                                        {level.isLocked ? '🔒 Locked' : '🔓 Unlocked'}
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            {/* Tasks Section */}
                                                                            <div className="space-y-4">
                                                                                <div className="flex items-center justify-between">
                                                                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tasks & Resources</h4>
                                                                                    {canManageItem(level) && (
                                                                                        <div className="flex gap-2">
                                                                                            <button onClick={() => updateLevel(actualIdx, { ...level, tasks: [...(level.tasks || []), { ...EMPTY_TASK, type: 'lesson', taskName: 'New Lesson' }] })} className="px-4 py-2 rounded-xl bg-orange-500 text-white font-black text-[10px] uppercase shadow-lg shadow-orange-100">+ Lesson</button>
                                                                                            <button onClick={() => updateLevel(actualIdx, { ...level, tasks: [...(level.tasks || []), { ...EMPTY_TASK, type: 'quiz', taskName: 'New Quiz', questions: [{ ...EMPTY_QUESTION, questionId: 'q1' }] }] })} className="px-4 py-2 rounded-xl bg-blue-500 text-white font-black text-[10px] uppercase shadow-lg shadow-blue-100">+ Quiz</button>
                                                                                            <button onClick={() => updateLevel(actualIdx, { ...level, tasks: [...(level.tasks || []), { ...EMPTY_TASK, type: 'exam', taskName: 'Final Exam', timeLimit: 300, questions: [{ ...EMPTY_QUESTION, questionId: 'q1' }] }] })} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-black text-[10px] uppercase shadow-lg shadow-purple-100">+ Exam</button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="space-y-3">
                                                                                    {(level.tasks || []).map((t, ti) => (
                                                                                        <TaskEditor
                                                                                            key={ti}
                                                                                            task={t}
                                                                                            index={ti}
                                                                                            isFirst={ti === 0}
                                                                                            isLast={ti === level.tasks.length - 1}
                                                                                            onMove={(dir) => {
                                                                                                const ts = [...level.tasks];
                                                                                                const target = dir === 'up' ? ti - 1 : ti + 1;
                                                                                                [ts[ti], ts[target]] = [ts[target], ts[ti]];
                                                                                                updateLevel(actualIdx, { ...level, tasks: ts });
                                                                                            }}
                                                                                            onChange={u => { const ts = [...level.tasks]; ts[ti] = u; updateLevel(actualIdx, { ...level, tasks: ts }); }}
                                                                                            onRemove={() => updateLevel(actualIdx, { ...level, tasks: level.tasks.filter((_, i) => i !== ti) })}
                                                                                            onPreview={() => setPreviewTask(t)}
                                                                                            completionCount={completionStats.taskBreakdown[t.taskId] || 0}
                                                                                            canEdit={canManageItem(level)}
                                                                                            onDuplicate={() => {
                                                                                                const ts = [...level.tasks];
                                                                                                const c = JSON.parse(JSON.stringify(t));
                                                                                                c.taskId += `_copy_${Math.floor(Math.random() * 100)}`;
                                                                                                c.taskName += ' (Copy)';
                                                                                                ts.splice(ti + 1, 0, c);
                                                                                                updateLevel(actualIdx, { ...level, tasks: ts });
                                                                                            }}
                                                                                        />
                                                                                    ))}
                                                                                    {(!level.tasks || level.tasks.length === 0) && (
                                                                                        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 font-bold text-sm">Add lessons or quiz elements to this level</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}

                                            {/* Final Exams & Special Assessments Section */}
                                            <div className="bg-slate-50/50 p-8 border-t-2 border-dashed border-slate-200">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><FaScroll className="text-purple-500" /> Final Exams & Assessments</h3>
                                                        <p className="text-[11px] font-bold text-slate-400">Add comprehensive exams for this subject here.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (!canEdit) return;
                                                            const finalLevelId = `${getFullSubjectId()}-final-assessment`;
                                                            if (levels.find(l => l.levelId === finalLevelId)) {
                                                                alert("Final Assessment Level already exists.");
                                                                return;
                                                            }
                                                            setLevels([...levels, {
                                                                ...EMPTY_LEVEL,
                                                                levelId: finalLevelId,
                                                                levelName: "Final Course Assessment",
                                                                moduleName: "Exam Prep",
                                                                badgeEmoji: "🏆",
                                                                tasks: [{ ...EMPTY_TASK, type: 'exam', taskName: 'Grand Final Exam', timeLimit: 600 }]
                                                            }]);
                                                        }}
                                                        disabled={!canEdit}
                                                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all ${!canEdit ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-purple-600 text-white shadow-purple-200 hover:scale-105 focus:ring-4 focus:ring-purple-200'}`}
                                                    >
                                                        + Create Final Exam Module
                                                    </button>
                                                </div>

                                                {/* Show existing exams if any aren't already visible in levels */}
                                                {levels.filter(l => l.moduleName === 'Exam Prep').length === 0 && (
                                                    <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                                                        <div className="text-4xl mb-3 opacity-20">📝</div>
                                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No dedicated exam modules created yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewTask && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative">
                            <button onClick={() => setPreviewTask(null)} className="absolute top-8 right-8 z-[110] w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg border border-white/30"><FaTimes size={20} /></button>
                            <div className="flex-1 overflow-y-auto">
                                <InteractiveLesson taskData={previewTask} onComplete={() => { alert("Lesson Finished (Preview Mode)"); setPreviewTask(null); }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default function TeacherAdminPage() {
    return (
        <TeacherAdminPageContent />
    );
}
