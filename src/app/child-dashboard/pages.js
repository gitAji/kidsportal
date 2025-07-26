"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
// import { doc, deleteDoc } from "firebase/firestore"; // No longer needed here
// import { db, auth } from "../../firebase/config"; // No longer needed here

import SkeletonLoader from "../components/ui/SkeletonLoader";
import ChildDashboard from "../components/dashboard/ChildDashboard"; // Import ChildDashboard

export default function ChildDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real application, you would fetch the child's data from Firestore here
    // based on the logged-in child's ID, not from sessionStorage with mock data.
    try {
      const storedChildUser = sessionStorage.getItem("childUser");
      if (storedChildUser) {
        const parsedChildUser = JSON.parse(storedChildUser);
        setChildUser(parsedChildUser);
      } else {
        router.push("/child-login"); // Redirect to child login if no child user in session
      }
    } catch (error) {
      console.error("Failed to parse child user from session storage", error);
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]); // router is stable and can be removed from dependencies

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow p-4">
          <SkeletonLoader />
        </main>
      </div>
    );
  }

  if (!childUser) {
    return null; // Should redirect by useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4">
        <Suspense fallback={<SkeletonLoader />}>
          <ChildDashboard key={childUser.id} child={childUser} />
        </Suspense>
      </main>
    </div>
  );
}
