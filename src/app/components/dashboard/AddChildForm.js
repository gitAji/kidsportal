import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, runTransaction } from 'firebase/firestore';
import { auth } from '../../../firebase/auth'; // Import auth to get current user UID
import { app } from '../../../firebase/config';
import { getFirestore } from 'firebase/firestore';
import { FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile } from 'react-icons/fa';
import { debounce } from 'lodash';
import SaveMessage from '../ui/SaveMessage'; // Import SaveMessage


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
  const db = getFirestore(app);
  const [name, setName] = useState(childToEdit?.name || '');
  const [age, setAge] = useState(childToEdit?.age || '');
  const [grade, setGrade] = useState(childToEdit?.grade || '');
  const [username, setUsername] = useState(childToEdit?.username || '');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(childToEdit?.avatar || 'default');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ status: 'idle', message: '' });
  const [saveStatus, setSaveStatus] = useState(null); // Add saveStatus
  const [errorMessage, setErrorMessage] = useState(''); // Add errorMessage

  const debouncedCheckUsernameRef = useRef(
    debounce(async (uname, currentChildToEdit) => {
      if (!uname || (currentChildToEdit && uname === currentChildToEdit.username)) {
        setUsernameStatus({ status: 'idle', message: '' });
        return;
      }
      setUsernameStatus({ status: 'checking', message: 'Checking...' });
      const usernameDocRef = doc(db, 'child_usernames', uname);
      const usernameDoc = await getDoc(usernameDocRef);
      setUsernameStatus(
        usernameDoc.exists()
          ? { status: 'taken', message: 'Username is already taken.' }
          : { status: 'available', message: 'Username is available!' }
      );
    }, 500)
  );

  useEffect(() => {
    const debounced = debouncedCheckUsernameRef.current;
    debounced(username, childToEdit);
    return () => {
      debounced.cancel();
    };
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
    setSaveStatus(null); // Clear previous status
    setErrorMessage(''); // Clear previous error message
    const parentUid = auth.currentUser.uid; // Get the current parent's UID

    try {
      let childRef;
      let usernameDocRef = doc(db, 'child_usernames', username);

      if (childToEdit) {
        // Update existing child
        childRef = doc(db, "users", parentUid, "children", childToEdit.id);
        const updates = {
          name,
          age: parseInt(age),
          grade,
          username,
          avatar: selectedAvatar,
        };
        if (password) {
          updates.password = password;
        }

        if (username !== childToEdit.username) {
          // Username changed, perform transaction
          const oldUsernameDocRef = doc(db, 'child_usernames', childToEdit.username);
          await runTransaction(db, async (t) => {
            const newUsernameDoc = await t.get(usernameDocRef);
            if (newUsernameDoc.exists()) {
              throw new Error("This username is already taken.");
            }
            t.delete(oldUsernameDocRef);
            t.set(usernameDocRef, { parentUid, childId: childToEdit.id });
            t.update(childRef, updates);
          });
        } else {
          // No username change, just update child document
          await updateDoc(childRef, updates);
        }
        if (onSaveSuccess) {
          onSaveSuccess({ id: childToEdit.id, ...childToEdit, ...updates }); // Pass updated child data
        }
        setSaveStatus('success');
        setErrorMessage('Child profile updated successfully!');
      } else {
        // Create new child
        childRef = doc(collection(db, "users", parentUid, "children")); // Generate a new ID within the children subcollection
        const newChildData = {
          name,
          age: parseInt(age),
          grade,
          username,
          avatar: selectedAvatar,
          password,
          loginEnabled: true,
          photoURL: '',
          assignedTasks: [],
          points: 0,
          stickers: [],
          progress: { overall: 0, subjects: {} },
          parentUid, // Store parentUid in child document
        };

        await runTransaction(db, async (t) => {
          const usernameDoc = await t.get(usernameDocRef);
          if (usernameDoc.exists()) {
            throw new Error("This username is already taken.");
          }
          t.set(childRef, newChildData);
          t.set(usernameDocRef, { parentUid, childId: childRef.id });
        });
        if (onSaveSuccess) {
          onSaveSuccess({ id: childRef.id, ...newChildData });
        }
        setSaveStatus('success');
        setErrorMessage('New child profile created successfully!');
      }
      onClose();
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
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {childToEdit ? 'Edit Child Profile' : 'Create a New Profile'}
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <SaveMessage status={saveStatus} message={errorMessage} />
      
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
            <input type="text" id="childName" className="form-input w-full px-4 py-2 border border-gray-300 rounded-md" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="childAge" className="block text-sm font-bold mb-1 text-gray-700">Age</label>
            <input type="number" id="childAge" className="form-input w-full px-4 py-2 border border-gray-300 rounded-md" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>
        </div>
        
        <div>
          <label htmlFor="childGrade" className="block text-sm font-bold mb-1 text-gray-700">Grade</label>
          <input type="text" id="childGrade" className="form-input w-full px-4 py-2 border border-gray-300 rounded-md" value={grade} onChange={(e) => setGrade(e.target.value)} required />
        </div>
        
        <hr className="my-4"/>

        <div>
          <label htmlFor="childUsername" className="block text-sm font-bold mb-1 text-gray-700">Username</label>
          <input type="text" id="childUsername" className="form-input w-full px-4 py-2 border border-gray-300 rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} required />
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
              className="form-input flex-grow w-full px-4 py-2 border border-gray-300 rounded-md" 
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