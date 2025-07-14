import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';

const ChildrenList = ({ onChildCardClick, onEditChild, onDeleteChild }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      setError("No user logged in.");
      return;
    }

    const parentUid = auth.currentUser.uid;
    const childrenCollectionRef = collection(db, 'users', parentUid, 'children');
    const q = query(childrenCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const childrenData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChildren(childrenData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching children:", err);
      setError("Failed to load children data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading children...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (children.length === 0) {
    return <p className="text-gray-700">No children added yet. Click &quot;Add Child&quot; to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children.map((child) => {
        const assignedTasksCount = child.assignedTasks ? child.assignedTasks.length : 0;
        const completedTasksCount = child.assignedTasks ? child.assignedTasks.filter(task => task.status === 'completed').length : 0;
        const overallProgress = child.progress ? child.progress.overall : 0;

        return (
          <div key={child.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{child.name}</h3>
            <p className="text-gray-700">Age: {child.age}</p>
            <p className="text-gray-700">Grade: {child.grade}</p>
            <div className="mt-4">
              <p className="text-gray-700">Assigned Tasks: {assignedTasksCount}</p>
              <p className="text-gray-700">Tasks Completed: {completedTasksCount}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm mt-1">Progress: {overallProgress}%</p>
            </div>
            <div className="mt-4 flex justify-between space-x-2">
              <button
                onClick={() => onEditChild(child)}
                className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteChild(child.id)}
                className="flex-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => onChildCardClick(child)}
                className="flex-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                View Profile
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChildrenList;