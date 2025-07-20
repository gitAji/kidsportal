"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkSubscription = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().isPremium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } else {
        setIsPremium(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkSubscription(user);
    });

    return () => unsubscribe();
  }, []);

  return { isPremium };
};