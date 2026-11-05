"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp, FaRedo } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// £ amounts in whole pence, formatted the way the lesson content writes
// money ("50p" under a pound, "£1.50" at or above it) rather than always
// showing a decimal — matches how the quizzes/exams already format
// amounts after the Money content audit.
function formatPence(pence) {
  if (pence < 100) return `${pence}p`;
  const pounds = Math.floor(pence / 100);
  const rem = pence % 100;
  return rem === 0 ? `£${pounds}` : `£${pounds}.${String(rem).padStart(2, '0')}`;
}

// speechSynthesis reads the £ glyph inconsistently across browsers/voices
// — spelling "pounds" out keeps narration reliable instead of gambling on
// how a given voice handles a currency symbol.
function speakPence(pence) {
  if (pence < 100) return `${pence} pence`;
  const pounds = Math.floor(pence / 100);
  const rem = pence % 100;
  if (rem === 0) return `${pounds} pound${pounds === 1 ? '' : 's'}`;
  return `${pounds} pound${pounds === 1 ? '' : 's'} and ${rem} pence`;
}

const COIN_STYLE = {
  1: { d: 34, bg: '#fbbf24' }, 2: { d: 38, bg: '#fbbf24' }, 5: { d: 30, bg: '#cbd5e1' },
  10: { d: 36, bg: '#cbd5e1' }, 20: { d: 32, bg: '#cbd5e1' }, 50: { d: 42, bg: '#cbd5e1' },
  100: { d: 40, bg: '#fbbf24' }, 200: { d: 44, bg: '#fbbf24' },
};

// A row of coins/notes a kid taps, in any order, to build up a running
// total — the same "tap each piece, hear its value, watch the total grow"
// treatment PerimeterTracer gives a rectangle's sides, applied to counting
// money instead.
export default function CoinCounter({ coins, onComplete }) {
  const PIECES = useMemo(() => coins && coins.length > 0 ? coins : [100, 50, 20, 5], [coins]);
  const [tagged, setTagged] = useState(new Set());
  const total = PIECES.reduce((s, v) => s + v, 0);
  const runningTotal = [...tagged].reduce((s, i) => s + PIECES[i], 0);
  const done = tagged.size === PIECES.length;

  const tapCoin = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const value = PIECES[idx];
    if (next.size === PIECES.length) {
      speak(`And that's all of them! Altogether that's ${speakPence(total)}.`);
    } else {
      speak(speakPence(value));
    }
  }, [tagged, PIECES, total]);

  const replay = () => speak(`Added together, these coins and notes make ${speakPence(total)}.`);
  const reset = () => setTagged(new Set());

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Count the Money</h3>
        <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each coin or note to add it up — {tagged.size}/{PIECES.length}</p>

      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 min-h-[7rem]">
        {PIECES.map((value, idx) => {
          const isTagged = tagged.has(idx);
          const style = COIN_STYLE[value] || { d: 36, bg: '#cbd5e1' };
          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => tapCoin(idx)}
              disabled={isTagged}
              whileTap={{ scale: 0.9 }}
              animate={isTagged ? { y: -4 } : { y: 0 }}
              className="flex flex-col items-center gap-2"
              style={{ cursor: isTagged ? 'default' : 'pointer' }}
            >
              <div
                className="rounded-full flex items-center justify-center font-black text-slate-700 shadow-md border-4"
                style={{
                  width: style.d + 20, height: style.d + 20,
                  background: isTagged ? '#d1fae5' : style.bg,
                  borderColor: isTagged ? '#10b981' : '#fff',
                  fontSize: value >= 100 ? '0.8rem' : '0.95rem',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {formatPence(value)}
              </div>
              {isTagged && (
                <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  <FaCheckCircle className="text-emerald-500 text-sm" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[3rem] flex items-center justify-center flex-wrap gap-2">
        <AnimatePresence>
          {[...tagged].map((idx, pos) => (
            <motion.span key={idx} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2">
              {pos > 0 && <span className="text-slate-300 font-black">+</span>}
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-black">{formatPence(PIECES[idx])}</span>
            </motion.span>
          ))}
        </AnimatePresence>
        {tagged.size > 0 && (
          <span className="flex items-center gap-2">
            <span className="text-slate-300 font-black">=</span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 font-black">{formatPence(runningTotal)}</span>
          </span>
        )}
      </div>

      <div className="mt-6 h-14 flex items-center gap-3">
        {done ? (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> Done!
          </motion.button>
        ) : tagged.size > 0 ? (
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
            <FaRedo className="text-xs" /> Start over
          </button>
        ) : null}
      </div>
    </div>
  );
}
