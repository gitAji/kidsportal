"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/layout/header/Header";
import Footer from "../../../components/layout/footer/Footer";

export default function SubjectDetailPage({ params }) {
  const router = useRouter();
  const { subjectId } = params;

  // Static data for demonstration
  const subjectsData = {
    mathematics: {
      name: "Mathematics",
      description:
        "Explore the world of numbers, equations, and problem-solving.",
      levels: [
        {
          id: "level1",
          name: "Level 1",
          description: "Basic Arithmetic",
          isPremium: false,
        },
        {
          id: "level2",
          name: "Level 2",
          description: "Addition & Subtraction",
          isPremium: false,
        },
        {
          id: "level3",
          name: "Level 3",
          description: "Multiplication & Division",
          isPremium: true,
        },
        {
          id: "level4",
          name: "Level 4",
          description: "Fractions & Decimals",
          isPremium: true,
        },
      ],
    },
    english: {
      name: "English Language Arts",
      description: "Enhance your reading, writing, and communication skills.",
      levels: [
        {
          id: "level1",
          name: "Level 1",
          description: "Alphabets & Phonics",
          isPremium: false,
        },
        {
          id: "level2",
          name: "Level 2",
          description: "Basic Grammar",
          isPremium: false,
        },
        {
          id: "level3",
          name: "Level 3",
          description: "Sentence Structure",
          isPremium: true,
        },
      ],
    },
    science: {
      name: "Science",
      description: "Dive into the wonders of physics, chemistry, and biology.",
      levels: [
        {
          id: "level1",
          name: "Level 1",
          description: "Living Things",
          isPremium: false,
        },
        {
          id: "level2",
          name: "Level 2",
          description: "Our Environment",
          isPremium: false,
        },
        {
          id: "level3",
          name: "Level 3",
          description: "Physical Science",
          isPremium: true,
        },
      ],
    },
    tamil: {
      name: "Tamil",
      description:
        "Learn the beautiful Tamil language and its rich literature.",
      levels: [
        {
          id: "level1",
          name: "Level 1",
          description: "Uyir Ezhuthukkal",
          isPremium: false,
        },
        {
          id: "level2",
          name: "Level 2",
          description: "Mei Ezhuthukkal",
          isPremium: false,
        },
        {
          id: "level3",
          name: "Level 3",
          description: "Uyir Mei Ezhuthukkal",
          isPremium: true,
        },
      ],
    },
  };

  const subject = subjectsData[subjectId];

  if (!subject) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-gray-700">Subject not found.</p>
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
          <h1 className="text-4xl font-bold text-blue-600">{subject.name}</h1>
          <p className="mt-4 text-gray-600">{subject.description}</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subject.levels.length === 0 ? (
              <p className="text-gray-700">
                No levels available for this subject yet.
              </p>
            ) : (
              subject.levels.map((level) => (
                <div
                  key={level.id}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() =>
                    router.push(`/learning/${subjectId}/${level.id}`)
                  }
                >
                  <h3 className="text-2xl font-bold text-blue-600 mt-4">
                    {level.name}
                  </h3>
                  <p className="mt-2 text-gray-600">{level.description}</p>
                  {level.isPremium && (
                    <span className="mt-2 inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
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
