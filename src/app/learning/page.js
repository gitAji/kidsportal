"use client"; // Ensure this component is treated as a client component

import Header from "../components/layout/header/Header"; // Header component
import Footer from "../components/layout/footer/Footer"; // Footer component
import BackToTop from "../components/ui/BackToTop"; // BackToTop component
import Image from "next/image";
import ToggleModal from "../components/ui/Modal";
import { useState } from "react";

export default function LearningPage() {
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  // Subjects offered
  const subjects = [
    {
      name: "Mathematics",
      description:
        "Explore the world of numbers, equations, and problem-solving.",
      image: "", // Example image path
    },
    {
      name: "Science",
      description: "Dive into the wonders of physics, chemistry, and biology.",
      image: "", // Example image path
    },
    {
      name: "English Language Arts",
      description: "Enhance your reading, writing, and communication skills.",
      image: "", // Example image path
    },
    {
      name: "Social Studies",
      description: "Understand history, geography, and the world around you.",
      image: "", // Example image path
    },
    {
      name: "Art & Creativity",
      description:
        "Express yourself through art, music, and creative projects.",
      image: "", // Example image path
    },
  ];

  return (
    <>
      {/* Header Section */}
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      {/* Learning Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">Learning Hub</h1>
          <p className="mt-4 text-gray-600">
            Discover engaging content designed to enhance your child's learning
            experience.
          </p>

          {/* Subjects Offered */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <Image
                  src={subject.image}
                  alt={subject.name}
                  className="w-32 h-32 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-blue-600">
                  {subject.name}
                </h3>
                <p className="mt-2 text-gray-600">{subject.description}</p>
              </div>
            ))}
          </div>

          {/* Learning Features */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-blue-600">
              Features of Our Learning Platform
            </h2>
            <ul className="mt-6 list-disc list-inside text-left max-w-lg mx-auto">
              <li className="mt-2 text-gray-600">
                <strong>Interactive Lessons:</strong> Engaging and interactive
                lessons that make learning fun.
              </li>
              <li className="mt-2 text-gray-600">
                <strong>Progress Tracking:</strong> Monitor your child’s
                progress with detailed reports.
              </li>
              <li className="mt-2 text-gray-600">
                <strong>Personalized Learning:</strong> Tailored content to meet
                individual learning needs.
              </li>
              <li className="mt-2 text-gray-600">
                <strong>Expert Tutors:</strong> Access to qualified tutors for
                additional support.
              </li>
              <li className="mt-2 text-gray-600">
                <strong>Resource Library:</strong> A vast library of resources,
                videos, and practice exercises.
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
      <BackToTop /> {/* Toggle Modal for SignIn and SignUp */}
      <ToggleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </>
  );
}
