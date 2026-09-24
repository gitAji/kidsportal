import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, runTransaction } from 'firebase/firestore';
import { auth } from '../../../firebase/auth';
import { app } from '../../../firebase/config';
import { getFirestore } from 'firebase/firestore';
import { FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile, FaMagic, FaCheckCircle, FaTimesCircle, FaAsterisk } from 'react-icons/fa';
import { debounce } from 'lodash';
import SaveMessage from '../ui/SaveMessage';
import { motion, AnimatePresence } from 'framer-motion';

const avatars = [
  { id: 'paw', icon: <FaPaw />, color: 'from-orange-400 to-red-400' },
  { id: 'rocket', icon: <FaRocket />, color: 'from-blue-400 to-indigo-500' },
  { id: 'car', icon: <FaCar />, color: 'from-red-400 to-rose-600' },
  { id: 'tree', icon: <FaTree />, color: 'from-green-400 to-emerald-500' },
  { id: 'smile', icon: <FaSmile />, color: 'from-yellow-400 to-amber-500' },
  { id: 'default', icon: <FaUserCircle />, color: 'from-indigo-400 to-cyan-500' },
];

// Must match db.json's grade names exactly ("Grade 1".."Grade 10") — some
// downstream lookups (e.g. dbData.grades.find(g => g.gradeName === grade))
// require an exact match, so this used to be a free-text field a typo could
// silently break (a child assigned "2nd" or "Grade2" saw an empty subject list).
const GRADE_OPTIONS = Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`);

const generatePassword = () => {
  const adjectives = ['Happy', 'Sunny', 'Brave', 'Clever', 'Fast'];
  const nouns = ['Fox', 'Lion', 'Bear', 'Tiger', 'Panda'];
  const number = Math.floor(Math.random() * 100);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
};

const AddChildForm = ({ onClose, childToEdit, onSaveSuccess }) => {
  const db = getFirestore(app);
  const [name, setName] = useState(childToEdit?.name || '');
  const [age, setAge] = useState(childToEdit?.age || '');
  const [grade, setGrade] = useState(childToEdit?.grade || '');
  const [username, setUsername] = useState(childToEdit?.username || '');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(childToEdit?.avatar || 'default');
  const [sequentialProgression, setSequentialProgression] = useState(childToEdit?.sequentialProgression !== undefined ? childToEdit.sequentialProgression : true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ status: 'idle', message: '' });
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const debouncedCheckUsernameRef = useRef(
    debounce(async (uname, currentChildToEdit) => {
      if (!uname || (currentChildToEdit && uname === currentChildToEdit.username)) {
        setUsernameStatus({ status: 'idle', message: '' });
        return;
      }
      setUsernameStatus({ status: 'checking', message: 'Checking availability...' });
      const usernameDocRef = doc(db, 'child_usernames', uname);
      const usernameDoc = await getDoc(usernameDocRef);
      setUsernameStatus(
        usernameDoc.exists()
          ? { status: 'taken', message: 'Username is taken!' }
          : { status: 'available', message: 'Username is available!' }
      );
    }, 500)
  );

  useEffect(() => {
    const debounced = debouncedCheckUsernameRef.current;
    debounced(username, childToEdit);
    return () => debounced.cancel();
  }, [username, childToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (usernameStatus.status === 'taken') {
      setError("This username is already taken. Please choose another.");
      return;
    }
    if (!password && !childToEdit) {
      setError("A password is required for a new child profile.");
      return;
    }

    setLoading(true);
    setSaveStatus(null);
    setErrorMessage('');
    const parentUid = auth.currentUser.uid;

    try {
      let childRef;
      let usernameDocRef = doc(db, 'child_usernames', username);

      if (childToEdit) {
        // Update existing
        childRef = doc(db, "users", parentUid, "children", childToEdit.id);
        const updates = { name, age: parseInt(age), grade, username, avatar: selectedAvatar, sequentialProgression };
        if (password) updates.password = password;

        if (username !== childToEdit.username) {
          const oldUsernameDocRef = doc(db, 'child_usernames', childToEdit.username);
          await runTransaction(db, async (t) => {
            const newUsernameDoc = await t.get(usernameDocRef);
            if (newUsernameDoc.exists()) throw new Error("This username is already taken.");
            t.delete(oldUsernameDocRef);
            t.set(usernameDocRef, { parentUid, childId: childToEdit.id });
            t.update(childRef, updates);
          });
        } else {
          await updateDoc(childRef, updates);
        }
        if (onSaveSuccess) onSaveSuccess({ id: childToEdit.id, ...childToEdit, ...updates });
        setSaveStatus('success');
        setErrorMessage('Child profile updated successfully!');
      } else {
        // Create new
        childRef = doc(collection(db, "users", parentUid, "children"));
        const newChildData = {
          name, age: parseInt(age), grade, username, avatar: selectedAvatar,
          password, loginEnabled: true, photoURL: '', assignedTasks: [], points: 0,
          stickers: [], progress: { overall: 0, subjects: {} }, parentUid,
          professorCharacter: 'owl', timeAlertsEnabled: true,
          sequentialProgression,
          // Screen time limits default to off — a parent opts in and sets
          // minutes from the child's Settings tab.
          timeLimits: { enabled: false, dailyMinutes: 60, weeklyMinutes: 300 },
          timeExtensionRequest: null,
        };

        await runTransaction(db, async (t) => {
          const usernameDoc = await t.get(usernameDocRef);
          if (usernameDoc.exists()) throw new Error("This username is already taken.");
          t.set(childRef, newChildData);
          t.set(usernameDocRef, { parentUid, childId: childRef.id });
        });
        if (onSaveSuccess) onSaveSuccess({ id: childRef.id, ...newChildData });
        setSaveStatus('success');
        setErrorMessage('New child profile created successfully!');
      }
      setTimeout(() => onClose(), 800); // give time to show success message
    } catch (err) {
      console.error("Error saving child:", err);
      setError(err.message || "Failed to save child. Please try again.");
      setSaveStatus('error');
      setErrorMessage(err.message || "Failed to save child. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 w-full max-w-xl mx-auto overflow-y-auto max-h-[90vh] relative scrollbar-hide"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500"></div>

      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          {childToEdit ? 'Edit Hero Profile' : 'Create Hero Profile'}
        </h2>
        <p className="text-slate-500 font-medium mt-2">Let&apos;s set up their learning adventure!</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-100 flex items-center gap-3">
              <FaTimesCircle className="flex-shrink-0" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SaveMessage status={saveStatus} message={errorMessage} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Selection */}
        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-4 text-slate-700">
            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Choose an Avatar
          </label>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {avatars.map(({ id, icon, color }) => (
              <motion.button
                type="button"
                key={id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAvatar(id)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${selectedAvatar === id
                  ? `bg-gradient-to-br ${color} text-white shadow-lg ring-4 ring-offset-2 ring-blue-300`
                  : 'bg-white text-slate-400 border-2 border-slate-200 hover:border-blue-300'
                  }`}
              >
                {icon}
                {selectedAvatar === id && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-white text-green-500 rounded-full text-sm ring-2 ring-white"
                  >
                    <FaCheckCircle />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
          <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-2 text-slate-700">
            <span className="bg-cyan-100 text-cyan-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Basic Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="childName" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">First Name</label>
              <input type="text" id="childName" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800" placeholder="e.g. Leo" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="childAge" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Age</label>
                <input type="number" id="childAge" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800" placeholder="7" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
              <div className="flex-1">
                <label htmlFor="childGrade" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Grade</label>
                <select id="childGrade" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800" value={grade} onChange={(e) => setGrade(e.target.value)} required>
                  <option value="" disabled>Select grade</option>
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
          <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-2 text-slate-700">
            <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
            Login Credentials
          </label>

          <div>
            <label htmlFor="childUsername" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Secret Username</label>
            <div className="relative">
              <input type="text" id="childUsername" className={`w-full px-4 py-3 pr-10 bg-white border-2 rounded-2xl focus:ring-0 transition-colors font-semibold text-slate-800 ${usernameStatus.status === 'taken' ? 'border-red-400 focus:border-red-500' : usernameStatus.status === 'available' ? 'border-green-400 focus:border-green-500' : 'border-slate-200 focus:border-teal-500'}`} placeholder="e.g. superleo99" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} required />
              <div className="absolute right-3 top-3.5">
                {usernameStatus.status === 'checking' && <span className="animate-spin inline-block w-5 h-5 border-2 border-slate-300 border-t-teal-500 rounded-full"></span>}
                {usernameStatus.status === 'taken' && <FaTimesCircle className="text-red-500 text-xl" />}
                {usernameStatus.status === 'available' && <FaCheckCircle className="text-green-500 text-xl" />}
              </div>
            </div>
            {usernameStatus.status !== 'idle' && usernameStatus.status !== 'checking' && (
              <p className={`text-xs font-bold mt-1.5 pl-1 ${usernameStatus.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                {usernameStatus.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="childPassword" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Password</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="childPassword"
                className="flex-grow w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-teal-500 transition-colors font-semibold text-slate-800"
                placeholder={childToEdit ? "Leave empty to keep current" : "Type or generate"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPassword(generatePassword())}
                className="px-5 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors flex items-center gap-2 group whitespace-nowrap"
              >
                <FaMagic className="group-hover:rotate-12 transition-transform text-teal-400" />
                <span className="hidden sm:inline">Magic Gen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Learning Settings */}
        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
          <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-2 text-slate-700">
            <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
            Learning Settings
          </label>

          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Sequential Progression</h4>
              <p className="text-[10px] text-slate-500 font-medium">Children must finish one level to unlock the next.</p>
            </div>
            <button
              type="button"
              onClick={() => setSequentialProgression(!sequentialProgression)}
              className={`w-14 h-8 rounded-full transition-colors relative ${sequentialProgression ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <motion.div
                animate={{ x: sequentialProgression ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`px-8 py-4 font-black rounded-2xl text-white shadow-xl shadow-blue-500/20 transition-all ${loading || usernameStatus.status === 'checking' || usernameStatus.status === 'taken' ? 'bg-slate-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/40'}`}
            disabled={loading || usernameStatus.status === 'checking' || usernameStatus.status === 'taken'}
          >
            {loading ? 'Saving...' : (childToEdit ? 'Update Hero' : 'Launch Profile!')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddChildForm;