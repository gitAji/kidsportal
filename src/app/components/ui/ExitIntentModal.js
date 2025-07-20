"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ExitIntentModal({
  isOpen,
  onClose,
  setIsModalOpen,
  setIsRegister,
  isLoggedIn, // <-- New prop
}) {
  const router = useRouter();

  // Hide modal if user is already logged in or it's not open
  if (!isOpen || isLoggedIn) return null;

  const handleRegisterClick = () => {
    onClose(); // Close exit intent modal
    setIsRegister(true); // Set AuthModal to register view
    setIsModalOpen(true); // Open AuthModal
  };

  const handleExploreClick = () => {
    onClose(); // Close exit intent modal
    router.push("/#gradesCard"); // Navigate to section
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-8 rounded-lg shadow-lg text-center w-full max-w-md mx-4 relative">
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-200 text-2xl p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2
          id="exit-intent-title"
          className="text-3xl font-bold text-white mb-4"
        >
          Don’t Go Yet!
        </h2>
        <p className="text-white mb-6">
          Discover the fun learning experience at KidsPortal.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-white text-blue-600 py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
            onClick={handleRegisterClick}
          >
            Register Now
          </button>
          <button
            className="bg-teal-300 text-gray-800 py-3 px-6 rounded-lg shadow-md hover:bg-teal-400 transition-colors duration-200"
            onClick={handleExploreClick}
          >
            Explore th Site
          </button>
        </div>
      </div>
    </div>
  );
}
