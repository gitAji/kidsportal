"use client"; // Ensure this component is treated as a client component

import React, { useEffect, useState } from "react";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import BackToTop from "../components/ui/BackToTop";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LearningPage() {
  // Subjects offered (static data)
  const subjects = [
    {
      id: "mathematics",
      name: "Mathematics",
      description:
        "Explore the world of numbers, equations, and problem-solving.",
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
      description:
        "Express yourself through art, music, and creative projects.",
      image: "/images/art.jpg",
    },
    {
      id: "technology",
      name: "Technology",
      description:
        "Discover the world of computers, programming, and innovation.",
      image: "/images/tech.jpg",
    },
  ];

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

  const router = useRouter();

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
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/learning/${subject.id}`)}
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
