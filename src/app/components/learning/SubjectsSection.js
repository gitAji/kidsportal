'use client';
import React from 'react';
import Image from 'next/image';

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

export default function SubjectsSection() {
  return (
    <div className="container mx-auto text-center px-4">
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
                    loading="lazy"
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
    </div>
  );
}
