"use client";

import React, { useEffect, useState } from 'react';
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import BackToTop from "../components/ui/BackToTop";
import Image from "next/image";
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function LearningPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const subjectsCollectionRef = collection(db, 'subjects');
    const q = query(subjectsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubjects(subjectsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching subjects:", err);
      setError("Failed to load subjects.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Why Choose Us details (static for now)
  const whyChooseUs = [
    {
      title: "Interactive Lessons",
      description: "Engaging and interactive lessons that make learning fun.",
    },
    {
      title: "Progress Tracking",
      description: "Monitor your child’s progress with detailed reports.",
    },
    {
      title: "Personalized Learning",
      description: "Tailored content to meet individual learning needs.",
    },
    {
      title: "Expert Tutors",
      description: "Access to qualified tutors for additional support.",
    },
    {
      title: "Resource Library",
      description:
        "A vast library of resources, videos, and practice exercises.",
    },
    {
      title: "Flexible Scheduling",
      description: "Choose learning times that fit your schedule.",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">Loading learning content...</p>
            <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">Learning Hub</h1>
          <p className="mt-4 text-gray-600">
            Discover engaging content designed to enhance your child learning
            experience.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.length === 0 ? (
              <p className="text-gray-700">No subjects available yet.</p>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/learning/${subject.id}`)} // Add onClick to navigate
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={subject.image || '/images/placeholder.jpg'}
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
              ))
            )}
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-blue-600">Why Choose Us?</h2>
            <p className="mt-4 text-gray-600">
              Our learning platform offers a variety of features designed to
              enhance your child education.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
                >
                  <h3 className="text-xl font-semibold text-blue-600">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
