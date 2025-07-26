"use client";
import React from 'react';
import { FaBook, FaCalculator, FaGlobe, FaFlask } from 'react-icons/fa';

const subjects = [
  { name: 'English', icon: <FaBook />, color: 'bg-blue-500' },
  { name: 'Math', icon: <FaCalculator />, color: 'bg-green-500' },
  { name: 'Social Studies', icon: <FaGlobe />, color: 'bg-yellow-500' },
  { name: 'Science', icon: <FaFlask />, color: 'bg-purple-500' },
];

const SubjectsSection = () => {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {subjects.map((subject, index) => (
          <div key={index} className={`p-8 rounded-2xl shadow-lg text-white text-center transform transition-transform duration-300 hover:scale-105 ${subject.color}`}>
            <div className="text-6xl mb-4 inline-block">{subject.icon}</div>
            <h3 className="text-3xl font-bold">{subject.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubjectsSection;