"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";

import SkeletonLoader from "../components/ui/SkeletonLoader";
import ChildDashboard from "../components/dashboard/ChildDashboard"; // Import ChildDashboard
import Breadcrumb from "../components/ui/Breadcrumb";

export default function ChildDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedChildUser = JSON.parse(storedChildUser);
      console.log("Child user from sessionStorage:", parsedChildUser);
      setChildUser(parsedChildUser);
    } else {
      router.push("/child-login"); // Redirect to child login if no child user in session
    }
    setLoading(false);
  }, [router]);

  const handleDeleteChild = async (childId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      try {
        const parentUid = auth.currentUser.uid;
        const childDocRef = doc(db, "users", parentUid, "children", childId);
        await deleteDoc(childDocRef);
        alert("Child deleted successfully!");
        router.push("/dashboard"); // Redirect to parent dashboard after deletion
      } catch (err) {
        console.error("Error deleting child:", err);
        setDeleteError("Failed to delete child. Please try again.");
      }
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
    return null; // Should redirect by useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4">
        <Breadcrumb />
        {deleteError && (
          <p className="text-red-500 text-center mb-4">{deleteError}</p>
        )}
        <Suspense fallback={<SkeletonLoader />}>
          <ChildDashboard
            key={childUser.id}
            child={childUser}
            onDelete={handleDeleteChild}
          />
        </Suspense>
      </main>
    </div>
  );
}
