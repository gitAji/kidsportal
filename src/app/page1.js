"use client"; // Ensure this component is treated as a client component

import { useState } from "react"; // Import useState for modal state management
import { useRouter } from "next/navigation"; // Using next/navigation
import { signIn } from "next-auth/react"; // Import the signIn function
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  // State for the modal (if needed)
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

  // Function to toggle modal
  const toggleModal = (register = false) => {
    setIsRegister(register);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={50}
              className="mr-2"
            />
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Learning
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Analytics
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Help
            </a>
          </nav>
          <div className="flex space-x-4">
            <button
              className="text-gray-600"
              onClick={() => toggleModal(false)}
            >
              Sign In
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => toggleModal(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

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
        <img
          src="/hero-image.png"
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
              <div
                key={gradeIndex}
                className={`bg-white p-6 rounded-lg shadow-lg text-center ${borderColors[gradeIndex]} border-2`}
              >
                <h3 className="text-2xl font-bold text-blue-600 mb-2">
                  {gradeIndex + 1}
                </h3>
                <h4 className="text-lg font-medium">
                  {gradeLabels[gradeIndex]}
                </h4>
                <p className="mt-4 text-gray-600">Subjects:</p>
                <div className="mt-2 flex flex-wrap justify-center space-x-2">
                  {/* Loop through subjects */}
                  {subjectColors.map((subject) => (
                    <a
                      key={subject.subject}
                      href={generateLink(gradeIndex + 1, subject.subject)} // Generate the link dynamically
                      className={`rounded-full text-white py-1 px-2 text-sm ${subject.color}`}
                    >
                      {subject.subject}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Curvy Footer */}
      <footer className="relative bg-gray-800 text-white py-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MyLearning Platform. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
      {/* Scroll to Top Button */}
      {/* Scroll to Top Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700"
        onClick={scrollToTop}
      >
        <FontAwesomeIcon icon={faArrowUp} size="lg" />
      </button>
      {/* Modal for Login/Registration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              {isRegister ? "Register" : "Login"}
            </h3>
            <form>
              {/* Email/Password Fields (only shown for email/password authentication) */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-300 rounded w-full py-2 px-3"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-300 rounded w-full py-2 px-3"
                  placeholder="Enter your password"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
                >
                  {isRegister ? "Register" : "Login"}
                </button>
              </div>
            </form>

            {/* Divider for alternative logins */}
            <div className="flex items-center justify-center mt-4">
              <span className="bg-gray-300 h-px w-full"></span>
              <span className="text-gray-600 px-3">OR</span>
              <span className="bg-gray-300 h-px w-full"></span>
            </div>

            {/* Sign in with Google */}
            <div className="mt-4 text-center">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded w-full flex items-center justify-center"
                onClick={() => signIn("google")} // Use Google sign-in through NextAuth.js
              >
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                Sign {isRegister ? "Up" : "In"} with Google
              </button>
            </div>

            {/* Sign in with Vipps (Structure Only) */}
            <div className="mt-4 text-center">
              <button
                className="bg-orange-500 text-white py-2 px-4 rounded w-full flex items-center justify-center"
                onClick={() => handleVippsLogin()} // Placeholder for Vipps integration
              >
                {/* Add a Vipps icon */}
                Sign {isRegister ? "Up" : "In"} with Vipps
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Login here" : "Register here"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
