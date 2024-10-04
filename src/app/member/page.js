"use client"; // Ensure this component is treated as a client component
import { useState } from "react"; // Import useState for modal state management
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination"; // Import pagination styles
import { Pagination } from "swiper/modules"; // Import Pagination module
import Image from "next/image";

export default function HomePage() {
  // Testimonials data
  const testimonials = [
    {
      text: "This platform has transformed my learning experience!",
      name: "John Doe",
    },
    {
      text: "Amazing resources and support for my studies.",
      name: "Jane Smith",
    },
    {
      text: "Highly recommended for anyone looking to improve their skills!",
      name: "Sam Wilson",
    },
  ];

  // State management for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Function to toggle modal
  const toggleModal = (register = false) => {
    setIsRegister(register);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.png" // Path to your logo
              alt="MyLearning Logo" // Alt text for accessibility
              width={80} // Set width of the logo
              height={50} // Set height of the logo
              className="mr-2" // Optional class for margin
            />
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Learning
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Analytics
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Help
            </a>
          </nav>
          <div className="flex space-x-4">
            <button
              className="text-gray-600"
              onClick={() => toggleModal(false)}
            >
              Sign In
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => toggleModal(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative bg-blue-50 py-20">
        <Image
          src="/hero-image.jpg" // Path to your hero image
          alt="Hero Image"
          layout="fill" // Cover the entire section
          objectFit="cover" // Ensure it covers the section without distortion
          className="absolute inset-0 opacity-50" // Set to 50% opacity
        />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl font-bold text-blue-600">
            Master skills with in-depth learning
          </h1>
          <p className="mt-4 text-gray-600">
            Our platform helps you build the foundational skills you need for
            school and beyond.
          </p>
          <div className="mt-8">
            <button className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Swiper */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">What Our Users Say</h2>
          <p className="text-gray-600 mt-4">
            Hear from our satisfied users about their learning experience.
          </p>
          <Swiper
            pagination={{ clickable: true }} // Enable pagination
            modules={[Pagination]} // Pass the Pagination module
            className="mySwiper mt-8"
            autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto slide every 3 seconds
            loop={true} // Loop through slides
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <p className="mt-4 font-semibold text-blue-600">
                  {testimonial.name}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Curvy Footer */}
      <footer className="relative bg-gray-800 text-white py-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MyLearning Platform. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>

      {/* Modal for Login/Register */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <h2 className="text-2xl font-bold mb-4">
              {isRegister ? "Register" : "Login"}
            </h2>
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={toggleModal}
            >
              &times; {/* Close button */}
            </button>
            <form>
              {isRegister && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  required
                />
              )}
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                required
              />
              {isRegister && (
                <input
                  type="text"
                  placeholder="Address"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  required
                />
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded w-full"
              >
                {isRegister ? "Sign Up" : "Sign In"}
              </button>
              <p className="mt-4 text-sm text-center">
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={() => toggleModal(!isRegister)}
                >
                  {isRegister ? "Login" : "Register"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
