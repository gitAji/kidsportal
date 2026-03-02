"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaUser, FaBell, FaLock, FaGlobe, FaPalette, FaSave } from 'react-icons/fa';
import TeacherAdminGuard from '../TeacherAdminGuard';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        { id: 'security', label: 'Security', icon: <FaLock /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
        { id: 'display', label: 'Display', icon: <FaPalette /> },
    ];

    return (
        <TeacherAdminGuard>
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your teacher account and portal preferences.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                        : "text-slate-400 hover:bg-white hover:text-slate-600"
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 pointer-events-none">
                            <FaCog size={120} />
                        </div>

                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <h2 className="text-2xl font-black text-slate-800 mb-8">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input type="email" placeholder="teacher@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Bio / Welcome Message</label>
                                        <textarea rows={4} placeholder="I'm excited to help you learn today!" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm resize-none" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button className="bg-blue-600 text-white font-black px-10 py-4 rounded-full shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                                        <FaSave /> Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab !== 'profile' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-4">
                                    <FaCog />
                                </div>
                                <h2 className="text-xl font-black text-slate-800">Advanced Config</h2>
                                <p className="text-slate-400 font-medium max-w-xs mt-2">These settings are currently managed by the super administrator.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeacherAdminGuard>
    );
}
