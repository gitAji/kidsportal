import React, { useState, useEffect, lazy, Suspense } from "react";
import { doc, onSnapshot, collection, query, getDocs } from "firebase/firestore";
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from "next/navigation";
import Subscription from "./Subscription";
import ChildrenList from "./ChildrenList";
import AddChildForm from "./AddChildForm";
import Notifications from "./Notifications";
import SkeletonLoader from "../ui/SkeletonLoader";
import Modal from "../ui/Modal";
import { FaPlus, FaBell, FaUserFriends } from 'react-icons/fa';

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
          const q = query(childrenCollectionRef);
          const childrenSnapshot = await getDocs(q);
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

  const handleAddChildClick = () => {
    setShowAddChildModal(true);
  };

  const handleCloseAddChildModal = () => {
    setShowAddChildModal(false);
  };

  const handleSaveSuccess = () => {
    setShowAddChildModal(false);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {auth.currentUser?.displayName || auth.currentUser?.email}!</p>
        </div>
        <button
          onClick={handleAddChildClick}
          className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Child
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Children List */}
        <main className="lg:col-span-2">
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <FaUserFriends className="mr-3" /> Your Children
            </h2>
            <Suspense fallback={<SkeletonLoader />}>
              <ChildrenList />
            </Suspense>
          </section>
        </main>

        {/* Right Column: Subscription and Notifications */}
        <aside>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Subscription</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Suspense fallback={<SkeletonLoader />}>
                  <Subscription />
                </Suspense>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
                <FaBell className="mr-3" /> Notifications
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Suspense fallback={<SkeletonLoader />}>
                  <Notifications notifications={parentData?.notifications} />
                </Suspense>
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <Suspense fallback={<SkeletonLoader />}>
          <Modal onClose={handleCloseAddChildModal}>
            <AddChildForm onClose={handleCloseAddChildModal} onSaveSuccess={handleSaveSuccess} />
          </Modal>
        </Suspense>
      )}
    </div>
  );
};

export default ParentDashboard;
