import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function BackToTop() {
  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700"
      onClick={scrollToTop}
    >
      <FontAwesomeIcon icon={faArrowUp} size="lg" />
    </button>
  );
}
