import React, { useState } from 'react';

const UpgradeModal = ({ onClose }) => {
  const [plan, setPlan] = useState('monthly');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handlePlanChange = (e) => {
    setPlan(e.target.value);
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleUpgrade = () => {
    if (termsAccepted) {
      // Handle payment processing here
      alert(`Upgrading to ${plan} plan!`);
      onClose();
    } else {
      alert('Please accept the terms and conditions.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Choose a plan:</label>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="monthly"
              name="plan"
              value="monthly"
              checked={plan === 'monthly'}
              onChange={handlePlanChange}
              className="mr-2"
            />
            <label htmlFor="monthly">Monthly - $10/month</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="yearly"
              name="plan"
              value="yearly"
              checked={plan === 'yearly'}
              onChange={handlePlanChange}
              className="mr-2"
            />
            <label htmlFor="yearly">Yearly - $100/year (Save $20)</label>
          </div>
        </div>
        <div className="mb-6">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="mr-2"
          />
          <label htmlFor="terms">I accept the <a href="/terms" target="_blank" className="text-blue-500">terms and conditions</a></label>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleUpgrade}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upgrade Now
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;