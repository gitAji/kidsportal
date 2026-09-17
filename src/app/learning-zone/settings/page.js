"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebase/config';
import { getFirestore } from 'firebase/firestore';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import {
  FaArrowLeft, FaPalette, FaUserCircle, FaSave,
  FaPaw, FaRocket, FaCar, FaTree, FaSmile,
  FaStar, FaDragon, FaFish, FaHorse, FaCat,
  FaCheckCircle, FaHome, FaVolumeUp, FaVolumeMute,
  FaTrophy
} from 'react-icons/fa';
import CustomAvatar from '../../components/ui/CustomAvatar';
import { useChild } from '../../providers/ChildProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

const themes = [
  { id: 'default', name: 'Sky Blue', primary: '#3B82F6', bg: '#DBEAFE', gradient: 'from-blue-400 to-blue-600' },
  { id: 'green', name: 'Forest', primary: '#10B981', bg: '#D1FAE5', gradient: 'from-emerald-400 to-green-600' },
  { id: 'cyan', name: 'Galaxy', primary: '#8B5CF6', bg: '#EDE9FE', gradient: 'from-blue-400 to-cyan-600' },
  { id: 'orange', name: 'Sunset', primary: '#F97316', bg: '#FFEDD5', gradient: 'from-orange-400 to-red-500' },
  { id: 'pink', name: 'Cotton Candy', primary: '#EC4899', bg: '#FCE7F3', gradient: 'from-pink-400 to-rose-500' },
  { id: 'teal', name: 'Ocean', primary: '#14B8A6', bg: '#CCFBF1', gradient: 'from-teal-400 to-cyan-600' },
];

const avatars = [
  { id: 'paw', icon: <FaPaw />, label: 'Paw' },
  { id: 'rocket', icon: <FaRocket />, label: 'Rocket' },
  { id: 'car', icon: <FaCar />, label: 'Car' },
  { id: 'tree', icon: <FaTree />, label: 'Tree' },
  { id: 'smile', icon: <FaSmile />, label: 'Happy' },
  { id: 'star', icon: <FaStar />, label: 'Star' },
  { id: 'dragon', icon: <FaDragon />, label: 'Dragon' },
  { id: 'fish', icon: <FaFish />, label: 'Fish' },
  { id: 'horse', icon: <FaHorse />, label: 'Horse' },
  { id: 'cat', icon: <FaCat />, label: 'Cat' },
  { id: 'default', icon: <FaUserCircle />, label: 'Default' },
];

export default function SettingsPage() {
  const db = getFirestore(app);
  const { childUser, setChildUser: setGlobalChildUser } = useChild();
  const [selectedAvatar, setSelectedAvatar] = useState('default');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (childUser) {
      setSelectedAvatar(childUser.avatar || 'default');
      setSelectedTheme(childUser.theme || 'default');
      setSoundEnabled(childUser.soundEnabled !== false);
    }
  }, [childUser]);

  const handleSave = async () => {
    if (!childUser) return;
    setSaveStatus('saving');
    setErrorMsg('');
    try {
      const childDocRef = doc(db, 'users', childUser.parentUid, 'children', childUser.id);
      const updates = { avatar: selectedAvatar, theme: selectedTheme, soundEnabled };
      await updateDoc(childDocRef, updates);
      const updated = { ...childUser, ...updates };
      if (localStorage.getItem('childUser')) localStorage.setItem('childUser', JSON.stringify(updated));
      else if (sessionStorage.getItem('childUser')) sessionStorage.setItem('childUser', JSON.stringify(updated));
      setGlobalChildUser(updated);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus('error');
      setErrorMsg(e.message || 'Failed to save.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (!childUser) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Loading your settings..." />
    </div>
  );

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="px-4 py-2 rounded-full hover:bg-slate-50 transition-colors text-gray-600 font-semibold text-sm flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-xl font-extrabold text-gray-800">My Settings ⚙️</h1>
        <Link href="/learning-zone/rewards" className="p-2 rounded-full hover:bg-yellow-50 text-yellow-500 transition-colors">
          <FaTrophy />
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Preview */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${currentTheme.gradient} rounded-3xl p-6 text-white text-center shadow-xl`}>
          <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur mx-auto flex items-center justify-center text-5xl mb-3 shadow-lg border-4 border-white/50">
            {avatars.find(a => a.id === selectedAvatar)?.icon || <FaUserCircle />}
          </div>
          <p className="font-extrabold text-2xl drop-shadow">{childUser.name}</p>
          <p className="text-white/80 text-sm mt-1">Grade {childUser.gradeId?.replace('grade', '')}</p>
        </motion.div>

        {/* Avatar Picker */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
          <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserCircle className="text-blue-500" /> Choose Your Avatar
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {avatars.map(av => (
              <button key={av.id} onClick={() => setSelectedAvatar(av.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all text-2xl ${selectedAvatar === av.id
                  ? `bg-gradient-to-br ${currentTheme.gradient} text-white shadow-lg scale-110`
                  : 'bg-slate-100 text-gray-500 hover:bg-slate-200'
                  }`}>
                {av.icon}
                <span className="text-xs font-bold">{av.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Theme Picker */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
          <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <FaPalette className="text-cyan-500" /> Learning Zone Theme
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map(theme => (
              <button key={theme.id} onClick={() => setSelectedTheme(theme.id)}
                className={`relative p-4 rounded-2xl text-left transition-all border-2 ${selectedTheme === theme.id ? `border-[${theme.primary}] shadow-lg scale-105` : 'border-transparent shadow-sm hover:shadow-md'
                  }`}
                style={{ backgroundColor: theme.bg }}>
                {selectedTheme === theme.id && (
                  <FaCheckCircle className="absolute top-2 right-2 text-lg" style={{ color: theme.primary }} />
                )}
                <div className="w-8 h-8 rounded-full mb-2 shadow-md" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.bg})` }} />
                <p className="font-bold text-sm text-gray-700">{theme.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sound Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
          <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            {soundEnabled ? <FaVolumeUp className="text-green-500" /> : <FaVolumeMute className="text-red-400" />}
            Sound Effects
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Play sounds for correct & wrong answers</p>
            <button onClick={() => setSoundEnabled(s => !s)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${soundEnabled ? 'left-7' : 'left-0.5'}`} />
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-4 rounded-2xl font-extrabold text-xl text-white shadow-lg transition-all flex items-center justify-center gap-3 ${saveStatus === 'success' ? 'bg-green-500 shadow-green-200' :
            saveStatus === 'error' ? 'bg-red-500 shadow-red-200' :
              `bg-gradient-to-r ${currentTheme.gradient} shadow-blue-200`
            }`}>
          {saveStatus === 'saving' ? '⏳ Saving...' :
            saveStatus === 'success' ? <><FaCheckCircle /> Saved!</> :
              saveStatus === 'error' ? `❌ ${errorMsg}` :
                <><FaSave /> Save My Settings</>}
        </motion.button>
      </div>
    </div>
  );
}
