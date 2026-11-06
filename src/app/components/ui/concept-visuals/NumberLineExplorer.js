"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const TRACK_X0 = 20;
const TRACK_X1 = 380;

// A number line a kid taps apart, one marked point at a time: each tap
// places (and narrates) that value on the line, and once every point is
// placed they're narrated back in order smallest-to-largest — the same
// "show the actual thing, let them tap it" treatment as the other
// concept visuals, applied to comparing/ordering numbers (including
// negatives) instead of a flip-card paragraph stating "a number further
// right is bigger".
export default function NumberLineExplorer({ points, min, max, onComplete }) {
  const MIN = min ?? -10;
  const MAX = max ?? 10;
  const POINTS = useMemo(() => points && points.length > 0 ? points : [
    { value: -5, label: '-5' }, { value: 3, label: '3' }, { value: -2, label: '-2' }, { value: 7, label: '7' },
  ], [points]);

  const [tagged, setTagged] = useState(new Set());
  const done = tagged.size === POINTS.length;
  const toX = (v) => TRACK_X0 + ((v - MIN) / (MAX - MIN)) * (TRACK_X1 - TRACK_X0);

  const ticks = useMemo(() => {
    const step = (MAX - MIN) <= 20 ? 1 : Math.ceil((MAX - MIN) / 20);
    const arr = [];
    for (let v = MIN; v <= MAX; v += step) arr.push(v);
    return arr;
  }, [MIN, MAX]);

  const orderedPhrase = () => {
    const sorted = [...POINTS].sort((a, b) => a.value - b.value);
    return `In order from smallest to largest: ${sorted.map((p) => p.label).join(', then ')}.`;
  };

  const tapPoint = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const p = POINTS[idx];
    if (next.size === POINTS.length) {
      speak(orderedPhrase());
    } else {
      speak(p.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- orderedPhrase reads current POINTS/closure, fine to omit
  }, [tagged, POINTS]);

  const replay = () => speak(orderedPhrase());

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Place the Numbers</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-8">Tap each number below to place it — {tagged.size}/{POINTS.length}</p>

      <div className="relative w-full max-w-md">
        <svg viewBox="0 0 400 70" className="w-full h-auto">
          <line x1={TRACK_X0} y1={35} x2={TRACK_X1} y2={35} stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
          {ticks.map((v) => (
            <g key={v}>
              <line x1={toX(v)} y1={30} x2={toX(v)} y2={40} stroke="#cbd5e1" strokeWidth={2} />
              <text x={toX(v)} y={58} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">{v}</text>
            </g>
          ))}
          <line x1={toX(0)} y1={22} x2={toX(0)} y2={48} stroke="#64748b" strokeWidth={2} />

          <AnimatePresence>
            {[...tagged].map((idx) => {
              const p = POINTS[idx];
              return (
                <motion.g key={idx} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <circle cx={toX(p.value)} cy={35} r={7} fill="#10b981" stroke="#fff" strokeWidth={2} />
                  <text x={toX(p.value)} y={20} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">{p.label}</text>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {POINTS.map((p, idx) => {
          const isTagged = tagged.has(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => tapPoint(idx)}
              disabled={isTagged}
              className={`px-5 py-3 rounded-2xl font-black text-lg shadow-md transition-all ${isTagged ? 'bg-emerald-100 text-emerald-400 scale-95' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 active:scale-95'}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 h-14 flex items-center">
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> Done!
          </motion.button>
        )}
      </div>
    </div>
  );
}
