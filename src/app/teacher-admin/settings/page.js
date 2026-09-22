"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser, FaBell, FaLock, FaPalette, FaSave, FaCheckCircle,
    FaHistory, FaShieldAlt, FaMoon, FaSun, FaExclamationTriangle,
    FaCamera, FaEnvelope, FaSchool, FaGraduationCap
} from 'react-icons/fa';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import TeacherAdminGuard from '../TeacherAdminGuard';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        bio: '',
        schoolName: '',
        gradeLevel: '',
        profileImage: '',
        preferences: {
            theme: 'light',
            emailNotifications: true,
            pushNotifications: false
        }
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUser />, desc: 'Personal details' },
        { id: 'security', label: 'Security', icon: <FaLock />, desc: 'Password & Safety' },
        { id: 'notifications', label: 'Notifications', icon: <FaBell />, desc: 'Alert settings' },
        { id: 'display', label: 'Display', icon: <FaPalette />, desc: 'Portal appearance' },
    ];

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const docRef = doc(db, 'teachers', currentUser.email.toLowerCase());
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfile({
                            fullName: data.fullName || '',
                            email: currentUser.email,
                            bio: data.bio || '',
                            schoolName: data.schoolName || '',
                            gradeLevel: data.gradeLevel || '',
                            profileImage: data.profileImage || '',
                            preferences: data.preferences || {
                                theme: 'light',
                                emailNotifications: true,
                                pushNotifications: false
                            }
                        });
                    } else {
                        // Initialize if missing
                        setProfile(prev => ({ ...prev, email: currentUser.email }));
                    }
                } catch (e) {
                    console.error("Settings Load Error:", e);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    const handleSave = async (e) => {
        e?.preventDefault();
        if (!user) return;
        setSaveStatus('saving');
        try {
            const docRef = doc(db, 'teachers', user.email.toLowerCase());
            await updateDoc(docRef, {
                fullName: profile.fullName,
                bio: profile.bio,
                schoolName: profile.schoolName,
                gradeLevel: profile.gradeLevel,
                profileImage: profile.profileImage,
                preferences: profile.preferences,
                updatedAt: serverTimestamp()
            });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (e) {
            console.error("Save Error:", e);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <TeacherAdminGuard>
            <div className="pl-16 pr-6 py-6 md:p-10 max-w-6xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 text-xl">
                                <FaShieldAlt />
                            </div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Portal Configuration</h1>
                        </div>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-16">Teacher Admin Dashboard · v1.2</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Navigation Rail */}
                    <div className="w-full lg:w-72 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 lg:flex-none flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all group relative whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105"
                                    : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:border-slate-200"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${activeTab === tab.id ? "bg-white/20" : "bg-slate-50 text-slate-400 group-hover:text-blue-500"
                                    }`}>
                                    {tab.icon}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="font-black text-sm leading-tight">{tab.label}</p>
                                    <p className={`text-[9px] uppercase font-bold tracking-tighter ${activeTab === tab.id ? "text-blue-100" : "text-slate-300"}`}>{tab.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Main Settings Panel */}
                    <div className="flex-grow bg-white rounded-[3rem] shadow-sm border border-slate-100 relative min-h-[500px]">
                        <div className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                {activeTab === 'profile' && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-10"
                                    >
                                        <div className="flex items-center gap-8 pb-8 border-b border-slate-50">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                                    {profile.profileImage ? (
                                                        <img src={profile.profileImage} className="w-full h-full object-cover rounded-[2rem]" alt="Avatar" />
                                                    ) : (
                                                        profile.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'T'
                                                    )}
                                                </div>
                                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
                                                    <FaCamera size={14} />
                                                </button>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-800">Teacher Profile</h2>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Public identity in the platform</p>
                                            </div>
                                        </div>

                                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8" onSubmit={handleSave}>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                                    <FaUser size={10} /> Full Name
                                                </label>
                                                <input
                                                    value={profile.fullName}
                                                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                                                    type="text"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                                    <FaEnvelope size={10} /> Email {user?.emailVerified ? (
                                                        <span className="text-emerald-500 normal-case">(Verified)</span>
                                                    ) : (
                                                        <span className="text-amber-500 normal-case">(Not verified)</span>
                                                    )}
                                                </label>
                                                <input
                                                    value={profile.email}
                                                    disabled
                                                    type="email"
                                                    className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                                    <FaSchool size={10} /> School Name
                                                </label>
                                                <input
                                                    value={profile.schoolName}
                                                    onChange={e => setProfile({ ...profile, schoolName: e.target.value })}
                                                    type="text"
                                                    placeholder="Example Elementary"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                                    <FaGraduationCap size={10} /> Primary Grade
                                                </label>
                                                <select
                                                    value={profile.gradeLevel}
                                                    onChange={e => setProfile({ ...profile, gradeLevel: e.target.value })}
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm"
                                                >
                                                    <option value="">Select Grade</option>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(g => (
                                                        <option key={g} value={g}>Grade {g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bio / Professional Intro</label>
                                                <textarea
                                                    value={profile.bio}
                                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                                    rows={4}
                                                    placeholder="Tell your students something inspiring..."
                                                    className="w-full bg-slate-50 border-none rounded-[2rem] px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm resize-none"
                                                />
                                            </div>

                                            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-50">
                                                <button
                                                    type="submit"
                                                    disabled={saveStatus === 'saving'}
                                                    className={`px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${saveStatus === 'success' ? 'bg-green-500 shadow-xl shadow-green-100 text-white' :
                                                        saveStatus === 'error' ? 'bg-red-500 shadow-xl shadow-red-100 text-white' :
                                                            'bg-blue-600 shadow-xl shadow-blue-100 text-white hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:shadow-lg'
                                                        }`}
                                                >
                                                    {saveStatus === 'saving' ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : saveStatus === 'success' ? (
                                                        <FaCheckCircle />
                                                    ) : (
                                                        <FaSave />
                                                    )}
                                                    {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'success' ? 'Profile Updated' : saveStatus === 'error' ? 'Failed to Save' : 'Save Profile'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {activeTab === 'security' && (
                                    <motion.div
                                        key="security"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
                                            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center text-3xl">
                                                <FaLock />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-800">Security & Access</h2>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Manage authentication and password</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Password Update</h3>
                                                <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">Receive an email to securely reset your password.</p>
                                                <button className="w-full py-4 bg-white text-slate-800 rounded-2xl font-black text-[10px] uppercase shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">Send Reset Email</button>
                                            </div>
                                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 opacity-60">
                                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    2FA Verification <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[8px]">PRO</span>
                                                </h3>
                                                <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">Add an extra layer of security with mobile authentication.</p>
                                                <button disabled className="w-full py-4 bg-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase cursor-not-allowed transition-all">Enable 2FA</button>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex gap-4">
                                            <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm font-black text-amber-800">Sensitive Information</p>
                                                <p className="text-xs font-bold text-amber-600 opacity-80 mt-1">Updates to email require direct admin intervention for audit purposes. Contact support to change your primary login address.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'notifications' && (
                                    <motion.div
                                        key="notifs"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
                                            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center text-3xl">
                                                <FaBell />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-800">Notifications</h2>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Choose how you stay informed</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'Weekly Performance Report', desc: 'Receive aggregated stats of student progress.', key: 'emailNotifications' },
                                                { label: 'Student Flag Alerts', desc: 'Alert when a student fails a quiz or exam.', key: 'pushNotifications' },
                                                { label: 'System Announcements', desc: 'Updates about curriculum changes or new features.', key: 'emailNotifications' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                                                    <div className="space-y-1">
                                                        <h3 className="font-black text-slate-800 text-sm leading-tight">{item.label}</h3>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newPrefs = { ...profile.preferences, [item.key]: !profile.preferences[item.key] };
                                                            setProfile({ ...profile, preferences: newPrefs });
                                                        }}
                                                        className={`w-14 h-8 rounded-full transition-all relative ${profile.preferences[item.key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                                                    >
                                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${profile.preferences[item.key] ? 'left-7' : 'left-1'}`}></div>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end pt-6">
                                            <button onClick={() => handleSave()} className="bg-blue-600 text-white font-black px-10 py-5 rounded-full shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">Save Notification Rules</button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'display' && (
                                    <motion.div
                                        key="display"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-500 flex items-center justify-center text-3xl">
                                                <FaPalette />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-800">Visual Settings</h2>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personalize your admin workspace</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <button
                                                onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, theme: 'light' } })}
                                                className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-4 ${profile.preferences.theme === 'light' ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center text-amber-500 text-3xl">
                                                    <FaSun />
                                                </div>
                                                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Light Sunlight</span>
                                            </button>
                                            <button
                                                onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, theme: 'dark' } })}
                                                className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-4 ${profile.preferences.theme === 'dark' ? 'border-blue-500 bg-blue-900/10' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="w-20 h-20 bg-slate-900 rounded-3xl shadow-lg flex items-center justify-center text-indigo-300 text-3xl">
                                                    <FaMoon />
                                                </div>
                                                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Deep Midnight</span>
                                            </button>
                                        </div>

                                        <div className="pt-6">
                                            <button onClick={() => handleSave()} className="w-full py-5 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all">Submit Display Changes</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherAdminGuard>
    );
}

