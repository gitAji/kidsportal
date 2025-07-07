import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';

const AddChildForm = ({ onClose, kidToEdit }) => {
  const [name, setName] = useState(kidToEdit ? kidToEdit.name : '');
  const [age, setAge] = useState(kidToEdit ? kidToEdit.age : '');
  const [grade, setGrade] = useState(kidToEdit ? kidToEdit.grade : '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (kidToEdit) {
      setName(kidToEdit.name);
      setAge(kidToEdit.age);
      setGrade(kidToEdit.grade);
    }
  }, [kidToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser) {
      setError("No user logged in.");
      return;
    }

    try {
      const parentUid = auth.currentUser.uid;
      if (kidToEdit) {
        // Update existing child
        const kidDocRef = doc(db, 'users', parentUid, 'kids', kidToEdit.id);
        await updateDoc(kidDocRef, {
          name,
          age: parseInt(age),
          grade,
        });
        alert('Child updated successfully!');
      } else {
        // Add new child
        const kidsCollectionRef = collection(db, 'users', parentUid, 'kids');
        await addDoc(kidsCollectionRef, {
          name,
          age: parseInt(age),
          grade,
          assignedTasks: 0,
          tasksCompleted: 0,
          progress: 0,
        });
        alert('Child added successfully!');
      }
      onClose();
    } catch (err) {
      console.error("Error saving child:", err);
      setError("Failed to save child. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{kidToEdit ? 'Edit Child' : 'Add New Child'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="childName" className="block text-gray-700 text-sm font-bold mb-2">Child's Name:</label>
            <input
              type="text"
              id="childName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter child's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="childAge" className="block text-gray-700 text-sm font-bold mb-2">Child's Age:</label>
            <input
              type="number"
              id="childAge"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter child's age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="childGrade" className="block text-gray-700 text-sm font-bold mb-2">Child's Grade:</label>
            <input
              type="text"
              id="childGrade"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter child's grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {kidToEdit ? 'Update Child' : 'Add Child'}
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
