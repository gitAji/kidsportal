"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { FaVolumeUp, FaStop } from 'react-icons/fa';

export default function AudioPlayer({ text, lang = 'en-US', label, customClassName, icon }) {
  const [voices, setVoices] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Stop speech when text changes (slide navigation) or component unmounts (page navigation)
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
    };
  }, [text]);

  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const speakText = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if ('speechSynthesis' in window) {
      // If already playing, stop it
      if (isPlaying) {
        stopSpeech();
        return;
      }

      window.speechSynthesis.cancel();
      // Strip Markdown asterisks or hash characters so the voice doesn't read them out loud
      const cleanText = (text || "").replace(/[*#_]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;

      // Kid friendly settings
      utterance.rate = 0.85; // A bit slower so kids can understand
      utterance.pitch = 1.2; // Slightly higher pitch for a friendly tone

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

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
      className={customClassName || `p-3 rounded-full ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-all shadow-md active:scale-90`}
      aria-label={isPlaying ? "Stop audio" : "Play sound"}
    >
      {isPlaying ? <FaStop className="text-xl" /> : (icon || <FaVolumeUp className="text-xl" />)}
      {label && <span>{isPlaying ? 'Stop' : label}</span>}
    </button>
  );
}
