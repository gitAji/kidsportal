"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

import SkeletonLoader from "../components/ui/SkeletonLoader";
import ChildDashboard from "../components/dashboard/ChildDashboard";

export default function ChildDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedChildUser = JSON.parse(storedChildUser);
      setChildUser(parsedChildUser);
    } else {
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]);

  const handleDeleteChild = async (childId) => {
    if (!childUser || !childUser.parentUid) {
      setDeleteError("Could not delete child. Parent information is missing.");
      return;
    }

    try {
      const parentUid = childUser.parentUid; // <-- FIX: Use the reliable parentUid from the childUser object
      const childDocRef = doc(db, "users", parentUid, "children", childId);
      await deleteDoc(childDocRef);
      alert("Child deactivated successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error deleting child:", err);
      setDeleteError("Failed to deactivate child. Please try again.");
    }
  };

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
    return null; // Redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4">
        {deleteError && (
          <p className="text-red-500 text-center mb-4">{deleteError}</p>
        )}
        <Suspense fallback={<SkeletonLoader />}>
          <ChildDashboard
            key={childUser.id}
            child={childUser}
            onDelete={handleDeleteChild}
            onClose={() => router.push('/dashboard')}
          />
        </Suspense>
      </main>
    </div>
  );
}
