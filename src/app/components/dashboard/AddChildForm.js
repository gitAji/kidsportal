import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile } from 'react-icons/fa';
import { debounce } from 'lodash';

const avatars = [
  { id: 'paw', icon: <FaPaw /> },
  { id: 'rocket', icon: <FaRocket /> },
  { id: 'car', icon: <FaCar /> },
  { id: 'tree', icon: <FaTree /> },
  { id: 'smile', icon: <FaSmile /> },
  { id: 'default', icon: <FaUserCircle /> },
];

const generatePassword = () => {
  const adjectives = ['Happy', 'Sunny', 'Brave', 'Clever', 'Gentle'];
  const nouns = ['Fox', 'Lion', 'Bear', 'Tiger', 'Panda'];
  const number = Math.floor(Math.random() * 100);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
};

const AddChildForm = ({ onClose, childToEdit, onSaveSuccess }) => {
  const [name, setName] = useState(childToEdit?.name || '');
  const [age, setAge] = useState(childToEdit?.age || '');
  const [grade, setGrade] = useState(childToEdit?.grade || '');
  const [username, setUsername] = useState(childToEdit?.username || '');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(childToEdit?.avatar || 'default');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ status: 'idle', message: '' });

  const checkUsername = useCallback(debounce(async (uname) => {
    if (!uname) {
      setUsernameStatus({ status: 'idle', message: '' });
      return;
    }
    if (childToEdit && uname === childToEdit.username) {
      setUsernameStatus({ status: 'idle', message: '' });
      return;
    }
    setUsernameStatus({ status: 'checking', message: 'Checking...' });
    const usernameDocRef = doc(db, 'child_usernames', uname);
    const usernameDoc = await getDoc(usernameDocRef);
    if (usernameDoc.exists()) {
      setUsernameStatus({ status: 'taken', message: 'Username is already taken.' });
    } else {
      setUsernameStatus({ status: 'available', message: 'Username is available!' });
    }
  }, 500), [childToEdit]);

  useEffect(() => {
    checkUsername(username);
  }, [username, checkUsername]);

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

    if (!auth.currentUser) {
      setError("No user logged in.");
      setLoading(false);
      return;
    }

    try {
      const parentUid = auth.currentUser.uid;
      const childData = { 
        name, 
        age: parseInt(age), 
        grade, 
        username,
        avatar: selectedAvatar,
        loginEnabled: true,
      };

      if (password) {
        childData.password = password; 
      }

      if (childToEdit) {
        // If username is changed, we need to update the usernames collection
        if (username !== childToEdit.username) {
          const oldUsernameDocRef = doc(db, 'child_usernames', childToEdit.username);
          await deleteDoc(oldUsernameDocRef);
          const newUsernameDocRef = doc(db, 'child_usernames', username);
          await setDoc(newUsernameDocRef, { parentUid, childId: childToEdit.id });
        }
        const childDocRef = doc(db, 'users', parentUid, 'children', childToEdit.id);
        await updateDoc(childDocRef, childData);
      } else {
        const childrenCollectionRef = collection(db, 'users', parentUid, 'children');
        const newChildDoc = await addDoc(childrenCollectionRef, {
          ...childData,
          photoURL: '',
          assignedTasks: [],
          points: 0,
          stickers: [],
          progress: { overall: 0, subjects: {} },
        });
        // Create entry in the usernames collection
        const usernameDocRef = doc(db, 'child_usernames', username);
        await setDoc(usernameDocRef, { parentUid, childId: newChildDoc.id });
      }
      
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving child:", err);
      setError("Failed to save child. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {childToEdit ? 'Edit Child Profile' : 'Create a New Profile'}
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <label className="block text-sm font-bold mb-2 text-gray-700">Choose an Avatar</label>
          <div className="flex justify-center gap-3 sm:gap-4">
            {avatars.map(({ id, icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => setSelectedAvatar(id)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-3xl transition-all duration-200 ${
                  selectedAvatar === id ? 'bg-blue-500 text-white ring-4 ring-blue-300' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="childName" className="block text-sm font-bold mb-1 text-gray-700">Name</label>
            <input type="text" id="childName" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="childAge" className="block text-sm font-bold mb-1 text-gray-700">Age</label>
            <input type="number" id="childAge" className="form-input" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>
        </div>
        
        <div>
          <label htmlFor="childGrade" className="block text-sm font-bold mb-1 text-gray-700">Grade</label>
          <input type="text" id="childGrade" className="form-input" value={grade} onChange={(e) => setGrade(e.target.value)} required />
        </div>
        
        <hr className="my-4"/>

        <div>
          <label htmlFor="childUsername" className="block text-sm font-bold mb-1 text-gray-700">Username</label>
          <input type="text" id="childUsername" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          {usernameStatus.status !== 'idle' && (
            <p className={`text-sm mt-1 ${usernameStatus.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
              {usernameStatus.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="childPassword" className="block text-sm font-bold mb-1 text-gray-700">Password</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              id="childPassword" 
              className="form-input flex-grow" 
              placeholder={childToEdit ? "Leave blank to keep current" : "Click generate or type a password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
              type="button" 
              onClick={() => setPassword(generatePassword())}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            disabled={loading || usernameStatus.status === 'checking' || usernameStatus.status === 'taken'}
          >
            {loading ? 'Saving...' : (childToEdit ? 'Update Profile' : 'Create Profile')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChildForm;