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

// Deterministic per-slide shuffle (not Math.random on every render) so the
// jumbled order doesn't jump around on a re-render within the same slide.
function shuffledIndices(n, seed) {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = (seed * (i + 7) + i * 13) % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  if (idx.every((v, i) => v === i) && n > 1) { [idx[0], idx[1]] = [idx[1], idx[0]]; }
  return idx;
}

// Tap-the-steps-into-order widget: a short everyday task is shown jumbled,
// and the child taps the steps into the right sequence — teaching what
// "sequencing" actually means by doing it, instead of reading a paragraph
// that says "the order of steps matters".
export default function SequenceOrderer({ scenarios, onComplete }) {
  const SCENARIOS = useMemo(() => (scenarios && scenarios.length > 0 ? scenarios : [
    { title: 'Making a Jam Sandwich', steps: ['Get two slices of bread', 'Spread the jam', 'Put the slices together', 'Take a bite!'] },
  ]), [scenarios]);

  const [index, setIndex] = useState(0);
  const [tapped, setTapped] = useState([]);
  const [shake, setShake] = useState(false);
  const scenario = SCENARIOS[index];
  const order = useMemo(() => shuffledIndices(scenario.steps.length, index + 3), [scenario, index]);
  const isLast = index === SCENARIOS.length - 1;
  const complete = tapped.length === scenario.steps.length;
  const correct = complete && tapped.every((v, i) => v === i);

  const tapStep = useCallback((originalIdx) => {
    if (tapped.includes(originalIdx)) return;
    const nextTapped = [...tapped, originalIdx];
    speak(scenario.steps[originalIdx]);
    setTapped(nextTapped);
    if (nextTapped.length === scenario.steps.length) {
      const isCorrect = nextTapped.every((v, i) => v === i);
      if (isCorrect) {
        setTimeout(() => speak(`Well done! That's the right order: ${scenario.steps.join('. ')}.`), 900);
      } else {
        setTimeout(() => {
          setShake(true);
          speak("That's not quite the order — let's try again!");
          setTimeout(() => { setShake(false); setTapped([]); }, 900);
        }, 500);
      }
    }
  }, [tapped, scenario]);

  const next = () => { setIndex((i) => i + 1); setTapped([]); };
  const replay = () => speak(`The right order is: ${scenario.steps.join('. ')}.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {SCENARIOS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center mb-1">{scenario.title}</h3>
      <p className="text-sm font-bold text-slate-400 mb-4 text-center">
        {correct ? "Great job — that's the right order!" : 'Tap the steps in the order they should happen'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, x: shake ? [0, -8, 8, -8, 0] : 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm flex flex-col gap-2.5"
        >
          {order.map((originalIdx) => {
            const position = tapped.indexOf(originalIdx);
            const isTapped = position !== -1;
            const isWrongBatch = complete && !correct && isTapped;
            return (
              <button
                key={originalIdx}
                onClick={() => tapStep(originalIdx)}
                disabled={isTapped}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-colors ${
                  isWrongBatch
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : isTapped
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${isTapped ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {isTapped ? position + 1 : ''}
                </span>
                {scenario.steps[originalIdx]}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {correct && (
        <button onClick={replay} aria-label="Listen" className="mt-3 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
        {correct && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next One'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
