import React, { useState, useEffect, lazy, Suspense } from "react";
import { doc, onSnapshot, collection, query, getDocs } from "firebase/firestore";
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from "next/navigation";
import Subscription from "./Subscription";
import ChildrenList from "./ChildrenList";
import AddChildForm from "./AddChildForm";
import Notifications from "./Notifications";
import { DashboardSkeleton } from "../ui/SkeletonLoader";
import Modal from "../ui/Modal";
import { FaPlus, FaBell, FaUserFriends, FaUserCircle, FaCrown } from 'react-icons/fa';
import { motion } from "framer-motion";

const ParentDashboard = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      const parentDocRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(parentDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const childrenCollectionRef = collection(db, 'users', auth.currentUser.uid, 'children');
          const childrenSnapshot = await getDocs(query(childrenCollectionRef));
          const childrenData = childrenSnapshot.docs.map(childDoc => ({
            id: childDoc.id,
            ...childDoc.data()
          }));
          setParentData({ ...data, children: childrenData });
        } else {
          setParentData(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  if (loading) return <DashboardSkeleton />;

  const displayName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Parent';

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 overflow-hidden flex-shrink-0">
              {auth.currentUser?.photoURL
                ? <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                : <FaUserCircle className="text-xl" />}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                Welcome back, <span className="text-blue-600">{displayName}</span>
              </h1>
              <p className="text-sm text-slate-400 font-medium">Manage your family's learning journey</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChildModal(true)}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-full shadow-lg hover:shadow-cyan-400/40 transition-all text-sm uppercase tracking-widest border-2 border-transparent hover:border-white/20"
            >
              <FaPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" /> Add Learner
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Children List */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              icon={<FaUserFriends className="text-blue-500" />}
              title="Your Learners"
            >
              <Suspense fallback={<DashboardSkeleton />}>
                <ChildrenList />
              </Suspense>
            </SectionCard>
          </div>

          {/* Right: Subscription + Notifications */}
          <div className="flex flex-col gap-6">
            <SectionCard
              icon={<FaCrown className="text-amber-500" />}
              title="Subscription"
            >
              <Suspense fallback={<div className="animate-pulse h-32 bg-slate-50 rounded-xl" />}>
                <Subscription />
              </Suspense>
            </SectionCard>

            <SectionCard
              icon={<FaBell className="text-blue-400" />}
              title="Notifications"
              flex
            >
              <Suspense fallback={<div className="animate-pulse h-24 bg-slate-50 rounded-xl" />}>
                <Notifications notifications={parentData?.notifications} />
              </Suspense>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <Suspense fallback={null}>
          <Modal onClose={() => setShowAddChildModal(false)} unstyled>
            <AddChildForm
              onClose={() => setShowAddChildModal(false)}
              onSaveSuccess={() => setShowAddChildModal(false)}
            />
          </Modal>
        </Suspense>
      )}
    </div>
  );
};

// ── Shared Section Card ────────────────────────────────────────────
function SectionCard({ icon, title, children, flex = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden ${flex ? 'flex flex-col flex-grow' : 'flex flex-col'}`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-8 py-5 bg-gradient-to-b from-white to-slate-50/50 border-b border-slate-100/60 relative">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-lg relative z-10">
          {icon}
        </div>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest relative z-10">{title}</h2>
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-slate-100 to-transparent opacity-50 rounded-bl-[100px]" />
      </div>
      {/* Card body */}
      <div className={`p-8 ${flex ? 'flex-grow flex flex-col' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}

export default ParentDashboard;
