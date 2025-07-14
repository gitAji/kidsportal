import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';

const AddChildForm = ({ onClose, childToEdit, onSaveSuccess }) => {
  const [name, setName] = useState(childToEdit ? childToEdit.name : '');
  const [age, setAge] = useState(childToEdit ? childToEdit.age : '');
  const [grade, setGrade] = useState(childToEdit ? childToEdit.grade : '');
  const [username, setUsername] = useState(childToEdit ? childToEdit.username : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (childToEdit) {
      setName(childToEdit.name);
      setAge(childToEdit.age);
      setGrade(childToEdit.grade);
      setUsername(childToEdit.username);
    }
  }, [childToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!auth.currentUser) {
      setError("No user logged in.");
      return;
    }

    try {
      const parentUid = auth.currentUser.uid;
      const childData = {
        name,
        age: parseInt(age),
        grade,
        username,
      };

      if (password) {
        childData.password = password; 
      }

      if (childToEdit) {
        const childDocRef = doc(db, 'users', parentUid, 'children', childToEdit.id);
        await updateDoc(childDocRef, childData);
        setSuccessMessage('Child updated successfully!');
      } else {
        const childrenCollectionRef = collection(db, 'users', parentUid, 'children');
        await addDoc(childrenCollectionRef, {
          ...childData,
          assignedTasks: [], // Initialize as an empty array
          tasksCompleted: 0,
          progress: { // Initialize as an object
            overall: 0,
            subjects: {}
          },
        });
        setSuccessMessage('Child added successfully!');
      }
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving child:", err);
      setError("Failed to save child. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{childToEdit ? 'Edit Child' : 'Add New Child'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="childName" className="block text-[var(--foreground)] text-sm font-bold mb-2">Child&apos;s Name:</label>
            <input
              type="text"
              id="childName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter child's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="childAge" className="block text-gray-700 text-sm font-bold mb-2">Child&apos;s Age:</label>
            <input
              type="number"
              id="childAge"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter child's age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="childGrade" className="block text-gray-700 text-sm font-bold mb-2">Child&apos;s Grade:</label>
            <input
              type="text"
              id="childGrade"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter child's grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="childUsername" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
            <input
              type="text"
              id="childUsername"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter a username for the child"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="childPassword" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              id="childPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
              placeholder={childToEdit ? "Leave blank to keep current password" : "Enter a password for the child"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {childToEdit ? 'Update Child' : 'Add Child'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildForm;