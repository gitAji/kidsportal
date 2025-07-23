"use client";

import React from "react";
import { FaCommentDots } from "react-icons/fa";

const FloatingChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-white text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 z-50"
      aria-label="Open chat"
    >
      <FaCommentDots className="text-2xl" />
    </button>
  );
};

export default FloatingChatButton;
