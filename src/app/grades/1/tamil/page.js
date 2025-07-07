"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Header from "../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../components/ui/BackToTop"; // Import BackToTop button
import ToggleModal from "../../../components/ui/Modal";

const TamilPage = () => {
  const router = useRouter();

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Initialize progress state with 12 levels
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
    router.push(`/grades/1/tamil/level${level}`); // Navigate to the level page
  };

  // Save progress to localStorage whenever progress changes
  useEffect(() => {
    const saveProgress = () => {
      localStorage.setItem("mathProgress", JSON.stringify(progress));
    };
    saveProgress();
  }, [progress]);

  const levelColors = [
    "border-red-200",
    "border-green-200",
    "border-blue-200",
    "border-yellow-200",
    "border-purple-200",
    "border-pink-200",
    "border-indigo-200",
    "border-orange-200",
    "border-teal-200",
    "border-cyan-200",
    "border-lime-200",
    "border-amber-200",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Tamil Levels
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Level Cards */}
          {progress.map((level, index) => (
            <div
              key={index}
              className={`border-4 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:scale-105 ${
                levelColors[index]
              } ${
                level.status === "Completed"
                  ? "border-green-500"
                  : level.status === "Incomplete"
                  ? "border-yellow-500"
                  : "border-gray-400"
              } m-2`} // Add margin
              onClick={() => navigateToLevel(index + 1)} // Navigate to level on click
            >
              <h2 className="text-xl font-bold text-gray-800">{`Level ${
                index + 1
              }`}</h2>{" "}
              {/* Changed to dark gray */}
              <p className="text-sm text-gray-700">
                Click to start exercises for Level {index + 1}
              </p>{" "}
              {/* Changed to darker color */}
              <div className="mt-2">
                <div className="text-lg font-semibold text-gray-800">
                  Status:{" "}
                  <span
                    className={
                      level.status === "Completed"
                        ? "text-green-500"
                        : level.status === "Incomplete"
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }
                  >
                    {level.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Summary Section */}
        <div className="mt-8 bg-gray-200 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-800">Status Summary</h2>{" "}
          {/* Changed to dark gray */}
          <p>
            Total Levels Completed:{" "}
            <span className="font-semibold">
              {progress.filter((p) => p.status === "Completed").length} / 12
            </span>
          </p>
          <p>
            Total Wrong Answers:{" "}
            <span className="font-semibold">
              {progress.reduce((acc, level) => acc + level.wrongAnswers, 0)}
            </span>
          </p>
        </div>
      </main>
      <Footer />
      <BackToTop />
      {/* Toggle Modal for SignIn and SignUp */}
      <ToggleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </div>
  );
};

export default TamilPage;
