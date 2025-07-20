'use client';
import React from 'react';
import {
  FaBookOpen,
  FaTasks,
  FaGraduationCap,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaClock,
} from "react-icons/fa";

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

export default function HowWeMakeLearningFunSection() {
  return (
    <div className="container mx-auto text-center px-4">
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
  );
}
