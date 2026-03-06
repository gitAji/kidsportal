import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, deleteDoc, runTransaction, getDoc, onSnapshot } from 'firebase/firestore';
import { app } from '../../../firebase/config';
import { getFirestore } from 'firebase/firestore';
import SkeletonLoader from '../ui/SkeletonLoader';
import AddChildForm from './AddChildForm';
import {
  FaEdit, FaUser, FaChartLine, FaTasks, FaCog, FaSignInAlt,
  FaTrophy, FaStar, FaKey, FaEye, FaEyeSlash, FaUserLock,
  FaFilePdf, FaExclamationTriangle, FaClipboard, FaArrowLeft,
  FaBookOpen, FaAward, FaGamepad, FaShieldAlt, FaCheck,
  FaSpinner, FaTimes, FaChalkboardTeacher, FaClock
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import RewardsDisplay from './RewardsDisplay';
import ProgressTracker from './ProgressTracker';
import StickerBook from './StickerBook';
import Reports from './Reports';
import Modal from '../ui/Modal';
import CustomAvatar from '../ui/CustomAvatar';
import SaveMessage from '../ui/SaveMessage';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'about', label: 'Overview', icon: <FaUser /> },
  { id: 'reports', label: 'Reports', icon: <FaFilePdf /> },
  { id: 'progress', label: 'Progress', icon: <FaChartLine /> },
  { id: 'rewards', label: 'Rewards', icon: <FaTrophy /> },
  { id: 'stickers', label: 'Stickers', icon: <FaAward /> },
  { id: 'settings', label: 'Settings', icon: <FaCog /> },
];

