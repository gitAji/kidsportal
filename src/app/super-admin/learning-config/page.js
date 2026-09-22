"use client";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGlobeAmericas, FaBookOpen, FaSave, FaSpinner,
    FaCheck, FaPlus, FaTimes, FaArrowLeft
} from 'react-icons/fa';
import Link from 'next/link';

// ── Default available languages ─────────────────────────────────
const ALL_LANGUAGES = [
    { value: "English", label: "🇬🇧 English" },
    { value: "Tamil", label: "🇮🇳 Tamil (தமிழ்)" },
    { value: "Norwegian", label: "🇳🇴 Norwegian (Norsk)" },
    { value: "French", label: "🇫🇷 French (Français)" },
    { value: "Spanish", label: "🇪🇸 Spanish (Español)" },
    { value: "German", label: "🇩🇪 German (Deutsch)" },
    { value: "Arabic", label: "🇸🇦 Arabic (العربية)" },
    { value: "Mandarin", label: "🇨🇳 Mandarin (中文)" },
    { value: "Hindi", label: "🇮🇳 Hindi (हिन्दी)" },
    { value: "Sinhala", label: "🇱🇰 Sinhala (සිංහල)" },
    { value: "Malay", label: "🇲🇾 Malay (Bahasa Melayu)" },
    { value: "Swedish", label: "🇸🇪 Swedish (Svenska)" },
    { value: "Danish", label: "🇩🇰 Danish (Dansk)" },
    { value: "Finnish", label: "🇫🇮 Finnish (Suomi)" },
    { value: "Portuguese", label: "🇵🇹 Portuguese (Português)" },
    { value: "Japanese", label: "🇯🇵 Japanese (日本語)" },
    { value: "Korean", label: "🇰🇷 Korean (한국어)" },
];

// ── Default available subjects ──────────────────────────────────
const ALL_SUBJECTS = [
    { id: "English", emoji: "🇬🇧", category: "Language" },
    { id: "Tamil", emoji: "🇮🇳", category: "Language" },
    { id: "Norwegian", emoji: "🇳🇴", category: "Language" },
    { id: "French", emoji: "🇫🇷", category: "Language" },
    { id: "Spanish", emoji: "🇪🇸", category: "Language" },
    { id: "German", emoji: "🇩🇪", category: "Language" },
    { id: "Math", emoji: "🔢", category: "Core" },
    { id: "Science", emoji: "🔬", category: "Core" },
    { id: "Art", emoji: "🎨", category: "Creative" },
    { id: "Music", emoji: "🎵", category: "Creative" },
    { id: "History", emoji: "📜", category: "General" },
    { id: "Geography", emoji: "🌍", category: "General" },
    { id: "Computer Science", emoji: "💻", category: "General" },
    { id: "Coding", emoji: "⌨️", category: "General" },
    { id: "Physical Education", emoji: "⚽", category: "General" },
];

const CONFIG_DOC = "platformConfig";

