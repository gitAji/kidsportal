"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../components/layout/header/Header";
import Footer from "../../../../components/layout/footer/Footer";

import { FaBookOpen, FaVideo, FaPen } from "react-icons/fa";

export default function LevelDetailPage({ params }) {
  const router = useRouter();
  const { subjectId, levelId } = params;

  // Static data for demonstration
  const levelsData = {
    mathematics: {
      level1: {
        name: "Level 1",
        description: "Basic Arithmetic",
        lessons: [
          {
            id: "lesson1",
            name: "Lesson 1: Counting",
            description: "Learn to count from 1 to 10.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            textContent: "Content for counting.",
            icon: <FaBookOpen />,
          },
          {
            id: "lesson2",
            name: "Lesson 2: Addition Basics",
            description: "Understand simple addition.",
            textContent: "Content for addition.",
            icon: <FaPen />,
          },
        ],
      },
    },
    english: {
      level1: {
        name: "Level 1",
        description: "Alphabets & Phonics",
        lessons: [
          {
            id: "lesson1",
            name: "Lesson 1: ABCs",
            description: "Learn the English alphabet.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            textContent: "Content for ABCs.",
            icon: <FaVideo />,
          },
          {
            id: "lesson2",
            name: "Lesson 2: Short Vowels",
            description: "Understand short vowel sounds.",
            textContent: "Content for short vowels.",
            icon: <FaBookOpen />,
          },
        ],
      },
    },
  };

  const subjectLevels = levelsData[subjectId];
  const level = subjectLevels ? subjectLevels[levelId] : null;

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

  const completedLessons = 1; // Example of completed lessons
  const totalLessons = level.lessons.length;
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <>
      <Header />
      <section
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            {level.name}
          </h1>
          <p className="mt-4 text-lg text-white">{level.description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-6 mt-8">
            <div
              className="bg-green-400 h-6 rounded-full text-center text-white font-bold"
              style={{ width: `${progress}%` }}
            >
              {`${Math.round(progress)}%`}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {level.lessons.length === 0 ? (
              <p className="text-gray-700">
                No lessons available for this level yet.
              </p>
            ) : (
              level.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/learning/${subjectId}/${levelId}/${lesson.id}`
                    )
                  }
                >
                  <div className="text-4xl text-blue-500 mb-4">
                    {lesson.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
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
