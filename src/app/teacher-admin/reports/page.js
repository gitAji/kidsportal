"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, collectionGroup, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { FaChartLine, FaBook, FaLayerGroup, FaGraduationCap, FaSync, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import TeacherAdminGuard from '../TeacherAdminGuard';

import { useTeacher } from '@/context/TeacherContext';

export default function ReportsPage() {
    const { isCurriculumAdmin, assignments } = useTeacher();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        modules: [],
        grades: [],
        levels: [],
        recentActivity: []
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            console.log("Fetching detailed analytics...");

            // 1. Fetch data
            const childrenSnap = await getDocs(collectionGroup(db, 'children'));
            const childrenMap = {};
            childrenSnap.docs.forEach(doc => { childrenMap[doc.id] = doc.data(); });

            const historySnap = await getDocs(collectionGroup(db, 'taskHistory'));
            let historyDocs = historySnap.docs;

            // For testing purposes in development, if no real data exists, provide mocks
            if (historyDocs.length === 0 && process.env.NODE_ENV === 'development') {
                console.log("Teacher Reports: No real taskHistory found, providing mock data for UI verification.");
                const mockDocs = [
                    { data: () => ({ taskId: 'English-1-level-1-quiz', score: 85, subjectId: 'English', completedAt: new Date().toISOString() }), ref: { parent: { parent: { id: 'child-1' } } } },
                    { data: () => ({ taskId: 'Math-2-level-3-exam', score: 92, subjectId: 'Math', completedAt: new Date().toISOString() }), ref: { parent: { parent: { id: 'child-2' } } } },
                    { data: () => ({ taskId: 'Science-grade3-l4', score: 78, subjectId: 'Science', completedAt: new Date().toISOString() }), ref: { parent: { parent: { id: 'child-3' } } } },
                    { data: () => ({ taskId: 'Tamil-1-level-1', score: 95, subjectId: 'Tamil', completedAt: new Date().toISOString() }), ref: { parent: { parent: { id: 'child-1' } } } },
                    { data: () => ({ taskId: 'other-task', score: 60, subjectId: 'unknown_subject', completedAt: new Date().toISOString() }), ref: { parent: { parent: { id: 'child-2' } } } }
                ];
                historyDocs = mockDocs;
            }

            const moduleData = {};
            const gradeData = {};
            const levelData = {};
            const activity = [];

            historyDocs.forEach(doc => {
                const data = doc.data();
                const childId = doc.ref.parent.parent.id;
                const child = childrenMap[childId] || { name: 'Student' };
                const taskId = data.taskId || '';
                const rawSubject = data.subjectId;
                const rawLevel = data.levelId;

                // 1. Extract Module (Subject)
                let module = 'general';
                if (rawSubject && rawSubject !== 'unknown_subject') {
                    module = rawSubject.toLowerCase();
                } else if (taskId.toLowerCase().startsWith('english')) module = 'english';
                else if (taskId.toLowerCase().startsWith('math')) module = 'math';
                else if (taskId.toLowerCase().startsWith('science')) module = 'science';
                else if (taskId.toLowerCase().startsWith('tamil')) module = 'tamil';
                else if (taskId.toLowerCase().startsWith('computerscience')) module = 'computer science';

                // 2. Extract Grade
                let grade = 'Other';
                const gradeMatch = taskId.match(/grade-?(\d+)/i) || (rawLevel || '').match(/grade-?(\d+)/i);
                if (gradeMatch) {
                    grade = `grade-${gradeMatch[1]}`;
                } else {
                    const dashMatch = taskId.match(/^([a-z]+)-(\d+)/i);
                    if (dashMatch) grade = `grade-${dashMatch[2]}`;
                }

                if (grade === 'Other' && child.grade) {
                    grade = `grade-${child.grade}`;
                }

                // 3. Extract Level
                let levelLabel = 'Other';
                const levelMatch = (rawLevel || '').match(/level-?(\d+)/i) || taskId.match(/level-?(\d+)/i);
                if (levelMatch) {
                    levelLabel = `Level ${levelMatch[1]}`;
                }

                // --- ROLE BASED FILTERING ---
                if (!isCurriculumAdmin) {
                    const hasAccess = assignments.some(a =>
                        (a.grade === 'all' || a.grade === grade) &&
                        (a.subject === 'all' || a.subject.toLowerCase() === module.toLowerCase())
                    );
                    if (!hasAccess) return; // Skip this entry if teacher is not assigned to this data
                }

                // Aggregate
                moduleData[module] = (moduleData[module] || 0) + 1;
                gradeData[grade] = (gradeData[grade] || 0) + 1;
                levelData[levelLabel] = (levelData[levelLabel] || 0) + 1;

                activity.push({
                    studentName: child.name || 'Anonymous',
                    studentImage: child.profileImage || child.image,
                    taskName: data.taskName || taskId.split('-').pop()?.replace(/task/, 'Task ') || "Task",
                    score: data.score,
                    completedAt: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : (data.completedAt || new Date().toISOString()),
                    module,
                    grade: grade.replace('grade-', 'Grade '),
                    level: levelLabel
                });
            });

            // Process Data for UI
            const totalCompletions = activity.length;

            const modules = Object.entries(moduleData).map(([name, count]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                count,
                pct: totalCompletions > 0 ? Math.round((count / totalCompletions) * 100) : 0,
                color: name === 'english' ? 'bg-blue-500' : name === 'math' ? 'bg-orange-500' : name === 'science' ? 'bg-purple-500' : 'bg-emerald-500'
            })).sort((a, b) => b.count - a.count);

            const grades = Object.entries(gradeData).map(([name, count]) => ({
                name: name.replace('grade-', 'Grade '),
                count,
                pct: totalCompletions > 0 ? Math.round((count / totalCompletions) * 100) : 0
            })).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

            const levels = Object.entries(levelData).map(([name, count]) => ({
                name,
                count,
                pct: totalCompletions > 0 ? Math.round((count / totalCompletions) * 100) : 0
            })).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

            setStats({
                modules,
                grades: grades.slice(0, 4), // Top 4 grades for the UI grid
                levels,
                recentActivity: activity.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 8)
            });

        } catch (e) {
            console.error("Data Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    }, [isCurriculumAdmin, assignments]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const topStats = [
        { label: "Active Modules", value: stats.modules.length, icon: <FaBook />, color: "from-blue-600 to-blue-400" },
        { label: "Grades Covered", value: stats.grades.length, icon: <FaGraduationCap />, color: "from-emerald-600 to-emerald-400" },
        { label: "Total Levels", value: stats.levels.length, icon: <FaLayerGroup />, color: "from-purple-600 to-purple-400" },
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                            <FaChartLine size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Reports</h1>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] ml-16">Curriculum Analytics & Progress</p>
                </div>

                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:shadow-md transition-all active:scale-95 text-slate-600"
                >
                    <FaSync className={loading ? 'animate-spin text-blue-500' : ''} />
                    {loading ? 'Refreshing...' : 'Sync Data'}
                </button>
            </div>

            {/* Simplified Pillar Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topStats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500`}>
                            {React.cloneElement(s.icon, { size: 100 })}
                        </div>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-2xl shadow-lg mb-6`}>
                            {s.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-slate-800">{loading ? '...' : s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Core Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Module (Subject) Performance */}
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Module Engagement</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Student completions per module</p>
                    </div>
                    <div className="space-y-6">
                        {stats.modules.map((m, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-2 px-1">
                                    <span className="font-black text-slate-700 text-sm">{m.name}</span>
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">{m.count} completions ({m.pct}%)</span>
                                </div>
                                <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${m.pct}%` }}
                                        className={`h-full rounded-full ${m.color} shadow-sm`}
                                    />
                                </div>
                            </div>
                        ))}
                        {stats.modules.length === 0 && !loading && <p className="text-center py-10 text-slate-300 font-bold italic">No module data recorded.</p>}
                    </div>
                </div>

                {/* Grade & Level Columns */}
                <div className="space-y-10">
                    {/* Grades */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <FaGraduationCap className="text-emerald-500" /> Grade Reach
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {stats.grades.map((g, i) => (
                                <div key={i} className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center hover:bg-white hover:shadow-md transition-all">
                                    <span className="text-lg font-black text-slate-800">{g.name}</span>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">{g.count} Task Entries</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Levels */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <FaLayerGroup className="text-purple-500" /> Level Progression
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {stats.levels.map((l, i) => (
                                <div key={i} className="px-5 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center group hover:bg-indigo-600 transition-all">
                                    <span className="text-xs font-black text-indigo-700 group-hover:text-white">{l.name}</span>
                                    <span className="text-[10px] font-bold text-indigo-400 group-hover:text-indigo-200 uppercase">{l.count} Done</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Global Activity Feed</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time student submissions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {stats.recentActivity.map((act, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {act.studentImage ? (
                                        <img src={act.studentImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-black text-slate-300">{act.studentName.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-black text-slate-800 text-sm truncate">{act.studentName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase">{act.module}</span>
                                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">{act.grade}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-black text-slate-800">{act.score !== undefined ? `${act.score}%` : 'Done'}</p>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">{new Date(act.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
