"use client";

import React from "react";
import Header from "../../../../components/layout/header/Header";
import Footer from "../../../../components/layout/footer/Footer";

export default function LessonDetailPage({ params }) {
  const { subjectId, levelId, lessonId } = params;

  // Static data for demonstration
  const lessonsData = {
    mathematics: {
      level1: {
        lesson1: {
          name: "Lesson 1: Counting",
          description: "Learn to count from 1 to 10.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          textContent: "Content for counting.",
        },
        lesson2: {
          name: "Lesson 2: Addition Basics",
          description: "Understand simple addition.",
          textContent: "Content for addition.",
        },
      },
    },
    english: {
      level1: {
        lesson1: {
          name: "Lesson 1: ABCs",
          description: "Learn the English alphabet.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          textContent: "Content for ABCs.",
        },
      },
    },
  };

  const subjectLessons = lessonsData[subjectId];
  const levelLessons = subjectLessons ? subjectLessons[levelId] : null;
  const lesson = levelLessons ? levelLessons[lessonId] : null;

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
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            {lesson.name}
          </h1>
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
              <p className="text-gray-700 whitespace-pre-wrap">
                {lesson.textContent}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => alert("Quiz/Task functionality coming soon!")}
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
