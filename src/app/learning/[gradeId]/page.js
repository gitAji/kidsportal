'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Header = dynamic(() => import('../../components/layout/header/Header'), { ssr: false });
const Footer = dynamic(() => import('../../components/layout/footer/Footer'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/ui/BackToTop'), { ssr: false });

export default function GradeSubjectsPage({ params }) {
  const router = useRouter();
  const { gradeId } = params;

  // Static subjects data for demonstration (will be replaced with dynamic data later)
  const subjects = [
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Explore the world of numbers, equations, and problem-solving.",
      image: "/images/math.jpg",
    },
    {
      id: "science",
      name: "Science",
      description: "Dive into the wonders of physics, chemistry, and biology.",
      image: "/images/science.jpg",
    },
    {
      id: "english",
      name: "English Language Arts",
      description: "Enhance your reading, writing, and communication skills.",
      image: "/images/english.jpg",
    },
    {
      id: "social",
      name: "Social Studies",
      description: "Understand history, geography, and the world around you.",
      image: "/images/social.jpg",
    },
    {
      id: "art",
      name: "Art & Creativity",
      description: "Express yourself through art, music, and creative projects.",
      image: "/images/art.jpg",
    },
    {
      id: "technology",
      name: "Technology",
      description: "Discover the world of computers, programming, and innovation.",
      image: "/images/tech.jpg",
    },
  ];

  return (
    <>
      <Header />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">{gradeId.replace('grade', 'Grade ')} Subjects</h1>
          <p className="mt-4 text-gray-600">
            Select a subject to begin your learning journey.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/learning/${gradeId}/${subject.id}`)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={subject.image || "/images/placeholder.jpg"}
                    alt={subject.name}
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mt-4">
                  {subject.name}
                </h3>
                <p className="mt-2 text-gray-600">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
