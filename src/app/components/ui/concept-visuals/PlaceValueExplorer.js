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

const COLUMN_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions'];

function digitBreakdown(number) {
  const str = String(number);
  const digits = str.split('').map(Number).reverse(); // ones first
  return digits.map((d, i) => ({ digit: d, place: Math.pow(10, i), name: COLUMN_NAMES[i] || `10^${i}` }));
}

function formatPlaceValue(digit, place) {
  const value = digit * place;
  return value.toLocaleString('en-GB');
}

// A number broken into its place-value columns, each tapped from the
// biggest column down to ones: each tap reveals what that digit is
// really worth (e.g. "the 4 is worth 400") and adds it to a running
// sum, the same build-up treatment PerimeterTracer gives a rectangle's
// sides — instead of a flip-card paragraph naming "the tens column" in
// the abstract with no actual number to point at.
export default function PlaceValueExplorer({ numbers, onComplete }) {
  const NUMBERS = useMemo(() => (numbers && numbers.length > 0 ? numbers : [481, 2605]), [numbers]);
  const [index, setIndex] = useState(0);
  const [tagged, setTagged] = useState(new Set());
  const number = NUMBERS[index];
  const columns = useMemo(() => digitBreakdown(number).reverse(), [number]); // biggest place first
  const done = tagged.size === columns.length;
  const isLast = index === NUMBERS.length - 1;

  const tapColumn = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const col = columns[idx];
    if (next.size === columns.length) {
      speak(`Put together, that's ${number.toLocaleString('en-GB')}.`);
    } else if (col.digit === 0) {
      speak(`There are no ${col.name} here.`);
    } else {
      speak(`This digit is ${col.digit}, in the ${col.name} column — it's worth ${formatPlaceValue(col.digit, col.place)}.`);
    }
  }, [tagged, columns, number]);

  const next = () => { setIndex((i) => i + 1); setTagged(new Set()); };
  const replay = () => speak(`Put together, that's ${number.toLocaleString('en-GB')}.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {NUMBERS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-end justify-center gap-1.5 sm:gap-2 flex-wrap">
          {columns.map((col, idx) => {
            const isTagged = tagged.has(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => tapColumn(idx)}
                disabled={isTagged}
                className="flex flex-col items-center gap-1.5"
                style={{ cursor: isTagged ? 'default' : 'pointer' }}
              >
                <div
                  className="w-12 h-16 sm:w-14 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md border-2 transition-colors"
                  style={{
                    background: isTagged ? (col.digit === 0 ? '#f1f5f9' : '#d1fae5') : '#fff',
                    borderColor: isTagged ? (col.digit === 0 ? '#cbd5e1' : '#10b981') : '#e2e8f0',
                    color: isTagged ? (col.digit === 0 ? '#94a3b8' : '#047857') : '#1e293b',
                  }}
                >
                  {col.digit}
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tight text-center max-w-[3.5rem] leading-tight">{col.name}</span>
                {isTagged && col.digit > 0 && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] sm:text-xs font-black text-emerald-600">
                    {formatPlaceValue(col.digit, col.place)}
                  </motion.span>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
        <h3 className="text-xl font-black text-slate-700">
          {done ? number.toLocaleString('en-GB') : 'Tap Each Digit'}
        </h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mt-1">
        {!done ? `Start from the biggest column — ${tagged.size}/${columns.length}` : 'Great job!'}
      </p>

      <div className="mt-6 h-14 flex items-center">
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Number'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
