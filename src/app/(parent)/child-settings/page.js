"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { FaUserEdit, FaLock } from 'react-icons/fa';

const SaveMessage = ({ status, message }) => {
  if (!status) return null;
  const bgColor = status === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`p-3 mt-4 text-white rounded-lg text-center ${bgColor}`}>
      {message}
    </div>
  );
};

const ChildSettingsPage = () => {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('childUser'));
    if (!user) {
      router.push('/child-login');
    } else {
      setChildUser(user);
      setFormData({ ...formData, username: user.username });
    }
  }, [router, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setSaveStatus('error');
      setErrorMessage('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const childDocRef = doc(db, 'users', childUser.parentUid, 'children', childUser.id);
      const dataToUpdate = { username: formData.username };
      if (formData.newPassword) {
        dataToUpdate.password = formData.newPassword; // In a real app, hash this
      }
      await updateDoc(childDocRef, dataToUpdate);
      setSaveStatus('success');
      setErrorMessage('Settings saved successfully!');
      const updatedUser = { ...childUser, ...dataToUpdate };
      setChildUser(updatedUser);
      sessionStorage.setItem('childUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus('error');
      setErrorMessage('Failed to save settings.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (!childUser) return <div>Loading...</div>;

  const profileFields = [childUser.name, childUser.age, childUser.grade, childUser.gender, childUser.username, childUser.photoURL];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletionPercentage = Math.round((filledFields / profileFields.length) * 100);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Completion</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: `${profileCompletionPercentage}%` }}></div>
        </div>
        <p className="text-center mt-2">{profileCompletionPercentage}% Complete</p>
      </div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><FaUserEdit className="mr-2" /> Edit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-md font-medium text-gray-700 mb-2">Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><FaLock className="mr-2" /> Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentPassword"  className="block text-md font-medium text-gray-700 mb-2">Current Password</label>
              <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="newPassword"  className="block text-md font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="confirmPassword"  className="block text-md font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>
        </div>
        <div className="text-right mt-8">
          <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        <SaveMessage status={saveStatus} message={errorMessage} />
      </form>
    </div>
  );
};

export default ChildSettingsPage;