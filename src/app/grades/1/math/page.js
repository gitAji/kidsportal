"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../components/ui/BackToTop"; // Import BackToTop button
import ToggleModal from "../../../components/ui/Modal";

// Sample subjects for each category
const subjects = {
  recommended: [
    {
      title: "Counting",
      image: "/images/counting.png", // Replace with the actual image path
      status: "Not Attempted", // Status can be dynamically set later
      score: 0, // Placeholder for the score
      path: "/grades/1/math/counting", // Path to the counting questions
    },
    {
      title: "Introduction to Numbers",
      image: "/images/intro2num.jpg",
      status: "Not Attempted",
      score: 0,
      path: "/grades/1/math/intro_to_numbers",
    },
    {
      title: "Addition",
      image: "/images/addition.png",
      status: "Not Attempted",
      score: 0,
      path: "/grades/1/math/addition",
    },
  ],
  assigned: [
    // Corrected syntax here
    {
      title: "Multiplication",
      image: "/images/multiplication.png",
      status: "Not Attempted",
      score: 0,
      path: "/grades/1/math/multiplication",
    },
    {
      title: "Division",
      image: "/images/division.png",
      status: "Not Attempted",
      score: 0,
      path: "/grades/1/math/division",
    },
    {
      title: "Clock",
      image: "/images/clock.jpg",
      status: "Not Attempted",
      score: 0,
      path: "/grades/1/math/clock",
    },
  ],
  // Add more subjects as needed
};

const MathPage = () => {
  const router = useRouter();

  // State for the modal and tab selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("recommended"); // Default tab

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("mathProgress");
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      Object.keys(subjects).forEach((key) => {
        subjects[key].forEach((subject, index) => {
          subject.status = progress[index]?.status || "Not Attempted"; // Update subject status
          subject.score = progress[index]?.score || 0; // Update score if available
        });
      });
    }
  }, []);

  // Function to navigate to subject pages
  const navigateToSubject = (path) => {
    router.push(path); // Navigate to the subject page
  };

  // Function to change the active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update active tab
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Math Subjects
        </h1>

        {/* Tab Navigation */}
        <div className="flex -space-x-8 mb-4 gap-5">
          <button
            className={`flex-2 py-2 px-12 border-spacing-4 font-semibold text-center ${
              activeTab === "recommended"
                ? "bg-blue-400 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => handleTabChange("recommended")}
          >
            Recommended
          </button>
          <button
            className={`flex-2 py-2 px-12 font-semibold text-center ${
              activeTab === "assigned"
                ? "bg-blue-400 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
            onClick={() => handleTabChange("assigned")}
          >
            Assigned by Parents
          </button>
          {/* Add more tabs as needed */}
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects[activeTab].map((subject, index) => (
            <div
              key={index}
              className="border-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:scale-105 m-2"
              onClick={() => navigateToSubject(subject.path)} // Navigate to subject on click
            >
              <Image
                src={subject.image}
                alt={subject.title}
                width={300} // Placeholder width
                height={128} // Placeholder height (h-32 = 128px)
                className="w-full h-32 rounded-t-lg object-cover" // Card image
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {subject.title}
                </h2>
                <div className="mt-2 flex items-center">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      subject.status === "Completed"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="ml-2 text-gray-700">
                    {subject.status === "Completed"
                      ? "Completed"
                      : "Not Attempted"}
                  </span>
                </div>
                <div className="mt-1 text-gray-700">
                  Score: <span className="font-semibold">{subject.score}</span>
                </div>
              </div>
            </div>
          ))}
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

export default MathPage;
