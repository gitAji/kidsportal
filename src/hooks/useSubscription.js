// src/hooks/useSubscription.js
// React hook to read subscription status from Firestore in real-time
"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      unsubscribeSnapshot = onSnapshot(userRef, (snap) => {
        const data = snap.data();
        setSubscription(data?.subscription || null);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const isPremium =
    subscription?.status === 'active' || subscription?.status === 'trialing';

  return { subscription, isPremium, loading };
}

// Backwards-compatible default export
export default useSubscription;