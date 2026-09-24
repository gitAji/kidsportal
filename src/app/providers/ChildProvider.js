"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/firebase/config';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const ChildContext = createContext();

export function useChild() {
  return useContext(ChildContext);
}

export function ChildProvider({ children }) {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const checkChildSession = async () => {
      // Check localStorage first, then sessionStorage
      const storedChildUser = localStorage.getItem("childUser") || sessionStorage.getItem("childUser");

      if (storedChildUser) {
        const parsedUser = JSON.parse(storedChildUser);
        try {
          // Fetch Child and Parent data via API to avoid permission issues
          const response = await fetch('/api/child-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentUid: parsedUser.parentUid, childId: parsedUser.id })
          });

          if (response.ok) {
            const { parentData, childData } = await response.json();

            // To be compatible with old code, format the dates if they are Firebase Timestamps in JSON
            const parseDate = (dateObj) => {
              if (!dateObj) return null;
              if (dateObj._seconds) return new Date(dateObj._seconds * 1000); // Admin SDK Timestamp format
              return new Date(dateObj); // ISO string
            };

            const freshData = { id: parsedUser.id, ...childData, parentUid: parsedUser.parentUid };

            // Subscription check - align with new planType logic
            let isSubActive = false;

            if (parentData.planType === 'paid') {
              // Paid plan is active if status is active or trialing
              const status = parentData.subscription?.status || parentData.subscriptionStatus;
              isSubActive = status === 'active' || status === 'trialing';
            } else if (parentData.planType === 'free_trial') {
              // Free trial is active if trialEndDate is in the future
              const trialEndDate = parseDate(parentData.trialEndDate);
              isSubActive = trialEndDate && trialEndDate > new Date();
            } else if (parentData.subscription) {
              // Legacy fallback
              const status = parentData.subscription.status;
              isSubActive = status === 'active' || status === 'trialing';
            } else {
              // Final fallback for older accounts without planType
              const createdAt = parseDate(parentData.createdAt);
              const baseDate = createdAt || new Date();
              const trialEnd = new Date(baseDate);
              trialEnd.setMonth(trialEnd.getMonth() + 1); // Standard 1 month trial
              isSubActive = trialEnd > new Date();
            }

            // Ensure gradeId matches db.json format
            if (freshData.grade) {
              const gradeNum = parseInt(freshData.grade.toString().replace('Grade ', ''), 10);
              if (!isNaN(gradeNum)) {
                freshData.gradeId = `grade-${gradeNum}`;
              } else {
                freshData.gradeId = freshData.grade.toLowerCase().replace(' ', '-');
              }
            }

            setChildUser({ ...freshData, isSubscriptionActive: isSubActive });

            // Re-set storage items
            const storageData = { ...freshData, isSubscriptionActive: isSubActive };
            if (localStorage.getItem("childUser")) {
              localStorage.setItem("childUser", JSON.stringify(storageData));
            } else {
              sessionStorage.setItem("childUser", JSON.stringify(storageData));
            }
          } else {
            localStorage.removeItem("childUser");
            sessionStorage.removeItem("childUser");
            let reason = null;
            try {
              const body = await response.json();
              if (body.code === "PARENT_EMAIL_NOT_VERIFIED") reason = "email_not_verified";
            } catch {
              // no JSON body — fall through to a plain redirect
            }
            router.push(reason ? `/child-login?reason=${reason}` : "/child-login");
          }
        } catch (error) {
          console.error("Error fetching child/parent data for provider:", error);
          localStorage.removeItem("childUser");
          sessionStorage.removeItem("childUser");
          router.push("/child-login");
        }
      } else {
        router.push("/child-login");
      }
      setLoading(false);
    };

    checkChildSession();
  }, [router, db]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <SkeletonLoader variant="page" message="Loading your learning adventure..." />
        </div>
      </div>
    );
  }

  if (!childUser) {
    return null; // Redirecting is handled by useEffect
  }

  const value = { childUser, setChildUser };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
}
