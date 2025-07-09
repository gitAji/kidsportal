"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";

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
          },
          {
            id: "lesson2",
            name: "Lesson 2: Addition Basics",
            description: "Understand simple addition.",
            textContent: "Content for addition.",
          },
        ],
      },
      level2: {
        name: "Level 2",
        description: "Addition & Subtraction",
        lessons: [
          {
            id: "lesson1",
            name: "Lesson 1: Advanced Addition",
            description: "Practice addition with larger numbers.",
            textContent: "Content for advanced addition.",
          },
          {
            id: "lesson2",
            name: "Lesson 2: Subtraction Basics",
            description: "Introduction to subtraction.",
            textContent: "Content for subtraction.",
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
          },
          {
            id: "lesson2",
            name: "Lesson 2: Short Vowels",
            description: "Understand short vowel sounds.",
            textContent: "Content for short vowels.",
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

  return (
    <>
      <Header />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">{level.name}</h1>
          <p className="mt-4 text-gray-600">{level.description}</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {level.lessons.length === 0 ? (
              <p className="text-gray-700">
                No lessons available for this level yet.
              </p>
            ) : (
              level.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/learning/${subjectId}/${levelId}/${lesson.id}`
                    )
                  }
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
