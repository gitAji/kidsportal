import React, { useState } from 'react';
import UpgradeModal from './UpgradeModal';

const Subscription = ({ subscription }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Payments & Subscription Management</h2>
      <p className="text-gray-700">Current Plan: <span className="font-bold">{subscription ? subscription.plan : 'Free'}</span></p>
      {subscription && subscription.plan !== 'free' && (
        <p className="text-gray-700">Status: <span className="font-bold">{subscription.status}</span></p>
      )}
      <button onClick={handleUpgradeClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        {subscription && subscription.plan !== 'free' ? 'Manage Subscription' : 'Upgrade to Premium'}
      </button>
      {showUpgradeModal && <UpgradeModal onClose={handleCloseUpgradeModal} />}
    </div>
  );
};

export default Subscription;
