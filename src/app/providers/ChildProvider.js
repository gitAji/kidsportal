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
          const childDocRef = doc(db, 'users', parsedUser.parentUid, 'children', parsedUser.id);
          const childDoc = await getDoc(childDocRef);
          if (childDoc.exists()) {
            const freshData = { id: childDoc.id, ...childDoc.data(), parentUid: parsedUser.parentUid };
            console.log("ChildProvider: Original childUser.grade", freshData.grade);
            // Ensure gradeId matches db.json format (e.g., "grade-1" from 1 or "Grade 1")
            if (freshData.grade) {
                const gradeNum = parseInt(freshData.grade.toString().replace('Grade ', ''), 10);
                if (!isNaN(gradeNum)) {
                    freshData.gradeId = `grade-${gradeNum}`;
                } else {
                    freshData.gradeId = freshData.grade.toLowerCase().replace(' ', '-'); // Fallback for other formats
                }
            }
            console.log("ChildProvider: Processed childUser.gradeId", freshData.gradeId);
            setChildUser(freshData);
            // Re-set the storage item to keep it fresh
            if (localStorage.getItem("childUser")) {
                localStorage.setItem("childUser", JSON.stringify(freshData));
            } else {
                sessionStorage.setItem("childUser", JSON.stringify(freshData));
            }
          } else {
            localStorage.removeItem("childUser");
            sessionStorage.removeItem("childUser");
            router.push("/child-login");
          }
        } catch (error) {
          console.error("Error fetching child data for provider:", error);
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
        <SkeletonLoader />
        <p className="text-gray-600 mt-4">Loading learning zone...</p>
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