const ChildDashboard = ({ child, onClose }) => {
  const db = getFirestore(app);
  const [currentView, setCurrentView] = useState('details');
  const [activeTab, setActiveTab] = useState('about');
  const [childData, setChildData] = useState(child);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState(child?.username || '');
  const [usernameStatus, setUsernameStatus] = useState({ status: 'idle', message: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [loginEnabled, setLoginEnabled] = useState(child?.loginEnabled ?? true);
  const [professorCharacter, setProfessorCharacter] = useState(child?.professorCharacter || 'owl');
  const [timeAlertsEnabled, setTimeAlertsEnabled] = useState(child?.timeAlertsEnabled ?? true);
  const [showLoginHelper, setShowLoginHelper] = useState(false);

  const router = useRouter();

  const debouncedCheckUsernameAvailabilityRef = useRef(
    debounce(async (name, currentChild) => {
      if (!name || (currentChild && name === currentChild.username)) {
        setUsernameStatus({ status: 'idle', message: '' });
        return;
      }
      setUsernameStatus({ status: 'checking', message: 'Checking...' });
      const usernameDocRef = doc(db, 'child_usernames', name);
      const usernameDoc = await getDoc(usernameDocRef);
      setUsernameStatus(
        usernameDoc.exists()
          ? { status: 'taken', message: 'Username is already taken.' }
          : { status: 'available', message: 'Username is available!' }
      );
    }, 500)
  );

  useEffect(() => {
    setChildData(child);
    setUsername(child?.username || '');
    setLoginEnabled(child?.loginEnabled ?? true);
    setProfessorCharacter(child?.professorCharacter || 'owl');
    setTimeAlertsEnabled(child?.timeAlertsEnabled ?? true);
    setCurrentView('details');
    setActiveTab('about');
  }, [child]);

  useEffect(() => {
    const debounced = debouncedCheckUsernameAvailabilityRef.current;
    debounced(username, child);
    return () => { debounced.cancel(); };
  }, [username, child]);

  // Real-time synchronization for child data
  useEffect(() => {
    if (!child?.id || !child?.parentUid) return;

    const childDocRef = doc(db, "users", child.parentUid, "children", child.id);
    const unsubscribe = onSnapshot(childDocRef, (doc) => {
      if (doc.exists()) {
        const freshData = { id: doc.id, ...doc.data(), parentUid: child.parentUid };
        setChildData(prev => ({ ...prev, ...freshData }));
      }
    }, (error) => {
      console.error("Error listening to child updates:", error);
    });

    return () => unsubscribe();
  }, [child?.id, child?.parentUid, db]);

  const handleDeleteClick = async () => {
    if (!confirm(`Are you sure you want to deactivate ${childData.name}'s account? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      const childDocRef = doc(db, "users", childData.parentUid, "children", childData.id);
      const usernameDocRef = doc(db, "child_usernames", childData.username);
      await runTransaction(db, async (t) => {
        t.delete(childDocRef);
        t.delete(usernameDocRef);
      });
      setSaveStatus('success');
      setErrorMessage('Child account deactivated successfully!');
      onClose();
    } catch (error) {
      console.error("Error deleting child account:", error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to deactivate account.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCancel = () => setCurrentView('details');
  const handleSaveSuccess = (updatedChild) => {
    setChildData(updatedChild);
    setCurrentView('details');
    setSaveStatus('success');
    setErrorMessage('Child profile updated successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleToggleLogin = async (newStatus) => {
    setLoginEnabled(newStatus);
    try {
      const childDocRef = doc(db, "users", childData.parentUid, "children", childData.id);
      await updateDoc(childDocRef, { loginEnabled: newStatus });
      const updatedData = { ...childData, loginEnabled: newStatus };
      setChildData(updatedData);
      sessionStorage.setItem('childUser', JSON.stringify(updatedData));
      setSaveStatus('success');
      setErrorMessage('Login status updated successfully!');
    } catch (error) {
      console.error("Failed to update login status:", error);
      setLoginEnabled(!newStatus);
      setSaveStatus('error');
      setErrorMessage(`Failed to update login status: ${error.message}`);
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSaveStatus('error');
      setErrorMessage('New passwords do not match.');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }
    if (usernameStatus.status === 'taken') {
      setSaveStatus('error');
      setErrorMessage('Username is already taken.');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }
    setLoading(true);
    setSaveStatus(null);
    try {
      const childDocRef = doc(db, "users", childData.parentUid, "children", childData.id);
      const updates = { username, loginEnabled, professorCharacter, timeAlertsEnabled };
      if (newPassword) updates.password = newPassword;
      if (username !== childData.username) {
        const oldUsernameDocRef = doc(db, 'child_usernames', childData.username);
        const newUsernameDocRef = doc(db, 'child_usernames', username);
        await runTransaction(db, async (t) => {
          const newUsernameDoc = await t.get(newUsernameDocRef);
          if (newUsernameDoc.exists()) throw new Error("This username is already taken.");
          t.delete(oldUsernameDocRef);
          t.set(newUsernameDocRef, { parentUid: childData.parentUid, childId: childData.id });
          t.update(childDocRef, updates);
        });
      } else {
        await updateDoc(childDocRef, updates);
      }
      setChildData({ ...childData, ...updates });
      setSaveStatus('success');
      setErrorMessage('Settings updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error updating settings:", error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSaveStatus('success');
      setErrorMessage('Copied to clipboard!');
      setTimeout(() => setSaveStatus(null), 2000);
    });
  };

  if (loading) return <SkeletonLoader />;
  if (!childData) return <div>No Child Data Available</div>;

  // Quick-stat cards for the overview
  const stats = [
    { label: "Stars Earned", value: childData.points || 0, icon: <FaStar />, color: "amber" },
    { label: "Stickers", value: childData.stickers?.length || 0, icon: <FaAward />, color: "violet" },
    { label: "Grade", value: childData.grade || "—", icon: <FaBookOpen />, color: "blue" },
    { label: "Status", value: loginEnabled ? "Active" : "Paused", icon: <FaShieldAlt />, color: loginEnabled ? "emerald" : "rose" },
  ];

  const inputCls = "w-full bg-white border-2 border-slate-100 text-slate-800 text-sm font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-300";

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Floating notification */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-sm font-bold ${saveStatus === 'error'
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "bg-emerald-50 border-emerald-200 text-emerald-600"
              }`}
          >
            {saveStatus === 'error' ? <FaTimes /> : <FaCheck />} {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === 'details' ? (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">

          {/* ── Top Bar ── */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <button
              onClick={() => setCurrentView('edit')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest rounded-xl hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>

          {/* ── Profile Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/30 border border-slate-100 p-8 sm:p-10 mb-8 overflow-hidden relative"
          >
            {/* Decorative background circles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-40 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full opacity-30 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200/50 overflow-hidden flex-shrink-0">
                <CustomAvatar child={childData} />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-1">{childData.name}</h1>
                <p className="text-slate-400 font-bold text-sm mb-4">
                  Age {childData.age} • Grade {childData.grade} • @{childData.username}
                </p>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stats.map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className={`text-lg mb-0.5 text-${s.color}-500`}>{s.icon}</div>
                      <p className="text-lg font-black text-slate-800">{s.value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowLoginHelper(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 hover:scale-[1.02] transition-all"
                >
                  <FaSignInAlt /> Launch Zone
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Tab Navigation ── */}
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200/40"
                  : "bg-white text-slate-400 border-slate-100 hover:border-blue-100 hover:text-blue-500"
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Child Details Card */}
                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Learner Details</h3>
                      <div className="space-y-4">
                        {[
                          { label: "Full Name", value: childData.name },
                          { label: "Age", value: `${childData.age} years old` },
                          { label: "Grade Level", value: childData.grade },
                          { label: "Username", value: `@${childData.username}` },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-bold">{item.label}</span>
                            <span className="text-sm text-slate-700 font-black">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Status Card */}
                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Account Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400 font-bold">Login Access</span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${loginEnabled
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}>
                            {loginEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400 font-bold">Stars Earned</span>
                          <span className="text-sm text-amber-500 font-black flex items-center gap-1"><FaStar /> {childData.points || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400 font-bold">Stickers Collected</span>
                          <span className="text-sm text-violet-500 font-black flex items-center gap-1"><FaAward /> {childData.stickers?.length || 0}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-50">
                        <button
                          onClick={() => setShowLoginHelper(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all"
                        >
                          <FaSignInAlt /> Login as {childData.name}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REPORTS TAB */}
              {activeTab === 'reports' && (
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                  <Reports childData={childData} />
                </div>
              )}

              {/* PROGRESS TAB */}
              {activeTab === 'progress' && (
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                  <ProgressTracker child={childData} />
                </div>
              )}

              {/* REWARDS TAB */}
              {activeTab === 'rewards' && (
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                  <RewardsDisplay points={childData.points || 0} />
                </div>
              )}

              {/* STICKERS TAB */}
              {activeTab === 'stickers' && (
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                  <StickerBook collectedStickerIds={childData.stickers} />
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSettingsSave} className="space-y-6">
                  {/* Account Access */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <FaUserLock className="text-blue-500" /> Account Access
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Enable Child Login</p>
                          <p className="text-xs text-slate-400 font-medium">Allow sign in to Student Zone</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={loginEnabled}
                            onChange={(e) => handleToggleLogin(e.target.checked)}
                          />
                          <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <FaClock className="text-amber-500" /> Exam Helpers
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Professor Time Alerts</p>
                          <p className="text-xs text-slate-400 font-medium">Professor alerts when time is low</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={timeAlertsEnabled}
                            onChange={(e) => setTimeAlertsEnabled(e.target.checked)}
                          />
                          <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Professor Customization */}
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <FaChalkboardTeacher className="text-indigo-500" /> Professor Companion
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">Choose a character to guide your child through their learning journey.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { id: 'owl', name: 'Professor Owl', img: '/images/professor-owl.png', color: 'from-blue-500 to-indigo-600' },
                        { id: 'panda', name: 'Smart Panda', img: '/images/smart-panda.png', color: 'from-emerald-500 to-teal-600' }, // Updated placeholder to actual panda image
                      ].map((prof) => (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => setProfessorCharacter(prof.id)}
                          className={`relative group p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${professorCharacter === prof.id
                            ? 'border-indigo-500 bg-indigo-50/50'
                            : 'border-slate-100 bg-white hover:border-indigo-200'
                            }`}
                        >
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${prof.color} p-1 shadow-md group-hover:scale-110 transition-transform`}>
                            <div className="w-full h-full bg-white rounded-full overflow-hidden relative">
                              <Image src={prof.img} alt={prof.name} fill className="object-contain p-1" />
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${professorCharacter === prof.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {prof.name}
                          </span>
                          {professorCharacter === prof.id && (
                            <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1 text-[10px] shadow-lg">
                              <FaCheck />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Login Credentials */}
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <FaKey className="text-amber-500" /> Login Credentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={inputCls}
                          required
                        />
                        {usernameStatus.status !== 'idle' && (
                          <p className={`text-xs mt-2 font-bold ${usernameStatus.status === 'available' ? 'text-emerald-500' : usernameStatus.status === 'taken' ? 'text-rose-500' : 'text-slate-400'
                            }`}>
                            {usernameStatus.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={childData.password || 'Not Set'}
                            readOnly
                            className={`${inputCls} bg-slate-50`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Leave blank to keep current"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        disabled={loading || usernameStatus.status === 'checking' || usernameStatus.status === 'taken'}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 shadow-lg shadow-blue-200/40"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white rounded-2xl p-7 shadow-sm border-2 border-rose-100">
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <FaExclamationTriangle /> Danger Zone
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Deactivate this account</p>
                        <p className="text-xs text-slate-400 font-medium">Once you deactivate this account, it cannot be undone.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-rose-200 hover:bg-rose-100 transition-all flex-shrink-0"
                      >
                        <FaExclamationTriangle /> Deactivate
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* ── EDIT VIEW ── */
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm"
            >
              <FaArrowLeft /> Cancel
            </button>
            <h2 className="text-2xl font-black text-slate-800">Edit {childData.name}&apos;s Profile</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <AddChildForm childToEdit={childData} onClose={handleCancel} onSaveSuccess={handleSaveSuccess} />
          </div>
        </div>
      )}

      {/* ── Login Helper Modal ── */}
      {showLoginHelper && (
        <Modal onClose={() => setShowLoginHelper(false)}>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg shadow-blue-200/50">
              <FaSignInAlt />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Login Details for {childData.name}</h3>
            <p className="text-slate-400 mb-8 font-medium text-sm">Use these credentials to sign in as your learner.</p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Username</p>
              <p className="text-2xl font-black text-blue-600">{childData.username}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const storage = localStorage;
                  storage.setItem("childUser", JSON.stringify(childData));
                  router.push("/learning-zone");
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <FaSignInAlt className="group-hover:translate-x-1 transition-transform" /> Launch Student Zone
              </button>
              <button
                onClick={() => copyToClipboard(childData.username)}
                className="w-full py-3 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <FaClipboard /> Copy Username
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowLoginHelper(false);
                }}
                className="w-full py-3 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <FaKey /> Manage PIN in Settings
              </button>
            </div>

            <p className="text-[10px] text-slate-400 mt-8 font-bold flex items-center justify-center gap-2">
              <FaUserLock className="text-blue-500" /> Security first: Passwords are only visible in Settings.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChildDashboard;
