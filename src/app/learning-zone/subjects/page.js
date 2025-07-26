"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dbData from '../../data/db.json';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

export default function SubjectsPage() {
  const [childUser, setChildUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedUser = JSON.parse(storedChildUser);
      setChildUser(parsedUser);

      const gradeData = dbData.grades.find(g => g.gradeName === parsedUser.grade);
      if (gradeData) {
        setSubjects(gradeData.subjects);
      } else {
        setSubjects([]);
      }
    } else {
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]);

  if (loading) return <SkeletonLoader />;
  if (!childUser) return null; // Redirecting

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <div
              key={subject.subjectId}
              onClick={() => router.push(`/learning-zone/subjects/${subject.subjectId}`)}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col items-center justify-center min-h-[350px]"
            >
              {subject.image && (
                <Image src={subject.image} alt={subject.subjectName} width={96} height={96} className="w-24 h-24 object-contain mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">{subject.subjectName}</h2>
              <p className="text-gray-600">{subject.description}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No subjects found for your grade.</p>
        )}
      </div>
    </div>
  );
}
