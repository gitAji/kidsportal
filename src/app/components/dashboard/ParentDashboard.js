import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import ChildrenList from './ChildrenList';
import AddChildForm from './AddChildForm';
import Notifications from './Notifications';
import Subscription from './Subscription';
import SkeletonLoader from '../ui/SkeletonLoader';

const ParentDashboard = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      const parentDocRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(parentDocRef, (doc) => {
        if (doc.exists()) {
          setParentData(doc.data());
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

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Parent Dashboard</h1>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Overview of All Children</h2>
          <button
            onClick={handleAddChildClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Child
          </button>
        </div>
        <ChildrenList />
      </section>

      <section className="mb-8">
        <Notifications notifications={parentData?.notifications} />
      </section>

      <section className="mb-8">
        <Subscription subscription={parentData?.subscription} />
      </section>

      {showAddChildModal && <AddChildForm onClose={handleCloseAddChildModal} childToEdit={null} />}
    </div>
  );
};

export default ParentDashboard;
