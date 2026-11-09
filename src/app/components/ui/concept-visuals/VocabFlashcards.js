"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp } from 'react-icons/fa';

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang || 'en-GB';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// A tap-to-flip vocabulary grid for word-learning lessons (greetings,
// numbers, colours & shapes, family members, animals, food — in any
// language, via `lang`). Every card sits face-down with just an emoji;
// tapping flips it to reveal the word, its meaning, and hears it
// spoken in the lesson's own language — actually hearing and matching
// a new word to a picture, instead of reading a paragraph that lists
// several words in a row.
export default function VocabFlashcards({ cards, lang, onComplete }) {
  const CARDS = cards && cards.length > 0 ? cards : [
    { emoji: '👋', word: 'Hello', meaning: 'A friendly greeting' },
  ];

  const [flipped, setFlipped] = useState(() => new Set());

  const flip = useCallback((i) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    speak(CARDS[i].word, lang);
  }, [CARDS, lang]);

  const allFlipped = flipped.size === CARDS.length;

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <p className="text-sm font-bold text-slate-400 mb-5 text-center">Tap each card to hear the word</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl" style={{ perspective: 1000 }}>
        {CARDS.map((card, i) => {
          const isFlipped = flipped.has(i);
          return (
            <div key={i} className="relative h-28 sm:h-32" style={{ perspective: 1000 }}>
              <motion.button
                onClick={() => flip(i)}
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {/* Front — emoji only, a mystery to tap */}
                <div
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-4xl shadow-md"
                >
                  {card.emoji}
                </div>
                {/* Back — word + meaning */}
                <div
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  className="absolute inset-0 rounded-2xl bg-white border-2 border-emerald-200 flex flex-col items-center justify-center gap-0.5 px-2 text-center shadow-sm"
                >
                  <span className="text-lg sm:text-xl font-black text-slate-800 leading-tight">{card.word}</span>
                  {card.meaning && <span className="text-[10px] font-semibold text-slate-400 leading-tight">{card.meaning}</span>}
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {allFlipped && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mt-6">
          <button
            onClick={() => speak(CARDS.map((c) => c.word).join(', '), lang)}
            aria-label="Listen to all words"
            className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors mb-4"
          >
            <FaVolumeUp className="text-sm" />
          </button>
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg"
          >
            <FaCheckCircle /> Done!
          </button>
        </motion.div>
      )}
    </div>
  );
}
