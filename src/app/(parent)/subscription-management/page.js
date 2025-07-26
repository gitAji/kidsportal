"use client";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { FaCheckCircle, FaStar } from 'react-icons/fa';

const SubscriptionManagementPage = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setSubscription(userDoc.data().subscription || { plan: 'Free' });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDowngrade = async () => {
    if (!user) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        subscription: { plan: 'Free', status: 'active' }
      });
      setSubscription({ plan: 'Free' });
      setMessage({ type: 'success', text: 'You have successfully switched to the Free plan.' });
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      setMessage({ type: 'error', text: 'Failed to downgrade. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Your Subscription</h1>
        
        {message.text && (
          <div className={`p-4 mb-4 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700">Your Current Plan</h2>
          {subscription?.plan === 'Premium' ? (
            <div className="mt-4">
              <p className="text-4xl font-bold text-blue-600 flex items-center justify-center">
                <FaStar className="mr-2 text-yellow-400" /> Premium
              </p>
              <p className="text-gray-600 text-center mt-2">You have access to all features.</p>
              <button 
                onClick={handleDowngrade}
                disabled={loading}
                className="w-full mt-6 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Switch to Free Plan'}
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-4xl font-bold text-gray-700 flex items-center justify-center">
                <FaCheckCircle className="mr-2 text-green-500" /> Free
              </p>
              <p className="text-gray-600 text-center mt-2">You are on the Free plan.</p>
              <a 
                href="/pricing"
                className="w-full mt-6 block text-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Upgrade to Premium
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;
