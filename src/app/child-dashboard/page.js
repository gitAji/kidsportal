"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ChildDashboard from "../components/dashboard/ChildDashboard"; // Import ChildDashboard

export default function ChildDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem('childUser');
    if (storedChildUser) {
      setChildUser(JSON.parse(storedChildUser));
    } else {
      router.push('/child-login'); // Redirect to child login if no child user in session
    }
    setLoading(false);
  }, [router]);

  if (loading) {
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

  if (!childUser) {
    return null; // Should redirect by useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <Suspense fallback={<SkeletonLoader />}>
          <ChildDashboard child={childUser} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}