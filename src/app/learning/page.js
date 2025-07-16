"use client"; // Ensure this component is treated as a client component

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  FaBookOpen,
  FaTasks,
  FaGraduationCap,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaClock,
} from "react-icons/fa";

const BackToTop = dynamic(() => import("../components/ui/BackToTop"), {
  ssr: false,
});

export default function LearningPage() {
  const subjects = [
    {
      name: "Mathematics",
      description:
        "Fun and engaging math lessons from basic counting to complex problem-solving.",
      image: "/images/math.jpg",
    },
    {
      name: "English",
      description:
        "Improve reading, writing, and communication skills with interactive English modules.",
      image: "/images/english.jpg",
    },
    {
      name: "Science",
      description:
        "Explore the wonders of science through exciting experiments and discoveries.",
      image: "/images/science.jpg",
    },
    {
      name: "Art & Creativity",
      description:
        "Unleash your child's imagination with creative art projects and drawing lessons.",
      image: "/images/art.jpg",
    },
    {
      name: "Social Studies",
      description:
        "Learn about history, geography, and civics in an engaging way.",
      image: "/images/social.jpg",
    },
    {
      name: "Technology",
      description:
        "Introduction to basic computer skills and digital literacy.",
      image: "/images/tech.jpg",
    },
    {
      name: "Tamil",
      description:
        "Learn the Tamil language, including reading, writing, and speaking.",
      image: "/images/அ.png",
    },
  ];

  const learningSteps = [
    {
      icon: <FaBookOpen className="text-4xl text-blue-500 mb-4" />,
      title: "Interactive Lessons & Levels",
      description:
        "Our curriculum is broken down into engaging lessons and progressive levels, ensuring a smooth learning journey.",
    },
    {
      icon: <FaTasks className="text-4xl text-green-500 mb-4" />,
      title: "Hands-on Tasks & Quizzes",
      description:
        "Reinforce learning with practical tasks and fun quizzes designed to test understanding and build confidence.",
    },
    {
      icon: <FaGraduationCap className="text-4xl text-purple-500 mb-4" />,
      title: "Comprehensive Exams",
      description:
        "Regular assessments and comprehensive exams help track progress and identify areas for improvement.",
    },
    {
      icon: <FaLaptopCode className="text-4xl text-red-500 mb-4" />,
      title: "Interactive Learning",
      description:
        "Our platform uses gamification and interactive elements to make learning an exciting adventure.",
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl text-yellow-500 mb-4" />,
      title: "Expert Teachers",
      description:
        "Learn from experienced and passionate educators who make complex topics easy to understand.",
    },
    {
      icon: <FaClock className="text-4xl text-teal-500 mb-4" />,
      title: "24/7 Online Help",
      description:
        "Get support whenever you need it with our round-the-clock online assistance.",
    },
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6 animate-fade-in-down">
            Discover a World of Knowledge!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            Engaging and interactive learning experiences across a variety of
            subjects, designed for young minds.
          </p>

          <h2 className="text-4xl font-bold text-blue-700 mb-10">
            Our Subjects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {subject.name}
                  </h3>
                  <p className="text-gray-600">{subject.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-blue-700 mt-20 mb-10">
            How We Make Learning Fun
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {learningSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200"
              >
                {step.icon}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BackToTop />
    </>
  );
}
