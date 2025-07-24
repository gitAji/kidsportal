"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";

import SkeletonLoader from "../components/ui/SkeletonLoader";
import ChildDashboard from "../components/dashboard/ChildDashboard"; // Import ChildDashboard

export default function ChildDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedChildUser = JSON.parse(storedChildUser);
      // Add mock data for UI demonstration
      if (!parsedChildUser.points) {
        parsedChildUser.points = 120;
      }
      if (!parsedChildUser.stickers) {
        parsedChildUser.stickers = [1, 3, 5];
      }
      if (!parsedChildUser.progress) {
        parsedChildUser.progress = {
          subjects: {
            "Mathematics": { score: 75, level: 3, stars: 12 },
            "Science": { score: 90, level: 4, stars: 18 },
            "History": { score: 60, level: 2, stars: 8 }
          }
        }
      }
      if (!parsedChildUser.assignedTasks) {
        parsedChildUser.assignedTasks = [
            { name: 'Math Quiz 1', status: 'completed' },
            { name: 'Science Reading', status: 'in-progress' },
            { name: 'History Video', status: 'not-started' },
        ]
      }
      if (typeof parsedChildUser.loginEnabled === 'undefined') {
        parsedChildUser.loginEnabled = true; // Default to true if not set
      }
      console.log("Child user from sessionStorage with mock data:", parsedChildUser);
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