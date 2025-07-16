"use client";
// components/ui/VoiceButton.js
import React from "react";
import { FaVolumeUp } from "react-icons/fa"; // Importing a volume icon from react-icons

const VoiceButton = ({ questionText, lang = "en-US" }) => {
  const speakQuestion = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = lang; // Set the language (default is English)
    synth.speak(utterance); // Speak the question
  };

  return (
    <button
      onClick={speakQuestion}
      className="flex items-center bg-gradient-to-r from-green-400 to-green-500 text-white py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      title="Play Question" // Tooltip for accessibility
    >
      <FaVolumeUp className="mr-2" /> {/* Icon with margin for spacing */}
      <span>Play</span> {/* Text label */}
    </button>
  );
};

export default VoiceButton;
