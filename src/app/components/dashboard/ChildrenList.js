'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const handleChildClick = (child) => {
    sessionStorage.setItem('childUser', JSON.stringify(child));
    router.push('/child-dashboard');
  };

  if (loading) {
    return <p className="text-[var(--foreground)]">Loading children...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (children.length === 0) {
    return <p className="text-[var(--foreground)]">No children added yet. Click &quot;Add Child&quot; to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children.map((child) => {
        const assignedTasksCount = child.assignedTasks ? child.assignedTasks.length : 0;
        const completedTasksCount = child.assignedTasks ? child.assignedTasks.filter(task => task.status === 'completed').length : 0;
        const overallProgress = child.progress ? child.progress.overall : 0;

        return (
          <div
            key={child.id}
            onClick={() => handleChildClick(child)}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105"
          >
            <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">{child.name}</h3>
            <p className="text-lg text-[var(--foreground)]">Age: {child.age}</p>
            <p className="text-lg text-[var(--foreground)]">Grade: {child.grade}</p>
            <div className="mt-4">
              <p className="text-base text-[var(--foreground)]">Assigned Tasks: {assignedTasksCount}</p>
              <p className="text-base text-[var(--foreground)]">Tasks Completed: {completedTasksCount}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-[var(--primary-blue)] h-2.5 rounded-full"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-[var(--foreground)] mt-1">Progress: {overallProgress}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChildrenList;
