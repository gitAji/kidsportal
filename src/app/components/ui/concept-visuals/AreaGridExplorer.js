"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp, FaRedo } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const CELL = 36;

// A grid of unit squares a kid taps one at a time to count — area as
// "how many squares fit inside", built up square by square, instead of
// a flip-card paragraph stating "area is length times width".
export default function AreaGridExplorer({ rows, cols, unit = 'cm', onComplete }) {
  const ROWS = rows ?? 3;
  const COLS = cols ?? 5;
  const total = ROWS * COLS;
  const [tagged, setTagged] = useState(new Set());
  const done = tagged.size === total;

  const cellKey = (r, c) => `${r}-${c}`;

  const tapCell = useCallback((r, c) => {
    const key = cellKey(r, c);
    if (tagged.has(key)) return;
    const next = new Set(tagged).add(key);
    setTagged(next);
    if (next.size === total) {
      speak(`That's all ${total} squares — the area is ${ROWS} times ${COLS}, which is ${total} square ${unit}.`);
    } else {
      speak(String(next.size));
    }
  }, [tagged, total, ROWS, COLS, unit]);

  const replay = () => speak(`The area is ${ROWS} times ${COLS}, which is ${total} square ${unit}.`);
  const reset = () => setTagged(new Set());

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) cells.push({ r, c });
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Count the Squares</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap every square to find the area — {tagged.size}/{total}</p>

      <div
        className="grid gap-0.5 bg-slate-300 p-0.5 rounded-lg shadow-md"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)` }}
      >
        {cells.map(({ r, c }) => {
          const key = cellKey(r, c);
          const isTagged = tagged.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => tapCell(r, c)}
              disabled={isTagged}
              className="flex items-center justify-center font-black text-[10px] transition-colors"
              style={{
                width: CELL, height: CELL,
                background: isTagged ? '#6ee7b7' : '#fff',
                color: isTagged ? '#065f46' : '#cbd5e1',
                cursor: isTagged ? 'default' : 'pointer',
              }}
            >
              {isTagged ? [...tagged].indexOf(key) + 1 : ''}
            </button>
          );
        })}
      </div>

      <p className="text-sm font-bold text-slate-500 mt-4">
        {ROWS} rows &times; {COLS} columns
      </p>

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
