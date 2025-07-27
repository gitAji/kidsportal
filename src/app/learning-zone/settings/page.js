"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebase/config';
import { getFirestore } from 'firebase/firestore';
import KidFriendlyLoader from '../../components/ui/KidFriendlyLoader';
import { FaArrowLeft, FaPalette, FaUserCircle, FaSave, FaPaw, FaRocket, FaCar, FaTree, FaSmile } from 'react-icons/fa';
import CustomAvatar from '../../components/ui/CustomAvatar';
import SaveMessage from '../../components/ui/SaveMessage';
import { useChild } from '../../providers/ChildProvider'; // Import the context hook

const themes = [
  { id: 'default', name: 'Default', colors: { primary: '#3B82F6', background: '#DBEAFE' } }, // blue-600, blue-100
  { id: 'green', name: 'Forest Green', colors: { primary: '#10B981', background: '#D1FAE5' } }, // emerald-500, emerald-100
  { id: 'purple', name: 'Royal Purple', colors: { primary: '#8B5CF6', background: '#EDE9FE' } }, // violet-500, violet-100
  { id: 'orange', name: 'Sunset Orange', colors: { primary: '#F97316', background: '#FFEDD5' } }, // orange-500, orange-100
];

const avatars = [
  { id: 'paw', icon: <FaPaw /> }, // Assuming FaPaw is imported or available
  { id: 'rocket', icon: <FaRocket /> },
  { id: 'car', icon: <FaCar /> },
  { id: 'tree', icon: <FaTree /> },
  { id: 'smile', icon: <FaSmile /> },
  { id: 'default', icon: <FaUserCircle /> },
];

export default function SettingsPage() {
  const db = getFirestore(app);
  const { childUser, setChildUser: setGlobalChildUser } = useChild(); // Get childUser and the setter from context
  const [selectedAvatar, setSelectedAvatar] = useState('default');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (childUser) {
      setSelectedAvatar(childUser.avatar || 'default');
      setSelectedTheme(childUser.theme || 'default');
    }
  }, [childUser]);

  const handleSaveChanges = async () => {
    setSaveStatus(null);
    setErrorMessage('');

    if (!childUser) {
      setSaveStatus('error');
      setErrorMessage('No child user data found.');
      return;
    }

    try {
      const childDocRef = doc(db, 'users', childUser.parentUid, 'children', childUser.id);
      const updates = {
        avatar: selectedAvatar,
        theme: selectedTheme,
      };
      await updateDoc(childDocRef, updates);

      const updatedChild = { ...childUser, ...updates };
      // Update both local storage (if rememberMe was checked) and global context
      if (localStorage.getItem("childUser")) {
        localStorage.setItem("childUser", JSON.stringify(updatedChild));
      } else if (sessionStorage.getItem("childUser")) {
        sessionStorage.setItem("childUser", JSON.stringify(updatedChild));
      }
      setGlobalChildUser(updatedChild); // Update the global state

      setSaveStatus('success');
      setErrorMessage('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to save settings.');
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (!childUser) return <KidFriendlyLoader />;

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Settings</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center"><FaUserCircle className="mr-2" /> Change Avatar</h2>
        <div className="flex justify-center gap-4 mb-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl transition-all duration-200
                ${selectedAvatar === avatar.id ? 'bg-blue-500 text-white ring-4 ring-blue-300' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            >
              {avatar.icon}
            </button>
          ))}
        </div>
        <div className="text-center">
          <CustomAvatar child={{ ...childUser, avatar: selectedAvatar }} size={96} className="mx-auto" />
          <p className="text-gray-600 mt-2">Current Avatar</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center"><FaPalette className="mr-2" /> Choose Theme</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`p-4 rounded-lg shadow-md text-center transition-all duration-200
                ${selectedTheme === theme.id ? 'ring-4 ring-blue-300 border-blue-500' : 'border border-gray-200 hover:shadow-lg'}`}
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary,
              }}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: theme.colors.primary }}
              ></div>
              <p className="text-gray-800 font-medium">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleSaveChanges}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center mx-auto"
          disabled={loading}
        >
          {loading ? 'Saving...' : <><FaSave className="mr-2" /> Save Changes</>}
        </button>
        <SaveMessage status={saveStatus} message={errorMessage} />
      </div>
    </div>
  );
}
