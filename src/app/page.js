"use client"; // Ensure this component is treated as a client component

import { useState } from "react"; // Import useState for modal state management
import { useRouter } from "next/navigation"; // Using next/navigation
import { signIn } from "next-auth/react"; // Import the signIn function
import { faGoogle, faArrowUp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Header from "./components/layout/header/Header"; // Header component
import Footer from "./components/layout/footer/Footer"; // Footer component
import ToggleModal from "./components/ui/Modal"; // Modal component for login and register
import GradeCard from "./components/ui/GradeCard"; // Import the GradeCard component
import BackToTop from "./components/ui/BackToTop";

export default function HomePage() {
  const router = useRouter();

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Darker colors for grade card borders
  const borderColors = [
    "border-[#8B0000]", // Dark Red
    "border-[#FF8C00]", // Dark Orange
    "border-[#FFD700]", // Gold
    "border-[#228B22]", // Forest Green
    "border-[#20B2AA]", // Light Sea Green
    "border-[#4682B4]", // Steel Blue
    "border-[#6A5ACD]", // Slate Blue
    "border-[#C71585]", // Medium Violet Red
    "border-[#FF4500]", // Orange Red
    "border-[#B22222]", // Firebrick
    "border-[#8A2BE2]", // Blue Violet
    "border-[#D2691E]", // Chocolate
  ];

  // Grade labels
  const gradeLabels = [
    "First Grade",
    "Second Grade",
    "Third Grade",
    "Fourth Grade",
    "Fifth Grade",
    "Sixth Grade",
    "Seventh Grade",
    "Eighth Grade",
    "Ninth Grade",
    "Tenth Grade",
    "Eleventh Grade",
    "Twelfth Grade",
  ];

  // Unique colors for subjects
  const subjectColors = [
    { subject: "Math", color: "bg-[#FF6347]" }, // Tomato
    { subject: "Tamil", color: "bg-[#32CD32]" }, // Lime Green
    { subject: "English", color: "bg-[#1E90FF]" }, // Dodger Blue
    { subject: "Ariviyal", color: "bg-[#FFD700]" }, // Gold (Science in Tamil)
  ];

  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to generate the link dynamically based on grade and subject
  const generateLink = (grade, subject) => {
    return `/grades/${grade}/${subject.toLowerCase()}`; // Example: /grades/1/math or /grades/2/english
  };

  // Function to toggle modal for SignIn/SignUp
  const toggleModal = (register = false) => {
    setIsRegister(register);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Header Section */}
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />

      {/* Hero Section */}
      <section className="relative bg-blue-50 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-600">
            Master skills with in-depth learning
          </h1>
          <p className="mt-4 text-gray-600">
            Our platform helps you build the foundational skills you need for
            school and beyond.
          </p>
          <div className="mt-8">
            <button className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
        {/* Placeholder for Hero Image */}
        <Image
          src=""
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      </section>

      {/* Features Section with Cards (Grades 1-12) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Explore Our Grades</h2>
          <p className="text-gray-600 mt-4">
            Choose a grade to access various subjects designed to engage
            students.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Loop through grades from 1-12 */}
            {Array.from({ length: 12 }, (_, gradeIndex) => (
              <GradeCard
                key={gradeIndex}
                gradeIndex={gradeIndex}
                gradeLabel={gradeLabels[gradeIndex]}
                borderColor={borderColors[gradeIndex]}
                subjectColors={subjectColors}
                generateLink={generateLink}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
      <BackToTop />
      {/* Toggle Modal for SignIn and SignUp */}
      <ToggleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </>
  );
}
