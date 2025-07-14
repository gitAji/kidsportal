import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';

const UpgradeModal = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const handleUpgrade = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { currentPlan: 'Premium', subscriptionStatus: 'active', billing: selectedPlan });
      alert('You have successfully upgraded to the Premium plan!');
      onClose();
    } catch (error) {
      console.error('Error upgrading subscription: ', error);
      alert('Failed to upgrade. Please try again.');
    }
  };

  const premiumFeatures = [
    "Access to all grades and subjects",
    "Unlimited lessons and quizzes",
    "Detailed progress tracking",
    "Ad-free learning experience",
    "Priority customer support",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Unlock Premium Features!</h2>
        
        <div className="flex flex-col md:flex-row justify-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div
            className={`relative p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 w-full md:w-1/2 ${selectedPlan === 'monthly' ? 'border-4 border-blue-500 scale-105' : 'border-2 border-gray-300 hover:border-blue-300'}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Monthly Plan</h3>
            <p className="text-4xl font-bold text-blue-600">$10<span className="text-lg text-gray-600">/month</span></p>
            <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
          </div>

          <div
            className={`relative p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 w-full md:w-1/2 ${selectedPlan === 'yearly' ? 'border-4 border-blue-500 scale-105' : 'border-2 border-gray-300 hover:border-blue-300'} border-yellow-500 border-4`}
            onClick={() => setSelectedPlan('yearly')}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">Best Value!</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Yearly Plan</h3>
            <p className="text-4xl font-bold text-blue-600">$100<span className="text-lg text-gray-600">/year</span></p>
            <p className="text-sm text-gray-500 mt-2">Billed annually (Save $20!)</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">What you get with Premium:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
