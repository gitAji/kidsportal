"use client";
import React, { useEffect, useState, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import SkeletonLoader from "../components/ui/SkeletonLoader"; // Import SkeletonLoader

const LazyParentDashboard = React.lazy(() => import("../components/dashboard/ParentDashboard"));
const LazyChildDashboard = React.lazy(() => import("../components/dashboard/ChildDashboard"));

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); 
  const [isParent, setIsParent] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    console.log("DashboardPage useEffect: Initializing auth state listener.");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("onAuthStateChanged: currentUser ->", currentUser);
      if (currentUser) {
        setUser(currentUser);
        try {
          console.log("Fetching user role for UID:", currentUser.uid);
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User data from Firestore:", userData);
            if (userData.role === 'kid') {
              setIsParent(false);
              console.log("User is a kid.");
            } else {
              setIsParent(true); 
              console.log("User is a parent or role not set.");
            }
          } else {
            console.log("User document does not exist. Assuming parent.");
            setIsParent(true);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsParent(true); // Fallback to parent in case of error
        } finally {
          console.log("Setting loadingAuth to false after auth state and role check.");
          setLoadingAuth(false);
        }
      } else {
        console.log("No current user. Redirecting to login.");
        router.push("/login"); 
        setLoadingAuth(false); 
      }
    });
    return () => {
      console.log("Cleaning up auth state listener.");
      unsubscribe();
    };
  }, [router]);

  // If authentication is still loading, display a skeleton loader
  if (loadingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4">
          <SkeletonLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    console.log("No user, returning null (should redirect).");
    return null; 
  }

  console.log("Rendering dashboard for user:", user?.uid, "isParent:", isParent);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <Suspense fallback={<SkeletonLoader />}>
          {isParent ? <LazyParentDashboard /> : <LazyChildDashboard />}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
