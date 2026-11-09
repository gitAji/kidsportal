"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

// A row of tappable bit switches, each worth a place value (8, 4, 2, 1...)
// when it's ON — the child flips bits and watches the decimal total
// update live, which is how binary place value actually clicks, instead
// of reading a paragraph defining "binary".
export default function BinaryExplorer({ examples, onComplete }) {
  const EXAMPLES = useMemo(() => (examples && examples.length > 0 ? examples : [
    { bits: 4, target: 10 },
  ]), [examples]);

  const [index, setIndex] = useState(0);
  const example = EXAMPLES[index];
  const placeValues = useMemo(() => Array.from({ length: example.bits }, (_, i) => 2 ** (example.bits - 1 - i)), [example]);
  const [onBits, setOnBits] = useState(() => Array(example.bits).fill(false));
  const isLast = index === EXAMPLES.length - 1;

  useEffect(() => { setOnBits(Array(example.bits).fill(false)); }, [index, example.bits]);

  const total = onBits.reduce((sum, on, i) => sum + (on ? placeValues[i] : 0), 0);
  const matched = example.target != null && total === example.target;
  const freeMode = example.target == null;

  const toggleBit = useCallback((i) => {
    setOnBits((prev) => {
      const nextBits = [...prev];
      nextBits[i] = !nextBits[i];
      const newTotal = nextBits.reduce((sum, on, j) => sum + (on ? placeValues[j] : 0), 0);
      speak(`${nextBits[i] ? 'On' : 'Off'}. The number is now ${newTotal}.`);
      return nextBits;
    });
  }, [placeValues]);

  const next = () => setIndex((i) => i + 1);
  const replay = () => speak(`${onBits.map((b) => (b ? '1' : '0')).join('')} in binary is ${total} in decimal.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {EXAMPLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center mb-1">
        {freeMode ? 'Tap the bits on and off' : `Can you make ${example.target}?`}
      </h3>
      <p className="text-sm font-bold text-slate-400 mb-5 text-center">Each switch is worth a different amount when it&apos;s ON</p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-end gap-2 sm:gap-3">
          {placeValues.map((value, i) => (
            <button key={i} onClick={() => toggleBit(i)} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black text-slate-400">{value}</span>
              <motion.span
                animate={{ backgroundColor: onBits[i] ? '#6366f1' : '#e2e8f0', color: onBits[i] ? '#ffffff' : '#94a3b8' }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm"
              >
                {onBits[i] ? 1 : 0}
              </motion.span>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div animate={{ scale: matched ? [1, 1.15, 1] : 1 }} className={`mt-6 px-6 py-3 rounded-2xl font-black text-2xl ${matched ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-300' : 'bg-indigo-50 text-indigo-700'}`}>
        = {total}
      </motion.div>
      {!freeMode && !matched && (
        <p className="mt-1 text-sm font-bold text-slate-400">Target: {example.target}</p>
      )}
      {matched && (
        <p className="mt-1 text-sm font-bold text-emerald-600">That&apos;s it! {onBits.map((b) => (b ? '1' : '0')).join('')} in binary = {example.target}</p>
      )}

      <button onClick={replay} aria-label="Listen" className="mt-3 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
        <FaVolumeUp className="text-sm" />
      </button>

      <div className="mt-6 h-14 flex items-center">
        {(freeMode || matched) && (
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
