"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../../firebase/config';
import Header from "../../../../../../components/layout/header/Header";
import Footer from "../../../../../../components/layout/footer/Footer";
import SkeletonLoader from "../../../../../../components/components/ui/SkeletonLoader"; // Import SkeletonLoader

export default function LessonDetailPage({ params }) {
  const router = useRouter();
  const { subjectId, levelId, lessonId } = params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonDocRef = doc(db, 'subjects', subjectId, 'levels', levelId, 'lessons', lessonId);
        const lessonDocSnap = await getDoc(lessonDocRef);

        if (lessonDocSnap.exists()) {
          setLesson({ id: lessonDocSnap.id, ...lessonDocSnap.data() });
        } else {
          setError("Lesson not found.");
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson details.");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId && levelId && lessonId) {
      fetchLesson();
    }
  }, [subjectId, levelId, lessonId]);

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

  if (!lesson) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-gray-700">Lesson not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">{lesson.name}</h1>
          <p className="text-gray-700 mb-6">{lesson.description}</p>

          {lesson.videoUrl && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Video Lesson</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
            </div>
          )}

          {lesson.textContent && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Content</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{lesson.textContent}</p>
            </div>
          )}

          {/* Placeholder for quizzes/interactive elements */}
          <div className="mt-8 text-center">
            <button
              onClick={() => alert('Quiz/Task functionality coming soon!')}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 text-lg font-semibold"
            >
              Start Quiz / Mark as Complete
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}