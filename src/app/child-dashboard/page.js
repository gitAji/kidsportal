"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ChildDashboard from "../components/dashboard/ChildDashboard";

export default function ChildDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      setChildUser(JSON.parse(storedChildUser));
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow p-4"><SkeletonLoader /></main>
      </div>
    );
  }

  if (!childUser) {
    return null; // Redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4">
        
        <Suspense fallback={<SkeletonLoader />}>
          <ChildDashboard
            key={childUser.id}
            child={childUser}
            onClose={() => router.push('/dashboard')}
          />
        </Suspense>
      </main>
    </div>
  );
}