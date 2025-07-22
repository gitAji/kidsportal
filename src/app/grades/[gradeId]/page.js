"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SubjectCard from "../../components/ui/SubjectCard";
import SkeletonLoader from "../../components/ui/SkeletonLoader";

const GradeDetailPage = () => {
  const { gradeId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`/api/grades/${gradeId}/subjects`);
        if (!res.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gradeId) {
      fetchSubjects();
    }
  }, [gradeId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url('/images/intro11.png')" }}
    >
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <h1 className="page-heading text-center mb-8">
          Grade {gradeId} Subjects
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              gradeId={gradeId}
              subject={subject}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeDetailPage;