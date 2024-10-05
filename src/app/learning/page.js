"use client"; // Ensure this component is treated as a client component

import Header from "../components/layout/header/Header"; // Header component
import Footer from "../components/layout/footer/Footer"; // Footer component
import BackToTop from "../components/ui/BackToTop"; // BackToTop component
import Image from "next/image"; // Import Next.js Image component

export default function LearningPage() {
  // Subjects offered
  const subjects = [
    {
      name: "Mathematics",
      description:
        "Explore the world of numbers, equations, and problem-solving.",
      image: "/images/math.jpg", // Example image path
      width: 300,
      height: 200,
    },
    {
      name: "Science",
      description: "Dive into the wonders of physics, chemistry, and biology.",
      image: "/images/science.jpg", // Example image path
      width: 300,
      height: 200,
    },
    {
      name: "English Language Arts",
      description: "Enhance your reading, writing, and communication skills.",
      image: "/images/english.jpg", // Example image path
      width: 300,
      height: 200,
    },
    {
      name: "Social Studies",
      description: "Understand history, geography, and the world around you.",
      image: "/images/social.jpg", // Example image path
      width: 300,
      height: 200,
    },
    {
      name: "Art & Creativity",
      description:
        "Express yourself through art, music, and creative projects.",
      image: "/images/art.jpg", // Example image path
      width: 300,
      height: 200,
    },
    {
      name: "Technology",
      description:
        "Discover the world of computers, programming, and innovation.",
      image: "/images/tech.jpg", // Example image path
      width: 300,
      height: 200,
    },
  ];

  // Why Choose Us details
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

  return (
    <>
      {/* Header Section */}
      <Header />

      {/* Learning Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">Learning Hub</h1>
          <p className="mt-4 text-gray-600">
            Discover engaging content designed to enhance your child learning
            experience.
          </p>

          {/* Subjects Offered */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    layout="fill" // Use layout="fill" for responsive images
                    objectFit="cover" // Ensures the image covers the entire area
                    loading="lazy" // Enable lazy loading
                    className="rounded-t-lg" // Optional: Rounds the top corners of the image
                  />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mt-4">
                  {subject.name}
                </h3>
                <p className="mt-2 text-gray-600">{subject.description}</p>
              </div>
            ))}
          </div>

          {/* Why Choose Us Section */}
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

      {/* Footer Section */}
      <Footer />
      <BackToTop />
    </>
  );
}
