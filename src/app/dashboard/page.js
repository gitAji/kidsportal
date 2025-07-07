"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return null; // Should redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Welcome to your Dashboard, {user.displayName || user.email}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Assigned Assignments Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Assigned Assignments</h2>
            <p className="text-gray-600">No assigned assignments yet.</p>
            {/* Future: Map through assigned assignments */}
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Completed Tasks</h2>
            <p className="text-gray-600">No completed tasks yet.</p>
            {/* Future: Map through completed tasks */}
          </div>

          {/* Quick Links/Stats Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Quick Stats</h2>
            <p className="text-gray-600">Total courses: X</p>
            <p className="text-gray-600">Progress: Y%</p>
            {/* Future: Add more dynamic stats */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
