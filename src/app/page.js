"use client"; // Ensure this component is treated as a client component

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

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
      author: "Student A",
    },
    {
      text: "The interactive lessons are amazing! I enjoyed learning with them.",
      author: "Student B",
    },
    {
      text: "I love how the lessons are broken down step-by-step. It makes everything easier to understand.",
      author: "Student C",
    },
  ];

  const [gradesData, setGradesData] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [errorGrades, setErrorGrades] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const subjectsCollectionRef = collection(db, "subjects");
        const querySnapshot = await getDocs(subjectsCollectionRef);
        const fetchedSubjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Group subjects by grade (assuming grade is part of subject data or derived)
        // For now, let's create a simplified structure based on the existing gradeLabels concept
        // In a real scenario, grades might be a separate collection or derived from levels
        const gradesMap = new Map();
        fetchedSubjects.forEach(subject => {
          // This is a placeholder. You'll need a way to associate subjects with grades.
          // For demonstration, I'll just create a single 'grade' entry for all subjects.
          const gradeKey = "all"; // Placeholder for a single grade grouping
          if (!gradesMap.has(gradeKey)) {
            gradesMap.set(gradeKey, { gradeLabel: "All Grades", subjects: [] });
          }
          gradesMap.get(gradeKey).subjects.push(subject);
        });

        // Convert map to array and sort if necessary
        setGradesData(Array.from(gradesMap.values()));
      } catch (err) {
        console.error("Error fetching grades:", err);
        setErrorGrades("Failed to load grades.");
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchGrades();
  }, []);

  // Function to scroll to the grade section
  const scrollToGradeSection = () => {
    if (gradeSectionRef.current) {
      gradeSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to generate the link dynamically based on subject ID
  const generateLink = (subjectId) => {
    return `/learning/${subjectId}`;
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
      <section className="relative bg-blue-50 py-20 h-[400px] ">
        <Image
          src="/images/intro.jpeg"
          alt="Hero"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="container mx-auto text-center relative z-1 px-4">
          <h1 className="text-4xl font-bold text-blue-600">
            Master skills with in-depth learning
          </h1>
          <p className="mt-4 text-gray-600">
            Our platform helps you build the foundational skills you need for
            school and beyond.
          </p>
          <div className="mt-8">
            <button
              onClick={scrollToGradeSection}
              className="bg-blue-600 text-white py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700"
            >
              Get Started
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
          <h2 className="text-3xl font-bold text-blue-600">
            Explore Our Grades
          </h2>
          <p className="text-gray-600 mt-4">
            Choose a grade to access various subjects designed to engage
            students.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loadingGrades ? (
              <p>Loading grades...</p>
            ) : errorGrades ? (
              <p className="text-red-500">Error: {errorGrades}</p>
            ) : gradesData.length === 0 ? (
              <p className="text-gray-700">No grades available yet.</p>
            ) : (
              gradesData.map((gradeEntry, index) => (
                <div key={index} className="w-full">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{gradeEntry.gradeLabel}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {gradeEntry.subjects.map((subject) => (
                      <GradeCard
                        key={subject.id}
                        gradeLabel={subject.name}
                        borderColor={subject.imageUrl ? '' : 'border-gray-300'} // Use image or default border
                        subjectColors={[]} // Not used directly here, but passed for consistency if needed
                        generateLink={() => generateLink(subject.id)}
                        imageUrl={subject.imageUrl}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
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