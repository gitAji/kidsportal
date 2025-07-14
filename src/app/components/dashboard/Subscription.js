import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import UpgradeModal from './UpgradeModal';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setSubscription({
            plan: userData.currentPlan || 'Free',
            status: userData.subscriptionStatus || 'active',
            planEndDate: userData.planEndDate ? userData.planEndDate.toDate() : null, // Convert Firestore Timestamp to Date object
          });
        } else {
          setSubscription({ plan: 'Free', status: 'active', planEndDate: null });
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleDowngrade = async () => {
    if (window.confirm('Are you sure you want to downgrade to the Free plan? You will lose access to Premium features.')) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { currentPlan: 'Free', subscriptionStatus: 'active', planEndDate: null });
        alert('You have successfully downgraded to the Free plan.');
      } catch (error) {
        console.error('Error downgrading subscription: ', error);
        alert('Failed to downgrade. Please try again.');
      }
    }
  };

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  if (loading) {
    return <p>Loading subscription details...</p>;
  }

  const isPremium = subscription?.plan !== 'Free';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Subscription Management</h2>
      <p className="text-gray-700">
        Current Plan: <span className="font-bold">{subscription?.plan}</span>
      </p>
      {isPremium && (
        <p className="text-gray-700">
          Status: <span className="font-bold">{subscription?.status}</span>
        </p>
      )}
      {subscription?.planEndDate && (
        <p className="text-gray-700">
          Renews on: <span className="font-bold">{subscription.planEndDate.toLocaleDateString()}</span>
        </p>
      )}
      <div className="mt-4">
        {isPremium ? (
          <button
            onClick={handleDowngrade}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Downgrade to Free
          </button>
        ) : (
          <button
            onClick={handleUpgradeClick}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Upgrade to Premium
          </button>
        )}
      </div>
      {showUpgradeModal && <UpgradeModal onClose={handleCloseUpgradeModal} />}
    </div>
  );
};

export default Subscription;