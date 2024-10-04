// src/app/grades/1/math/page.js

"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react"; // Import React and useState
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Header from "../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../components/ui/BackToTop"; // Import BackToTop button

const MathPage = () => {
  const router = useRouter();

  // Initialize progress state
  const initialProgress = Array.from({ length: 12 }, () => ({
    status: "Not Attempted", // Possible statuses: Completed, Incomplete, Not Attempted
    wrongAnswers: 0,
  }));

  const [progress, setProgress] = useState(initialProgress);

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("mathProgress");
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Function to navigate to level pages
  const navigateToLevel = (level) => {
    router.push(`/grades/1/math/level${level}`); // Navigate to the level page
  };

  // Function to save progress in localStorage
  const saveProgress = () => {
    localStorage.setItem("mathProgress", JSON.stringify(progress));
  };

  // Update the progress when the component unmounts
  useEffect(() => {
    saveProgress();
  }, [progress]);

  // Define light color palette for level cards
  const borderColors = [
    "border-blue-200", // Level 1
    "border-green-200", // Level 2
    "border-yellow-200", // Level 3
    "border-red-200", // Level 4
    "border-purple-200", // Level 5
    "border-pink-200", // Level 6
    "border-teal-200", // Level 7
    "border-indigo-200", // Level 8
    "border-orange-200", // Level 9
    "border-gray-300", // Level 10
    "border-sky-200", // Level 11
    "border-emerald-200", // Level 12
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">Math Levels</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Level Cards */}
          {progress.map((level, index) => (
            <div
              key={index}
              className={`border-4 ${borderColors[index]} ${
                level.status === "Completed"
                  ? "bg-green-50"
                  : level.status === "Incomplete"
                  ? "bg-yellow-50"
                  : "bg-white"
              } p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition`}
              onClick={() => navigateToLevel(index + 1)} // Navigate to level on click
            >
              <h2 className="text-xl font-bold">{`Level ${index + 1}`}</h2>
              <p className="text-sm">
                Click to start exercises for Level {index + 1}
              </p>
              <div className="mt-2">
                <div className="text-lg font-semibold">
                  Status: {level.status}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-gray-200 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold">Status Summary</h2>
          <p>
            Total Levels Completed:{" "}
            {progress.filter((p) => p.status === "Completed").length} / 12
          </p>
          <p>
            Total Wrong Answers:{" "}
            {progress.reduce((acc, level) => acc + level.wrongAnswers, 0)}
          </p>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MathPage;
