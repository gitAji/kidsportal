"use client"; // Ensure this component is treated as a client component

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { faGoogle, faArrowUp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Header from "./components/layout/header/Header"; // Header component
import Footer from "./components/layout/footer/Footer"; // Footer component
import ToggleModal from "./components/ui/Modal"; // Modal component for login and register
import GradeCard from "./components/ui/GradeCard"; // Import the GradeCard component
import BackToTop from "./components/ui/BackToTop";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const gradeSectionRef = useRef(null); // Ref for scrolling to grade section

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // State for testimonials
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = [
    {
      text: "This platform helped me improve my math skills significantly. I feel more confident now.",
      author: "Nila",
    },
    {
      text: "The interactive lessons are amazing! I enjoyed learning with them.",
      author: "Senthil",
    },
    {
      text: "I love how the lessons are broken down step-by-step. It makes everything easier to understand.",
      author: "Anitha",
    },
  ];

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
    { subject: "Math", color: "bg-[#FF6347]", textColor: "text-white" }, // Tomato
    { subject: "Tamil", color: "bg-[#32CD32]", textColor: "text-white" }, // Lime Green
    { subject: "English", color: "bg-[#1E90FF]", textColor: "text-white" }, // Dodger Blue
    { subject: "Ariviyal", color: "bg-[#FFD700]", textColor: "text-black" }, // Gold (Science in Tamil)
  ];

  // Function to scroll to the grade section
  const scrollToGradeSection = () => {
    if (gradeSectionRef.current) {
      gradeSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to generate the link dynamically based on grade and subject
  const generateLink = (grade, subject) => {
    let levelPath = '';
    switch (subject.toLowerCase()) {
      case 'math':
        levelPath = 'counting'; // Assuming 'counting' is the first level for math
        break;
      case 'english':
        levelPath = 'level1';
        break;
      case 'tamil':
        levelPath = 'level1';
        break;
      case 'ariviyal':
        levelPath = 'level1';
        break;
      default:
        levelPath = 'level1'; // Default to level1 if subject not specifically handled
    }
    return `/grades/${grade}/${subject.toLowerCase()}/${levelPath}`;
  };

  // Function to toggle modal for SignIn/SignUp
  const toggleModal = (register = false) => {
    setIsRegister(register);
    setIsModalOpen(!isModalOpen);
  };

  // Auto slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      {/* Header Section */}
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />

      {/* Hero Section */}
      <section className="relative bg-blue-100 py-20 h-[500px] overflow-hidden">
        <Image
          src="/images/intro.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-30"
          priority
        />

        {/* Decorative Images */}
        <div className="absolute top-10 left-10 w-24 h-24 animate-pulse">
          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={90}
            height={90}
          />
        </div>
        <div className="absolute top-20 right-10 w-32 h-32 animate-pulse delay-500">
          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={120}
            height={120}
          />
        </div>
        <div className="absolute bottom-10 left-1/4 w-48 h-24">
          <Image
            src="/images/rainbow.png"
            alt="Rainbow"
            width={192}
            height={96}
          />
        </div>

        <div className="container mx-auto text-center relative z-10 px-4">
          <h1 className="text-5xl font-extrabold text-blue-600 drop-shadow-lg">
            Welcome to a World of Fun Learning!
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Explore exciting games and activities that make learning an
            adventure.
          </p>
          <div className="mt-8">
            <button
              onClick={scrollToGradeSection}
              className="bg-yellow-400 text-white py-4 px-10 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300"
            >
              Let's Get Started!
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800">Key Features</h2>
          <p className="text-gray-600 mt-4">
            Unlock new opportunities with our platform.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-[#E0E7FF] p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-xl font-semibold">Interactive Lessons</h3>
              <p className="mt-2">
                Engage with interactive content designed to make learning fun.
              </p>
            </div>
            <div className="bg-[#D1FAE5] p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-xl font-semibold">Expert Teachers</h3>
              <p className="mt-2">
                Learn from the best instructors with years of experience.
              </p>
            </div>
            <div className="bg-[#FFEDD5] p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-xl font-semibold">Progress Tracking</h3>
              <p className="mt-2">
                Monitor your progress with detailed reports and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Cards Section */}
      <section ref={gradeSectionRef} className="py-16 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-blue-600 drop-shadow-lg">
            Explore Our Grades
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Choose a grade to start your learning adventure!
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
                generateLink={generateLink} // Pass generateLink function
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800">
            What Our Students Say
          </h2>
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 italic">
                {testimonials[currentSlide].text}
              </p>
              <p className="font-semibold mt-2">
                - {testimonials[currentSlide].author}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
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