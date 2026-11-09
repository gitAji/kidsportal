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

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplifiedFraction(percent) {
  const g = gcd(percent, 100) || 1;
  return `${percent / g}/${100 / g}`;
}

// A 100-square grid the child shades in by tapping — the same square
// count read three ways (X out of 100, X%, 0.X, and the simplified
// fraction) at once. Fractions, decimals and percentages are one idea
// wearing three notations, and this is the one visual that shows all
// three update together instead of three separate paragraphs defining
// each in isolation.
export default function PercentageBar({ examples, onComplete }) {
  const EXAMPLES = useMemo(() => (examples && examples.length > 0 ? examples : [
    { percent: 40, prompt: 'Shade 40 out of 100 squares' },
  ]), [examples]);

  const [index, setIndex] = useState(0);
  const example = EXAMPLES[index];
  const [shaded, setShaded] = useState(() => Array(100).fill(false));
  const isLast = index === EXAMPLES.length - 1;
  const count = shaded.filter(Boolean).length;
  const matched = count === example.percent;

  const toggleCell = useCallback((i) => {
    if (matched) return;
    setShaded((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }, [matched]);

  React.useEffect(() => { setShaded(Array(100).fill(false)); }, [index]);

  React.useEffect(() => {
    if (matched) {
      const decimal = (example.percent / 100).toString();
      speak(`${example.percent} out of 100 is ${example.percent} percent, which is ${decimal}, or ${simplifiedFraction(example.percent)}.`);
    }
  }, [matched, example]);

  const next = () => setIndex((i) => i + 1);
  const replay = () => {
    const decimal = (example.percent / 100).toString();
    speak(`${example.percent} percent equals ${decimal}, or the fraction ${simplifiedFraction(example.percent)}.`);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {EXAMPLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center mb-1">{example.prompt}</h3>
      <p className="text-sm font-bold text-slate-400 mb-4 text-center">
        {matched ? 'Perfect!' : `Tap squares to shade them in — ${count} of ${example.percent} shaded`}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="grid grid-cols-10 gap-[2px] p-2 bg-slate-100 rounded-xl w-full max-w-xs aspect-square"
        >
          {shaded.map((on, i) => (
            <motion.button
              key={i}
              onClick={() => toggleCell(i)}
              animate={{ backgroundColor: on ? '#6366f1' : '#ffffff' }}
              className="rounded-[2px] border border-slate-200"
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {matched && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center gap-3 flex-wrap justify-center">
          <span className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm">{example.percent}%</span>
          <span className="text-slate-300 font-black">=</span>
          <span className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm">{(example.percent / 100).toString()}</span>
          <span className="text-slate-300 font-black">=</span>
          <span className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm">{simplifiedFraction(example.percent)}</span>
        </motion.div>
      )}

      {matched && (
        <button onClick={replay} aria-label="Listen" className="mt-3 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
        {matched && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
