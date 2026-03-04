"use client";

import React, { useEffect, useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';

export default function AudioPlayer({ text, lang = 'en-US' }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    // Pre-load voices so they are ready when clicked
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    if ('speechSynthesis' in window) {
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speakText = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // Kid friendly settings
      utterance.rate = 0.85; // A bit slower so kids can understand
      utterance.pitch = 1.2; // Slightly higher pitch for a friendly tone

      if (voices.length > 0) {
        const englishVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));

        let bestVoice =
          englishVoices.find(v => v.name.includes('Google UK English Female')) ||
          englishVoices.find(v => v.name.includes('Google US English')) ||
          englishVoices.find(v => v.name.includes('Samantha')) ||
          englishVoices.find(v => v.name.includes('Victoria')) ||
          englishVoices.find(v => v.name.includes('Tessa')) ||
          englishVoices.find(v => v.name.includes('Google')) ||
          englishVoices[0];

        if (bestVoice) {
          utterance.voice = bestVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  };

  return (
    <button
      onClick={speakText}
      className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all shadow-md active:scale-90"
      aria-label="Play sound"
    >
      <FaVolumeUp className="text-xl" />
    </button>
  );
}
