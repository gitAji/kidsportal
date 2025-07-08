"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import Header from "../../../../../components/layout/header/Header";
import Footer from "../../../../../components/layout/footer/Footer";
import SkeletonLoader from "../../../../../components/ui/SkeletonLoader"; // Import SkeletonLoader

export default function LevelDetailPage({ params }) {
  const router = useRouter();
  const { subjectId, levelId } = params;
  const [level, setLevel] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevelAndLessons = async () => {
      try {
        // Fetch level details
        const levelDocRef = doc(db, 'subjects', subjectId, 'levels', levelId);
        const levelDocSnap = await getDoc(levelDocRef);

        if (levelDocSnap.exists()) {
          setLevel({ id: levelDocSnap.id, ...levelDocSnap.data() });

          // Fetch lessons for the level
          const lessonsCollectionRef = collection(db, 'subjects', subjectId, 'levels', levelId, 'lessons');
          const q = query(lessonsCollectionRef);

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const lessonsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setLessons(lessonsData);
            setLoading(false);
          }, (err) => {
            console.error("Error fetching lessons:", err);
            setError("Failed to load lessons.");
            setLoading(false);
          });

          return () => unsubscribe();
        } else {
          setError("Level not found.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching level or lessons:", err);
        setError("Failed to load level details.");
        setLoading(false);
      }
    };

    if (subjectId && levelId) {
      fetchLevelAndLessons();
    }
  }, [subjectId, levelId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <div className="text-center w-full">
            <SkeletonLoader />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!level) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-gray-700">Level not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">{level.name}</h1>
          <p className="mt-4 text-gray-600">{level.description}</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.length === 0 ? (
              <p className="text-gray-700">No lessons available for this level yet.</p>
            ) : (
              lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/learning/${subjectId}/${levelId}/${lesson.id}`)}
                >
                  <h3 className="text-2xl font-bold text-blue-600 mt-4">
                    {lesson.name}
                  </h3>
                  <p className="mt-2 text-gray-600">{lesson.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}