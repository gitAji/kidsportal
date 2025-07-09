"use client";
import React, { useEffect, useState, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ParentDashboard from "../components/dashboard/ParentDashboard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
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

  if (!user) {
    return null; // Redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <Suspense fallback={<SkeletonLoader />}>
          <ParentDashboard />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
