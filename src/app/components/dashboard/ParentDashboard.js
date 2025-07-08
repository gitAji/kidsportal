import React, { useState } from 'react';
import ChildrenList from './ChildrenList';
import AddChildForm from './AddChildForm';
import UpgradeModal from './UpgradeModal';

const ParentDashboard = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAddChildClick = () => {
    setShowAddChildModal(true);
  };

  const handleCloseAddChildModal = () => {
    setShowAddChildModal(false);
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

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
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">No new notifications.</p>
          {/* Placeholder for notifications */}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Payments & Subscription Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Current Plan: Free</p>
          <button onClick={handleUpgradeClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Upgrade to Premium
          </button>
          {/* Placeholder for payment history */}
        </div>
      </section>

      {showAddChildModal && <AddChildForm onClose={handleCloseAddChildModal} childToEdit={null} />}
      {showUpgradeModal && <UpgradeModal onClose={handleCloseUpgradeModal} />}
    </div>
  );
};

export default ParentDashboard;
