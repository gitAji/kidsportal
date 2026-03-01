"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import LearningZone from "../../components/learning/LearningZone";
import dbData from '../../data/db.json';

export default function LearningZoneDashboardPage() {
  const [childUser, setChildUser] = useState(null);
  const [learningContent, setLearningContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedChildUser = JSON.parse(storedChildUser);
      setChildUser(parsedChildUser);

      const gradeData = dbData.grades.find(g => g.gradeName === parsedChildUser.grade);
      if (gradeData) {
        setLearningContent(gradeData.subjects);
      }
    } else {
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-blue-50">
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-cyan-200">
      <main className="container mx-auto p-4 sm:p-6">
        <Suspense fallback={<SkeletonLoader />}>
          <LearningZone child={childUser} subjects={learningContent} />
        </Suspense>
      </main>
    </div>
  );
}
