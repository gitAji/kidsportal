import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { useRouter } from 'next/navigation';

const Subscription = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setIsPremium(docSnap.data().isPremium || false);
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setIsPremium(false);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);
  if (loading) {
    return <p>Loading subscription details...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Details</h2>
      <p className="text-gray-600">Current Plan: {isPremium ? 'Premium' : 'Free'}</p>
      {isPremium ? (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => router.push('/pricing')}
        >
          Downgrade
        </button>
      ) : (
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => router.push('/pricing')}
        >
          Upgrade to Premium
        </button>
      )}
    </div>
  );
};

export default Subscription;
