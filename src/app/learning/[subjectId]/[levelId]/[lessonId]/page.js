"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Header from "../../../../../../components/layout/header/Header";
import Footer from "../../../../../../components/layout/footer/Footer";
import SkeletonLoader from "../../../../components/ui/SkeletonLoader"; 

export default function LessonDetailPage({ params }) {
  const router = useRouter();
  const { subjectId, levelId, lessonId } = params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // To get the current user (kid)
  const [taskStatus, setTaskStatus] = useState('assigned'); // To track the status of the current lesson's task
  const [taskId, setTaskId] = useState(null); // To store the ID of the task document

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchLessonAndTaskStatus = async () => {
      if (!user) return; // Wait for user to be loaded

      try {
        const lessonDocRef = doc(db, 'subjects', subjectId, 'levels', levelId, 'lessons', lessonId);
        const lessonDocSnap = await getDoc(lessonDocRef);

        if (lessonDocSnap.exists()) {
          setLesson({ id: lessonDocSnap.id, ...lessonDocSnap.data() });

          // Fetch task status for the current user and lesson
          const tasksCollectionRef = collection(db, 'users', user.uid, 'assignedTasks');
          const q = query(
            tasksCollectionRef,
            where("lessonId", "==", lessonId),
            where("levelId", "==", levelId),
            where("subjectId", "==", subjectId)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const taskDoc = querySnapshot.docs[0];
            setTaskStatus(taskDoc.data().status);
            setTaskId(taskDoc.id);
          }
        } else {
          setError("Lesson not found.");
        }
      } catch (err) {
        console.error("Error fetching lesson or task status:", err);
        setError("Failed to load lesson details or task status.");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId && levelId && lessonId && user) {
      fetchLessonAndTaskStatus();
    }
  }, [subjectId, levelId, lessonId, user]);

  const handleMarkAsComplete = async () => {
    if (!user || !taskId) {
      alert("Cannot mark as complete. User not logged in or task not found.");
      return;
    }

    try {
      const taskDocRef = doc(db, 'users', user.uid, 'assignedTasks', taskId);
      await updateDoc(taskDocRef, {
        status: 'completed',
        completedDate: new Date(),
      });
      setTaskStatus('completed');
      alert("Task marked as complete!");
    } catch (err) {
      console.error("Error marking task as complete:", err);
      alert("Failed to mark task as complete. Please try again.");
    }
  };

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

          <div className="mt-8 text-center">
            {taskStatus === 'completed' ? (
              <p className="text-green-600 text-lg font-semibold">Task Completed!</p>
            ) : (
              <button
                onClick={handleMarkAsComplete}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 text-lg font-semibold"
              >
                Mark as Complete
              </button>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
