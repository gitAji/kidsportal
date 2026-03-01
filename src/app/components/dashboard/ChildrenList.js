'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from 'next/navigation';
import CustomAvatar from '../ui/CustomAvatar';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

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
  }, []);

  const handleManageChild = (child) => {
    sessionStorage.setItem('childUser', JSON.stringify(child));
    router.push('/child-dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-5xl"
        >
          🎨
        </motion.div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 font-black bg-red-50 p-6 rounded-[2rem] border-2 border-red-100">Error: {error}</p>;
  }

  if (children.length === 0) {
    return (
      <div className="text-center p-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="text-6xl mb-6 text-slate-300">👋</div>
        <p className="text-xl text-slate-800 font-bold">Your explorers are waiting!</p>
        <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto text-sm">Click &quot;Add Child&quot; to launch their first learning adventure.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleManageChild(child)}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <CustomAvatar child={child} size="text-3xl" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-slate-800 truncate">{child.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Grade {child.grade} Explorer</span>
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
              <FaArrowRight className="text-sm" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChildrenList;