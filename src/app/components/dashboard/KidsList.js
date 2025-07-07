import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';

const KidsList = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      setError("No user logged in.");
      return;
    }

    const parentUid = auth.currentUser.uid;
    const kidsCollectionRef = collection(db, 'users', parentUid, 'kids');
    const q = query(kidsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kidsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setKids(kidsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching kids:", err);
      setError("Failed to load kids data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading kids...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (kids.length === 0) {
    return <p className="text-gray-700">No kids added yet. Click "Add Child" to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kids.map((kid) => (
        <div key={kid.id} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{kid.name}</h3>
          <p className="text-gray-700">Age: {kid.age}</p>
          <p className="text-gray-700">Grade: {kid.grade}</p>
          <div className="mt-4">
            <p className="text-gray-700">Assigned Tasks: {kid.assignedTasks || 0}</p>
            <p className="text-gray-700">Tasks Completed: {kid.tasksCompleted || 0}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${kid.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-gray-700 text-sm mt-1">Progress: {kid.progress || 0}%</p>
          </div>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            View Profile
          </button>
        </div>
      ))}
    </div>
  );
};

export default KidsList;