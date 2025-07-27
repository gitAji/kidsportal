"use client";

import React from 'react';
import { FaVolumeUp } from 'react-icons/fa';

export default function AudioPlayer({ text }) {
  const speakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // You can make this dynamic if needed
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
      alert("Text-to-speech not supported in your browser.");
    }
  };

  return (
    <button onClick={speakText} className="ml-2 p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <FaVolumeUp className="text-lg" />
    </button>
  );
}
