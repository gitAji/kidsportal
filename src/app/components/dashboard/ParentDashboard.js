import React, { useState, useEffect, lazy, Suspense } from "react";
import { doc, onSnapshot, deleteDoc, setDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from "next/navigation";

// Lazy load these components
const ChildrenList = lazy(() => import("./ChildrenList"));
const AddChildForm = lazy(() => import("./AddChildForm"));
const Notifications = lazy(() => import("./Notifications"));
const SkeletonLoader = lazy(() => import("../ui/SkeletonLoader"));
const Modal = lazy(() => import("../ui/Modal")); // Use generic Modal for AddChildForm
const ChildDashboard = lazy(() => import("./ChildDashboard")); // Import ChildDashboard
const GradesReport = lazy(() => import("./GradesReport"));
const Subscription = lazy(() => import("./Subscription")); // Import Subscription

const ParentDashboard = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      const parentDocRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(parentDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Fetch children subcollection
          const childrenCollectionRef = collection(db, 'users', auth.currentUser.uid, 'children');
          const q = query(childrenCollectionRef);
          const childrenSnapshot = await getDocs(q); // Use getDocs for a one-time fetch
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
    setSelectedChild(null); // Ensure no child is selected when adding a new one
    setShowAddChildModal(true);
  };

  const handleCloseAddChildModal = () => {
    setShowAddChildModal(false);
  };

  const handleSaveSuccess = () => {
    setShowAddChildModal(false);
    setSelectedChild(null); // Clear selected child after save, or re-fetch children list
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Parent Info & Subscription Card and Plan Card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Card: Parent Info */}
        <div className="bg-[var(--background)] p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div className="text-center md:text-left">
            <h1 className="page-heading text-center md:text-left mb-3">Welcome, {auth.currentUser?.displayName || auth.currentUser?.email}!</h1>
            <p className="text-xl text-gray-700 mb-3">Parent</p>
            <p className="text-lg text-gray-600 mb-4">Children: {parentData?.children ? parentData.children.length : 0}</p>
            
            {/* Lessons and Quizzes Used */}
            <div className="flex justify-center md:justify-start gap-6 mt-6">
              <div className="text-center">
                <p className="text-md text-gray-600">Lessons used:</p>
                <p className="text-xl font-bold text-[var(--primary-blue)]">{parentData?.lessonsUsed || 0}/{parentData?.totalLessons || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-md text-gray-600">Quizzes:</p>
                <p className="text-xl font-bold text-[var(--primary-blue)]">{parentData?.quizzesUsed || 0}/{parentData?.totalQuizzes || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Subscription Info */}
        <div className="bg-[var(--background)] p-6 rounded-lg shadow-md flex flex-col justify-between">
          <Suspense fallback={<SkeletonLoader />}>
            <Subscription />
          </Suspense>
        </div>
      </section>

      {/* Children Management Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-heading">Manage Your Children</h2>
          <button
            onClick={handleAddChildClick}
            className="px-5 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-blue/80 transition-colors duration-300 text-lg"
          >
            Add Child
          </button>
        </div>
        <div className="overflow-x-auto pb-4">
          <Suspense fallback={<SkeletonLoader />}>
            <ChildrenList />
          </Suspense>
        </div>
      </section>

      {/* Grades Report Section */}
      <section className="mb-8">
        <Suspense fallback={<SkeletonLoader />}>
          <GradesReport />
        </Suspense>
      </section>

      {/* Notifications Section */}
      <section className="mb-8">
        <Suspense fallback={<SkeletonLoader />}>
          <Notifications notifications={parentData?.notifications} />
        </Suspense>
      </section>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <Suspense fallback={<SkeletonLoader />}>
          <Modal onClose={handleCloseAddChildModal}>
            <AddChildForm onClose={handleCloseAddChildModal} childToEdit={selectedChild} onSaveSuccess={handleSaveSuccess} />
          </Modal>
        </Suspense>
      )}
    </div>
  );
};

export default ParentDashboard;