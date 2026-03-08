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

      // 1. Clean up text: Strip Markdown (**, #, etc.) and emojis for cleaner speech
      const cleanText = (text || "")
        .replace(/[*#_]/g, "")
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;

      // 2. Kid-friendly expressive settings
      // We use slightly higher pitch for a "friendly teacher" vibe
      utterance.rate = 0.9;
      utterance.pitch = 1.15;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = (err) => {
        console.error("Speech error:", err);
        setIsPlaying(false);
      };

      // 3. Advanced Voice Selection
      if (voices.length > 0) {
        const langCode = lang.split('-')[0].toLowerCase();
        const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode));

        let bestVoice;

        if (langCode === 'en') {
          // Priority list for Premium/Natural sounding English voices
          const priority = [
            'Samantha', 'Google UK English Female', 'Google US English',
            'Premium', 'Natural', 'Serena', 'Daniel', 'Victoria', 'Fiona'
          ];

          for (const namePart of priority) {
            bestVoice = langVoices.find(v => v.name.includes(namePart));
            if (bestVoice) break;
          }

          if (!bestVoice) bestVoice = langVoices[0];
        } else if (langCode === 'ta') {
          // Priority for Tamil voices
          const priority = ['Valluvar', 'Tamil', 'Google', 'Kanya', 'Vani'];
          for (const namePart of priority) {
            bestVoice = langVoices.find(v => v.name.includes(namePart));
            if (bestVoice) break;
          }
          if (!bestVoice) bestVoice = langVoices[0];
        } else {
          bestVoice = langVoices[0];
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
          console.log(`Using voice: ${bestVoice.name} (${bestVoice.lang})`);
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
