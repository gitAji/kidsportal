"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-16 right-4">
      {isVisible && (
        <button
          className="bg-gray-500 text-white py-2 px-3 rounded-full shadow-lg hover:bg-gray-600 animate-bounce"
          onClick={scrollToTop}
        >
          <FontAwesomeIcon icon={faArrowUp} size="md" />
        </button>
      )}
    </div>
  );
}