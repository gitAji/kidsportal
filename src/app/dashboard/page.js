"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import ParentDashboard from "../components/dashboard/ParentDashboard";
import KidDashboard from "../components/dashboard/KidDashboard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isParent, setIsParent] = useState(true); // Default to parent, will be updated from Firestore
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
          console.log("Setting loading to false after auth state and role check.");
          setLoading(false);
        }
      } else {
        console.log("No current user. Redirecting to login.");
        router.push("/login"); // Redirect to login if not authenticated
        setLoading(false); // Also set loading to false if redirecting
      }
    });
    return () => {
      console.log("Cleaning up auth state listener.");
      unsubscribe();
    };
  }, [router]);

  if (!user && !loading) {
    console.log("No user and not loading, returning null (should redirect).");
    return null; // Should redirect to login if not authenticated and not loading
  }

  console.log("Rendering dashboard for user:", user?.uid, "isParent:", isParent, "loading:", loading);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <p className="text-lg font-semibold">Loading dashboard...</p>
            <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          isParent ? <ParentDashboard /> : <KidDashboard />
        )}
      </main>
      <Footer />
    </div>
  );
}