export default function LearningConfigPage() {
    const [enabledLanguages, setEnabledLanguages] = useState([]);
    const [enabledSubjects, setEnabledSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    // Custom subject form
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectEmoji, setNewSubjectEmoji] = useState("📚");
    const [newSubjectCategory, setNewSubjectCategory] = useState("General");

    // Load existing config from Firestore
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const snap = await getDoc(doc(db, 'settings', CONFIG_DOC));
                if (snap.exists()) {
                    const data = snap.data();
                    setEnabledLanguages(data.enabledLanguages || ALL_LANGUAGES.map(l => l.value));
                    setEnabledSubjects(data.enabledSubjects || ALL_SUBJECTS.map(s => s.id));
                } else {
                    // Default: enable everything
                    setEnabledLanguages(ALL_LANGUAGES.map(l => l.value));
                    setEnabledSubjects(ALL_SUBJECTS.map(s => s.id));
                }
            } catch (err) {
                console.error("Error loading config:", err);
                setEnabledLanguages(ALL_LANGUAGES.map(l => l.value));
                setEnabledSubjects(ALL_SUBJECTS.map(s => s.id));
            }
            setLoading(false);
        };
        loadConfig();
    }, []);

    // Save to Firestore
    const handleSave = async () => {
        setSaving(true);
        setSaveMsg("");
        try {
            await setDoc(doc(db, 'settings', CONFIG_DOC), {
                enabledLanguages,
                enabledSubjects,
                updatedAt: serverTimestamp(),
            }, { merge: true });
            setSaveMsg("Configuration saved successfully!");
        } catch (err) {
            console.error("Error saving config:", err);
            setSaveMsg("Error saving: " + err.message);
        }
        setSaving(false);
        setTimeout(() => setSaveMsg(""), 4000);
    };

    const toggleLanguage = (val) => {
        setEnabledLanguages(prev =>
            prev.includes(val) ? prev.filter(l => l !== val) : [...prev, val]
        );
    };

    const toggleSubject = (id) => {
        setEnabledSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const addCustomSubject = () => {
        if (!newSubjectName.trim()) return;
        const id = newSubjectName.trim();
        if (!ALL_SUBJECTS.find(s => s.id === id)) {
            ALL_SUBJECTS.push({ id, emoji: newSubjectEmoji, category: newSubjectCategory });
        }
        setEnabledSubjects(prev => [...prev, id]);
        setNewSubjectName("");
        setNewSubjectEmoji("📚");
        setShowAddSubject(false);
    };

    // Group subjects by category
    const categories = [...new Set(ALL_SUBJECTS.map(s => s.category))];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FaSpinner className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/super-admin" className="text-blue-400 hover:text-blue-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Learning Configuration</h1>
                    <p className="text-slate-400 font-medium">Control which languages and subjects are available platform-wide for parents and students.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black rounded-2xl shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40 transition-all text-sm uppercase tracking-widest disabled:opacity-60"
                >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saving ? "Saving…" : "Save Config"}
                </motion.button>
            </div>

            {/* Save message */}
            <AnimatePresence>
                {saveMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-sm font-bold ${saveMsg.includes("Error")
                                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            }`}
                    >
                        <FaCheck /> {saveMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Languages Section ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-xl text-white shadow-lg">
                        <FaGlobeAmericas />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Available Languages</h2>
                        <p className="text-sm text-slate-500 font-medium">Languages that parents can choose as the display language for their child&apos;s Learning Zone.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-8">
                    {ALL_LANGUAGES.map(lang => {
                        const isEnabled = enabledLanguages.includes(lang.value);
                        return (
                            <motion.button
                                key={lang.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleLanguage(lang.value)}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${isEnabled
                                        ? "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/5"
                                        : "bg-slate-900/50 border-slate-800 text-slate-600 hover:border-slate-700"
                                    }`}
                            >
                                <span className="text-lg">{lang.label.split(" ")[0]}</span>
                                <span className="flex-grow text-left">{lang.value}</span>
                                {isEnabled && <FaCheck className="text-xs text-blue-400" />}
                            </motion.button>
                        );
                    })}
                </div>

                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">
                    {enabledLanguages.length} of {ALL_LANGUAGES.length} languages enabled
                </p>
            </div>

            {/* ── Subjects Section ── */}
            <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xl text-white shadow-lg">
                            <FaBookOpen />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Available Subjects</h2>
                            <p className="text-sm text-slate-500 font-medium">Subjects that parents can select for their child&apos;s Learning Zone curriculum.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddSubject(!showAddSubject)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        <FaPlus /> Add Subject
                    </button>
                </div>

                {/* Add custom subject form */}
                <AnimatePresence>
                    {showAddSubject && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-6 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-wrap items-end gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Subject Name</label>
                                    <input
                                        value={newSubjectName}
                                        onChange={e => setNewSubjectName(e.target.value)}
                                        placeholder="e.g. Coding"
                                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none placeholder:text-slate-600 w-48"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Emoji</label>
                                    <input
                                        value={newSubjectEmoji}
                                        onChange={e => setNewSubjectEmoji(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none w-20 text-center text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                                    <select
                                        value={newSubjectCategory}
                                        onChange={e => setNewSubjectCategory(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none"
                                    >
                                        <option value="Core">Core</option>
                                        <option value="Language">Language</option>
                                        <option value="Creative">Creative</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <button
                                    onClick={addCustomSubject}
                                    className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-violet-700 transition-all"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowAddSubject(false)}
                                    className="px-4 py-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grouped by category */}
                <div className="space-y-8 mt-8">
                    {categories.map(cat => {
                        const subjectsInCat = ALL_SUBJECTS.filter(s => s.category === cat);
                        return (
                            <div key={cat}>
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[3px] mb-4">{cat} Subjects</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {subjectsInCat.map(subj => {
                                        const isEnabled = enabledSubjects.includes(subj.id);
                                        return (
                                            <motion.button
                                                key={subj.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleSubject(subj.id)}
                                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${isEnabled
                                                        ? "bg-violet-500/10 border-violet-500/40 text-violet-400 shadow-lg shadow-violet-500/5"
                                                        : "bg-slate-900/50 border-slate-800 text-slate-600 hover:border-slate-700"
                                                    }`}
                                            >
                                                <span className="text-lg">{subj.emoji}</span>
                                                <span className="flex-grow text-left">{subj.id}</span>
                                                {isEnabled && <FaCheck className="text-xs text-violet-400" />}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">
                    {enabledSubjects.length} of {ALL_SUBJECTS.length} subjects enabled
                </p>
            </div>

            {/* ── Info Banner ── */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
                    💡
                </div>
                <div>
                    <p className="text-sm font-bold text-white mb-1">How this works</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Languages and subjects you enable here will appear as options in the Parent Profile settings.
                        Parents can then select which languages and subjects their child should see in the Learning Zone.
                        Disabling a language or subject here will hide it from all parents across the platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
