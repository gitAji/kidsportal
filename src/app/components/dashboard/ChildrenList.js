'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore'; // Import getDocs
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';
import CustomAvatar from '../ui/CustomAvatar';

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!auth.currentUser) {
        setError("No user logged in.");
        setLoading(false);
        return;
      }

      try {
        const parentUid = auth.currentUser.uid;
        const childrenCollectionRef = collection(db, 'users', parentUid, 'children');
        const q = query(childrenCollectionRef);
        
        // **THE FIX IS HERE:** Use a one-time fetch instead of a real-time listener.
        const querySnapshot = await getDocs(q);
        
        const childrenData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          parentUid: parentUid,
        }));
        
        setChildren(childrenData);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to load children data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []); // The empty dependency array means this runs once on component mount

  const handleManageChild = (child) => {
    sessionStorage.setItem('childUser', JSON.stringify(child));
    router.push('/child-dashboard');
  };

  if (loading) {
    return <p className="text-gray-600">Loading children...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (children.length === 0) {
    return <p className="text-gray-600">No children added yet. Click &quot;Add Child&quot; to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child) => {
        const completedTasks = child.assignedTasks?.filter(task => task.status === 'completed').length || 0;
        const totalTasks = child.assignedTasks?.length || 0;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return (
          <div
            key={child.id}
            onClick={() => handleManageChild(child)}
            title="Click to manage child"
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 flex-shrink-0">
                  <CustomAvatar child={child} size="text-5xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{child.name}</h3>
                  <p className="text-md text-gray-600">Age: {child.age} | Grade: {child.grade}</p>
                </div>
              </div>
              
              <div className="my-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              <div className="flex justify-around text-center text-gray-700 pt-2">
                <div>
                  <p className="text-2xl font-bold">{child.points || 0}</p>
                  <p className="text-sm">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                  <p className="text-sm">Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{child.stickers?.length || 0}</p>
                  <p className="text-sm">Stickers</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChildrenList;