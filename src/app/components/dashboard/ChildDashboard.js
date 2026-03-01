import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { app } from '../../../firebase/config';
import { getFirestore } from 'firebase/firestore';
import SkeletonLoader from '../ui/SkeletonLoader';
import AddChildForm from './AddChildForm';
import { FaEdit, FaUser, FaChartLine, FaTasks, FaCog, FaSignInAlt, FaTrophy, FaStar, FaKey, FaEye, FaEyeSlash, FaUserLock, FaFilePdf, FaExclamationTriangle, FaClipboard } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import RewardsDisplay from './RewardsDisplay';
import ProgressTracker from './ProgressTracker';
import StickerBook from './StickerBook';
import Reports from './Reports';
import Modal from '../ui/Modal';
import CustomAvatar from '../ui/CustomAvatar';
import SaveMessage from '../ui/SaveMessage'; // Import SaveMessage
import { debounce } from 'lodash';




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
    setCurrentView('details');
    setActiveTab('about');
  }, [child]);

  useEffect(() => {
    const debounced = debouncedCheckUsernameAvailabilityRef.current;
    debounced(username, child);
    return () => {
      debounced.cancel();
    };
  }, [username, child]);

  const handleEditClick = () => setCurrentView('edit');
  const handleDeleteClick = async () => {
    if (!confirm(`Are you sure you want to deactivate ${childData.name}'s account? This action cannot be undone.`)) {
      return;
    }

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
      onClose(); // Close the dashboard after deletion
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
    setLoginEnabled(newStatus); // Update UI immediately

    try {
      const childDocRef = doc(db, "users", childData.parentUid, "children", childData.id);
      await updateDoc(childDocRef, { loginEnabled: newStatus });

      // Update state and session storage on success
      const updatedData = { ...childData, loginEnabled: newStatus };
      setChildData(updatedData);
      sessionStorage.setItem('childUser', JSON.stringify(updatedData));
      setSaveStatus('success');
      setErrorMessage('Login status updated successfully!');
    } catch (error) {
      console.error("Failed to update login status:", error);
      setLoginEnabled(!newStatus); // Revert UI on failure
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
      const updates = {
        username,
        loginEnabled,
      };

      if (newPassword) {
        updates.password = newPassword;
      }

      if (username !== childData.username) {
        // Username is changing, perform a transaction
        const oldUsernameDocRef = doc(db, 'child_usernames', childData.username);
        const newUsernameDocRef = doc(db, 'child_usernames', username);

        await runTransaction(db, async (t) => {
          const newUsernameDoc = await t.get(newUsernameDocRef);
          if (newUsernameDoc.exists()) {
            throw new Error("This username is already taken.");
          }
          t.delete(oldUsernameDocRef);
          t.set(newUsernameDocRef, { parentUid: childData.parentUid, childId: childData.id });
          t.update(childDocRef, updates);
        });
      } else {
        // No username change, just update the child document
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
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  if (loading) return <SkeletonLoader />;
  if (!childData) return <div>No Child Data Available</div>;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-r from-blue-100 to-cyan-100">
      {currentView === 'details' ? (
        <div className="w-full flex-shrink-0 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Manage {childData.name}&apos;s Profile</h2>
          </div>
          <div className="mb-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {['about', 'reports', 'progress', 'rewards', 'stickers', 'settings'].map(tab => (
                <li key={tab} className="me-2">
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {/* Icons */}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {activeTab === 'about' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <CustomAvatar child={childData} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{childData.name}</h3>
                    <p>Age: {childData.age}</p>
                    <p>Grade: {childData.grade}</p>
                  </div>
                </div>
                <button onClick={() => setCurrentView('edit')} className="text-gray-500 hover:text-blue-600">
                  <FaEdit className="text-2xl" />
                </button>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end gap-4">
                <button onClick={() => setShowLoginHelper(true)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center">
                  <FaSignInAlt className="mr-2" /> Login as {childData.name}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && <Reports childData={childData} />}
          {activeTab === 'progress' && <ProgressTracker child={childData} />}
          {activeTab === 'rewards' && <RewardsDisplay points={childData.points || 0} />}
          {activeTab === 'stickers' && <StickerBook collectedStickerIds={childData.stickers} />}

          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSave}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-6">Settings & Controls</h3>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center"><FaUserLock className="mr-2" /> Account Access</h4>
                  <div className="flex items-center justify-between">
                    <label htmlFor="loginEnabled" className="block text-md font-medium text-gray-700">Enable Child Login</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="loginEnabled"
                        className="sr-only peer"
                        checked={loginEnabled}
                        onChange={(e) => handleToggleLogin(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center"><FaKey className="mr-2" /> Login Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-md font-medium text-gray-700 mb-2">Username</label>
                      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
                      {usernameStatus.status !== 'idle' && (
                        <p className={`text-sm mt-1 ${usernameStatus.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {usernameStatus.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="currentPassword" className="block text-md font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          value={childData.password || 'Not Set'}
                          readOnly
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-md font-medium text-gray-700 mb-2">New Password</label>
                      <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-md font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>

                <div className="text-right mt-6">
                  <button type="submit" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700" disabled={loading || usernameStatus.status === 'checking' || usernameStatus.status === 'taken'}>
                    {loading ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
                <SaveMessage status={saveStatus} message={errorMessage} />

                <div className="mt-10 pt-6 border-t border-red-300">
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center text-red-600"><FaExclamationTriangle className="mr-2" /> Danger Zone</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Deactivate this account</p>
                      <p className="text-sm text-gray-600">Once you deactivate this account, it cannot be undone.</p>
                    </div>
                    <button type="button" onClick={handleDeleteClick} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="w-full flex-shrink-0 p-4 md:p-6">
          <h2 className="text-3xl font-bold text-center mb-6">Edit {childData.name}</h2>
          <AddChildForm childToEdit={childData} onClose={handleCancel} onSaveSuccess={handleSaveSuccess} />
        </div>
      )}

      {showLoginHelper && (
        <Modal onClose={() => setShowLoginHelper(false)}>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
              <FaSignInAlt />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Login Details for {childData.name}</h3>
            <p className="text-slate-500 mb-8 font-medium">Use these credentials to sign in as your learner.</p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Username</p>
              <p className="text-2xl font-black text-blue-600">{childData.username}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const storage = localStorage; // Use localStorage for consistent login
                  storage.setItem("childUser", JSON.stringify(childData));
                  router.push("/learning-zone");
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <FaSignInAlt className="group-hover:translate-x-1 transition-transform" /> Launch Student Zone
              </button>
              <button
                onClick={() => {
                  copyToClipboard(childData.username);
                }}
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
