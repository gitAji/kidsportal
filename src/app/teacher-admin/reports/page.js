"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaBookOpen, FaAward, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import TeacherAdminGuard from '../TeacherAdminGuard';

export default function ReportsPage() {
    return (
        <TeacherAdminGuard>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Learning Insights</h1>
                        <p className="text-slate-500 font-medium">Monitor student progress and curriculum performance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500" />
                            <span className="text-sm font-bold text-slate-600">Last 30 Days</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Active Students", value: "24", icon: <FaUsers />, color: "bg-blue-500", text: "text-blue-500" },
                        { label: "Lessons Completed", value: "142", icon: <FaBookOpen />, color: "bg-green-500", text: "text-green-500" },
                        { label: "Avg. Quiz Score", value: "85%", icon: <FaChartLine />, color: "bg-purple-500", text: "text-purple-500" },
                        { label: "Medals Earned", value: "38", icon: <FaAward />, color: "bg-yellow-500", text: "text-yellow-500" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-${stat.text?.split('-')[1]}-100 group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-800 leading-none">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent completions */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Recent Student Activity</h3>
                            <button className="text-sm font-bold text-blue-500 hover:text-blue-600">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-200" />
                                        <div>
                                            <p className="font-bold text-slate-800">Student {i + 1}</p>
                                            <p className="text-xs text-slate-400 font-medium">Completed: Intro to Numbers (Grade 1)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-500">100% Score</p>
                                        <p className="text-[10px] text-slate-300 font-bold uppercase">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
                            <h3 className="text-xl font-bold mb-2">Weekly Summary</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">Your students are performing 15% better than last week! Keep up the great curriculum.</p>
                            <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                Download PDF <FaChevronRight size={12} />
                            </button>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Popularity</h3>
                            <div className="space-y-5">
                                {[
                                    { name: 'Mathematics', pct: 85, color: 'bg-blue-500' },
                                    { name: 'English', pct: 70, color: 'bg-green-500' },
                                    { name: 'Science', pct: 45, color: 'bg-purple-500' },
                                ].map((subject, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-600">{subject.name}</span>
                                            <span className="text-slate-400">{subject.pct}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${subject.color}`} style={{ width: `${subject.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherAdminGuard>
    );
}
