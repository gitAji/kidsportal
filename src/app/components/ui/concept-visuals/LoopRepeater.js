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

// A tappable "repeat block": instead of reading that a loop "does
// something again and again", the child taps the loop once per
// repetition and watches a single instruction fire that many times, then
// sees it laid out against writing the same instruction out by hand —
// which is the actual point of a loop.
export default function LoopRepeater({ scenarios, onComplete }) {
  const SCENARIOS = useMemo(() => (scenarios && scenarios.length > 0 ? scenarios : [
    { label: 'Clap', emoji: '👏', times: 4 },
  ]), [scenarios]);

  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(0);
  const scenario = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const done = count >= scenario.times;

  const tapRun = useCallback(() => {
    if (done) return;
    const n = count + 1;
    setCount(n);
    setBump((b) => b + 1);
    speak(n === scenario.times
      ? `${scenario.label}! That's ${n} of ${scenario.times}. Loop finished!`
      : `${scenario.label}! That's ${n} of ${scenario.times}.`);
  }, [count, done, scenario]);

  const next = () => { setIndex((i) => i + 1); setCount(0); };
  const replay = () => speak(`A loop that repeats "${scenario.label}" ${scenario.times} times runs it ${scenario.times} times without writing it out ${scenario.times} separate times.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {SCENARIOS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm flex flex-col items-center">

          <button
            onClick={tapRun}
            disabled={done}
            className={`flex items-center gap-3 px-6 py-4 rounded-3xl border-2 font-black text-base sm:text-lg shadow-md transition-colors ${
              done ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100 active:scale-95'
            }`}
          >
            <motion.span key={bump} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-2xl">{scenario.emoji}</motion.span>
            Repeat &quot;{scenario.label}&quot; {scenario.times} times
          </button>

          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: scenario.times }).map((_, i) => (
              <span key={i} className={`w-3 h-3 rounded-full ${i < count ? 'bg-indigo-500' : 'bg-slate-200'}`} />
            ))}
          </div>
          <p className="mt-1 text-sm font-bold text-slate-400">{done ? 'Loop finished!' : `Tap the block — rep ${count + 1} of ${scenario.times}`}</p>

          {done && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 w-full grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-3">
                <p className="text-xs font-black text-rose-500 mb-1 uppercase tracking-wide">Without a loop</p>
                <p className="text-xs font-bold text-rose-700 leading-relaxed">{Array.from({ length: scenario.times }).map(() => scenario.label).join(', ')}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-3">
                <p className="text-xs font-black text-emerald-600 mb-1 uppercase tracking-wide">With a loop</p>
                <p className="text-xs font-bold text-emerald-700">repeat {scenario.times} [ {scenario.label} ]</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {done && (
        <button onClick={replay} aria-label="Listen" className="mt-3 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Loop'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
