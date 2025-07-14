import React, { useState, useEffect } from "react";
import { doc, onSnapshot, deleteDoc, setDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import { useRouter } from "next/navigation";
import ChildrenList from "./ChildrenList";
import AddChildForm from "./AddChildForm";
import Notifications from "./Notifications";
import SkeletonLoader from "../ui/SkeletonLoader";
import ToggleModal from "../ui/Modal"; // Keep Modal for AddChildForm
import ChildDashboard from "./ChildDashboard"; // Import ChildDashboard
import Subscription from "./Subscription"; // Import Subscription

const ParentDashboard = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showChildDashboardModal, setShowChildDashboardModal] = useState(false);
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

  const handleChildCardClick = (child) => {
    setSelectedChild(child);
    setShowChildDashboardModal(true);
  };

  const handleCloseChildDashboardModal = () => {
    setShowChildDashboardModal(false);
    setSelectedChild(null);
  };

  const handleEditChild = (child) => {
    setSelectedChild(child);
    setShowAddChildModal(true);
    setShowChildDashboardModal(false); // Close child dashboard modal if open
  };

  const handleDeleteChild = async (childId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      try {
        const parentUid = auth.currentUser.uid;
        const childDocRef = doc(db, 'users', parentUid, 'children', childId);
        await deleteDoc(childDocRef);
        alert("Child deleted successfully!");
        setShowChildDashboardModal(false); // Close modal after deletion
        setSelectedChild(null);
      } catch (err) {
        console.error("Error deleting child:", err);
        alert("Failed to delete child. Please try again.");
      }
    }
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
        <div className="bg-cloud-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-deep-ocean mb-2">Welcome, {auth.currentUser?.displayName || auth.currentUser?.email}!</h1>
            <p className="text-lg text-gray-700 mb-2">Parent</p>
            <p className="text-md text-gray-600 mb-2">Children: {parentData?.children ? parentData.children.length : 0}</p>
            
            {/* Lessons and Quizzes Used */}
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Lessons used:</p>
                <p className="font-bold text-primary-blue">{parentData?.lessonsUsed || 0}/{parentData?.totalLessons || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Quizzes:</p>
                <p className="font-bold text-primary-blue">{parentData?.quizzesUsed || 0}/{parentData?.totalQuizzes || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Subscription Info */}
        <div className="bg-cloud-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <Subscription />
        </div>
      </section>

      {/* Children Management Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-deep-ocean">Manage Your Children</h2>
          <button
            onClick={handleAddChildClick}
            className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-blue/80 transition-colors duration-300"
          >
            Add Child
          </button>
        </div>
        <ChildrenList onChildCardClick={handleChildCardClick} onEditChild={handleEditChild} onDeleteChild={handleDeleteChild} />
      </section>

      {/* Notifications Section */}
      <section className="mb-8">
        <Notifications notifications={parentData?.notifications} />
      </section>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <ToggleModal onClose={handleCloseAddChildModal}>
          <AddChildForm onClose={handleCloseAddChildModal} childToEdit={selectedChild} onSaveSuccess={handleSaveSuccess} />
        </ToggleModal>
      )}

      {showChildDashboardModal && selectedChild && (
        <ToggleModal onClose={handleCloseChildDashboardModal}>
          <ChildDashboard child={selectedChild} onEdit={handleEditChild} onDelete={handleDeleteChild} />
        </ToggleModal>
      )}
    </div>
  );
};

export default ParentDashboard;