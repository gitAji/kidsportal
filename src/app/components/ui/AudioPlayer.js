"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { FaVolumeUp, FaStop } from 'react-icons/fa';

export default function AudioPlayer({ text, lang = 'en-US', label, customClassName, icon, autoPlay = false, onPlay, onWordBoundary }) {
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
      onWordBoundary?.(-1, 0);
    }
  }, [onWordBoundary]);

  const speak = useCallback(() => {
    if ('speechSynthesis' in window) {
      // If already playing, stop it
      if (isPlaying) {
        stopSpeech();
        return;
      }

      window.speechSynthesis.cancel();
      onPlay?.();

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
      utterance.onend = () => {
        setIsPlaying(false);
        onWordBoundary?.(-1, 0);
      };
      utterance.onerror = (err) => {
        console.error("Speech error:", err);
        setIsPlaying(false);
      };
      // Not every browser fires word boundaries (Safari in particular is
      // unreliable here) — treat this as a progressive enhancement for
      // read-along highlighting, never something the lesson depends on.
      if (onWordBoundary) {
        utterance.onboundary = (event) => {
          if (event.name === 'word' || event.name === undefined) {
            onWordBoundary(event.charIndex, event.charLength || 0);
          }
        };
      }

      // 3. Advanced Voice Selection
      const ENGLISH_PRIORITY = [
        'Samantha', 'Google UK English Female', 'Google US English',
        'Premium', 'Natural', 'Serena', 'Daniel', 'Victoria', 'Fiona'
      ];
      // A network-backed voice (Google/Microsoft's online voices) is almost
      // always far clearer than an always-available local/offline one —
      // `localService` is a real signal the Web Speech API exposes, not a
      // guess, so prefer it whenever no named voice above matches.
      const pickBestVoice = (candidates, priority = []) => {
        for (const namePart of priority) {
          const match = candidates.find(v => v.name.includes(namePart));
          if (match) return match;
        }
        return candidates.find(v => !v.localService) || candidates[0];
      };

      if (voices.length > 0) {
        const langCode = lang.split('-')[0].toLowerCase();
        const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode));
        const bestVoice = langCode === 'en'
          ? pickBestVoice(langVoices, ENGLISH_PRIORITY)
          : pickBestVoice(langVoices);

        if (bestVoice) {
          utterance.voice = bestVoice;
          console.log(`Using voice: ${bestVoice.name} (${bestVoice.lang})`);
        }
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  }, [isPlaying, stopSpeech, text, lang, voices, onPlay, onWordBoundary]);

  const handleClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    speak();
  };

  // For early-grade lessons the narration should start on its own as soon
  // as a card appears, instead of waiting for a tap — a short delay lets
  // the card's enter animation start first.
  useEffect(() => {
    if (!autoPlay || !text) return;
    const id = setTimeout(() => speak(), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per new card, not on every isPlaying toggle
  }, [text, autoPlay]);

  return (
    <button
      onClick={handleClick}
      className={customClassName || `p-3 rounded-full ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-all shadow-md active:scale-90`}
      aria-label={isPlaying ? "Stop audio" : "Play sound"}
    >
      {isPlaying ? <FaStop className="text-xl" /> : (icon || <FaVolumeUp className="text-xl" />)}
      {label && <span>{isPlaying ? 'Stop' : label}</span>}
    </button>
  );
}
