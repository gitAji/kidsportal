"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// A "what comes next" picture-pattern puzzle: a short repeating sequence
// of shapes/icons is shown with a blank at the end, and the child taps
// the option that continues the pattern — the actual skill a "pattern
// recognition" lesson is after, done by spotting and extending a real
// pattern instead of reading a paragraph that names one.
export default function PatternSequencer({ puzzles, onComplete }) {
  const PUZZLES = useMemo(() => (puzzles && puzzles.length > 0 ? puzzles : [
    { sequence: ['🔴', '🔵', '🔴', '🔵'], options: ['🔴', '🟢', '🔵'], answer: '🔴' },
  ]), [puzzles]);

  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(null);
  const puzzle = PUZZLES[index];
  const isLast = index === PUZZLES.length - 1;

  const tapOption = useCallback((opt) => {
    if (solved) return;
    if (opt === puzzle.answer) {
      setSolved(true);
      speak(`${puzzle.sequence.join(', ')}... ${opt}! You found the pattern!`);
    } else {
      setWrong(opt);
      speak('Not quite — look at the pattern again!');
      setTimeout(() => setWrong(null), 600);
    }
  }, [solved, puzzle]);

  const next = () => { setIndex((i) => i + 1); setSolved(false); setWrong(null); };
  const replay = () => speak(`The pattern is ${puzzle.sequence.join(', ')}, then ${puzzle.answer}.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {PUZZLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <p className="text-sm font-bold text-slate-400 mb-5 text-center">What comes next in the pattern?</p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center gap-7">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {puzzle.sequence.map((item, i) => (
              <span key={i} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-2xl sm:text-3xl shadow-sm">{item}</span>
            ))}
            <motion.span animate={{ scale: solved ? [1, 1.2, 1] : 1 }} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl shadow-sm ${solved ? 'bg-emerald-50 border-emerald-300' : 'bg-indigo-50 border-indigo-300 border-dashed'}`}>
              {solved ? puzzle.answer : '?'}
            </motion.span>
          </div>

          <div className="flex items-center gap-3">
            {puzzle.options.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => tapOption(opt)}
                disabled={solved}
                animate={wrong === opt ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl shadow-sm transition-colors ${
                  solved && opt === puzzle.answer ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {solved && (
        <button onClick={replay} aria-label="Listen" className="mt-4 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
        {solved && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Pattern'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
