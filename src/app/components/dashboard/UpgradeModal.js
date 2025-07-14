import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';

const UpgradeModal = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const handleUpgrade = async () => {
    try {
      const subDocRef = doc(db, 'users', auth.currentUser.uid, 'subscription', 'current');
      await updateDoc(subDocRef, { plan: 'Premium', status: 'active', billing: selectedPlan });
      alert('You have successfully upgraded to the Premium plan!');
      onClose();
    } catch (error) {
      console.error('Error upgrading subscription: ', error);
      alert('Failed to upgrade. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
        <p className="text-gray-700 mb-6">Choose your billing cycle:</p>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`py-2 px-6 rounded-lg mx-2 ${
              selectedPlan === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`py-2 px-6 rounded-lg mx-2 ${
              selectedPlan === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Yearly
          </button>
        </div>
        <div className="text-center mb-6">
          <p className="text-xl font-semibold">
            {selectedPlan === 'monthly' ? '$10/month' : '$100/year'}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
