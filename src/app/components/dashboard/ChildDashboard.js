import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from '../../../firebase/auth';
import SkeletonLoader from '../ui/SkeletonLoader';
import AddChildForm from './AddChildForm';
import { FaEdit, FaTrash, FaUser, FaChartLine, FaTasks, FaCog, FaUpload, FaSignInAlt, FaShieldAlt, FaTrophy, FaStar, FaKey, FaEye, FaEyeSlash, FaUserLock, FaFilePdf, FaExclamationTriangle, FaClipboard } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import RewardsDisplay from './RewardsDisplay';
import ProgressTracker from './ProgressTracker';
import StickerBook from './StickerBook';
import Reports from './Reports';
import Modal from '../ui/Modal';
import { debounce } from 'lodash';

const SaveMessage = ({ status, message }) => {
  if (!status) return null;
  const bgColor = status === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`p-3 mt-4 text-white rounded-lg text-center ${bgColor}`}>
      {message}
    </div>
  );
};

const ChildDashboard = ({ child, onDelete, onClose }) => {
  const [currentView, setCurrentView] = useState('details');
  const [activeTab, setActiveTab] = useState('about');
  const [childData, setChildData] = useState(child);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  const fileInputRef = useRef(null);

  const checkUsernameAvailability = useCallback(debounce(async (name) => {
    if (!name || name === child.username) {
      setUsernameStatus({ status: 'idle', message: '' });
      return;
    }
    setUsernameStatus({ status: 'checking', message: 'Checking...' });
    const usernameDocRef = doc(db, 'child_usernames', name);
    const usernameDoc = await getDoc(usernameDocRef);
    if (usernameDoc.exists()) {
      setUsernameStatus({ status: 'taken', message: 'Username is already taken.' });
    } else {
      setUsernameStatus({ status: 'available', message: 'Username is available!' });
    }
  }, 500), [child.username]);

  useEffect(() => {
    setChildData(child);
    setUsername(child?.username || '');
    setLoginEnabled(child?.loginEnabled ?? true);
    setCurrentView('details');
    setActiveTab('about');
  }, [child]);

  useEffect(() => {
    checkUsernameAvailability(username);
  }, [username, checkUsernameAvailability]);

  const handleEditClick = () => setCurrentView('edit');
  const handleDeleteClick = () => setCurrentView('deleteConfirm');
  const handleCancel = () => setCurrentView('details');
  const handleSaveSuccess = () => setCurrentView('details');

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const usernameDocRef = doc(db, 'child_usernames', childData.username);
      await deleteDoc(usernameDocRef);
      await onDelete(childData.id);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error deactivating child:", error);
      setLoading(false);
      alert("Failed to deactivate child. Please try again.");
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_pictures/${childData.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      const childDocRef = doc(db, 'users', auth.currentUser.uid, 'children', childData.id);
      await updateDoc(childDocRef, { photoURL });
      setChildData({ ...childData, photoURL });
      setSaveStatus('success');
      setErrorMessage('Profile picture updated successfully!');
    } catch (error) {
      console.error("Error uploading file:", error);
      setSaveStatus('error');
      setErrorMessage('Failed to upload profile picture.');
    } finally {
      setUploading(false);
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
        setErrorMessage('Username is already taken. Please choose another one.');
        setTimeout(() => setSaveStatus(null), 3000);
        return;
    }

    setLoading(true);
    setSaveStatus(null);
    try {
      const parentUid = auth.currentUser.uid;
      const childDocRef = doc(db, 'users', parentUid, 'children', childData.id);
      const dataToUpdate = {
        username,
        loginEnabled,
      };

      if (newPassword) {
        dataToUpdate.password = newPassword;
      }

      if (username !== childData.username) {
        const oldUsernameDocRef = doc(db, 'child_usernames', childData.username);
        await deleteDoc(oldUsernameDocRef);
        const newUsernameDocRef = doc(db, 'child_usernames', username);
        await setDoc(newUsernameDocRef, { parentUid, childId: childData.id });
      }

      await updateDoc(childDocRef, dataToUpdate);
      setChildData({ ...childData, ...dataToUpdate });
      setSaveStatus('success');
      setErrorMessage('Settings updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error updating settings:", error);
      setSaveStatus('error');
      setErrorMessage('Failed to update settings.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
  };

  if (loading) return <SkeletonLoader />;
  if (!childData) return <div>No Child Data Available</div>;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100">
      <div className={`flex transition-transform duration-500 ease-in-out h-full ${currentView === 'details' ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-full flex-shrink-0 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome, {childData.name}!</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-500">
                <FaTrophy className="text-2xl" />
                <span className="text-xl font-bold ml-2">{childData.points || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold">
                {childData.photoURL ? <Image src={childData.photoURL} alt={childData.name} width={48} height={48} className="w-full h-full rounded-full object-cover" /> : childData.name.charAt(0)}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {['about', 'reports', 'progress', 'rewards', 'stickers', 'settings'].map(tab => (
                <li key={tab} className="me-2">
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'about' && <FaUser className="mr-2" />}
                    {tab === 'reports' && <FaFilePdf className="mr-2" />}
                    {tab === 'progress' && <FaChartLine className="mr-2" />}
                    {tab === 'rewards' && <FaTrophy className="mr-2" />}
                    {tab === 'stickers' && <FaStar className="mr-2" />}
                    {tab === 'settings' && <FaCog className="mr-2" />}
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
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-5xl font-bold mr-4">
                    {childData.photoURL ? <Image src={childData.photoURL} alt={childData.name} width={96} height={96} className="w-full h-full rounded-full object-cover" /> : childData.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{childData.name}</h3>
                    <p>Age: {childData.age}</p>
                    <p>Grade: {childData.grade}</p>
                  </div>
                </div>
                <button onClick={handleEditClick} className="text-gray-500 hover:text-blue-600">
                  <FaEdit className="text-2xl" />
                </button>
              </div>
              <div className="mt-4">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                <button onClick={handleUploadClick} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center" disabled={uploading}>
                  <FaUpload className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end gap-4">
                <button onClick={() => setShowLoginHelper(true)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center">
                  <FaSignInAlt className="mr-2" /> Login as {childData.name}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <Reports childData={childData} />
          )}

          {activeTab === 'progress' && (
            <ProgressTracker progress={childData.progress} />
          )}

          {activeTab === 'rewards' && (
            <RewardsDisplay points={childData.points || 0} />
          )}

          {activeTab === 'stickers' && (
            <StickerBook stickers={childData.stickers} />
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSave}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-6">Settings & Controls</h3>
                
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center"><FaUserLock className="mr-2" /> Account Access</h4>
                  <div className="flex items-center justify-between">
                    <label htmlFor="loginEnabled" className="block text-md font-medium text-gray-700">Enable Child Login</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        name="loginEnabled" 
                        id="loginEnabled" 
                        checked={loginEnabled}
                        onChange={() => setLoginEnabled(!loginEnabled)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label htmlFor="loginEnabled" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
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
                      <label htmlFor="currentPassword"  className="block text-md font-medium text-gray-700 mb-2">Current Password</label>
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
                      <label htmlFor="newPassword"  className="block text-md font-medium text-gray-700 mb-2">New Password</label>
                      <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword"  className="block text-md font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center"><FaShieldAlt className="mr-2" /> Legal</h4>
                  <div className="flex items-center">
                    <input type="checkbox" className="form-checkbox" checked readOnly disabled />
                    <span className="ml-2 text-sm text-gray-700">
                      You agreed to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      {" "}when creating this profile.
                    </span>
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
        {currentView === 'edit' && (
          <div className="w-full flex-shrink-0 p-4 md:p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Edit {childData.name}</h2>
            <AddChildForm childToEdit={childData} onClose={handleCancel} onSaveSuccess={handleSaveSuccess} />
          </div>
        )}
        {currentView === 'deleteConfirm' && (
          <div className="w-full flex-shrink-0 p-4 md:p-6 flex flex-col items-center justify-center text-center h-full">
            <FaTrash className="text-red-500 text-6xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-700 mb-6">Do you really want to deactivate {childData.name}&apos;s profile? This process cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button onClick={handleConfirmDelete} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Confirm Deactivation</button>
              <button onClick={handleCancel} className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {showLoginHelper && (
        <Modal onClose={() => setShowLoginHelper(false)}>
          <div className="p-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Child Login Helper</h3>
            <p className="text-gray-600 mb-4">
              For security, please open a new **Incognito or Private Window** in your browser to log in as your child. This keeps your parent session active.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Username:</span>
                <code>{childData.username}</code>
                <button onClick={() => copyToClipboard(childData.username)} className="text-gray-500 hover:text-blue-600 p-1"><FaClipboard /></button>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Password:</span>
                <code>{childData.password}</code>
                <button onClick={() => copyToClipboard(childData.password)} className="text-gray-500 hover:text-blue-600 p-1"><FaClipboard /></button>
              </div>
            </div>
            <a href="/child-login" target="_blank" rel="noopener noreferrer" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Go to Child Login Page
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChildDashboard;
