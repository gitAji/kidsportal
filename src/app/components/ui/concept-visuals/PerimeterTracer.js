"use client";
import React, { useState, useCallback } from 'react';
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

// A rectangle whose 4 sides a kid taps, in any order, to trace the
// perimeter: each tap highlights that side, speaks its length, and adds
// it to a running-total equation — "show an actual shape... explain it as
// an animation with a voice" instead of a static paragraph.
export default function PerimeterTracer({ length = 5, width = 3, unit = 'cm', onComplete }) {
  const [tagged, setTagged] = useState(new Set()); // indices 0=top,1=right,2=bottom,3=left
  const total = length * 2 + width * 2;
  const sideLengths = [length, width, length, width]; // top, right, bottom, left
  const runningTotal = [...tagged].reduce((sum, i) => sum + sideLengths[i], 0);
  const done = tagged.size === 4;

  const tapSide = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const len = sideLengths[idx];
    if (next.size === 4) {
      speak(`And that's all 4 sides! The perimeter is ${total} ${unit === 'cm' ? 'centimeters' : unit}.`);
    } else {
      speak(`${len} ${unit === 'cm' ? 'centimeters' : unit}.`);
    }
  }, [tagged, sideLengths, total, unit]);

  const replay = () => speak(`The perimeter is the distance all the way around. ${length} plus ${width} plus ${length} plus ${width} equals ${total} ${unit === 'cm' ? 'centimeters' : unit}.`);

  const reset = () => setTagged(new Set());

  // Rectangle geometry in a 0-200x0-140 viewBox
  const x0 = 40, y0 = 30, w = 120, h = 80;
  const corners = [
    { x: x0, y: y0 }, { x: x0 + w, y: y0 }, { x: x0 + w, y: y0 + h }, { x: x0, y: y0 + h },
  ];
  const midpoints = [
    { x: x0 + w / 2, y: y0 - 14 },      // top
    { x: x0 + w + 16, y: y0 + h / 2 },  // right
    { x: x0 + w / 2, y: y0 + h + 16 },  // bottom
    { x: x0 - 16, y: y0 + h / 2 },      // left
  ];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Trace the Perimeter</h3>
        <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each side to add it to the total — {tagged.size}/4</p>

      <div className="relative w-full max-w-sm">
        <svg viewBox="0 0 200 140" className="w-full h-auto">
          {[0, 1, 2, 3].map((i) => {
            const a = corners[i];
            const b = corners[(i + 1) % 4];
            const isTagged = tagged.has(i);
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={24}
                  onClick={() => tapSide(i)} style={{ cursor: isTagged ? 'default' : 'pointer' }} />
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isTagged ? '#10b981' : '#60a5fa'} strokeWidth={isTagged ? 7 : 4} strokeLinecap="round"
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s', pointerEvents: 'none' }} />
                <text x={midpoints[i].x} y={midpoints[i].y} textAnchor="middle" fontSize="12" fontWeight="900"
                  fill={isTagged ? '#10b981' : '#64748b'} style={{ pointerEvents: 'none' }}>
                  {sideLengths[i]}{unit}
                </text>
              </g>
            );
          })}
          {corners.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={5} fill="#1e293b" />
          ))}
        </svg>
      </div>

      {/* Running equation */}
      <div className="mt-6 min-h-[3rem] flex items-center justify-center flex-wrap gap-2">
        <AnimatePresence>
          {[...tagged].map((i, idx) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2">
              {idx > 0 && <span className="text-slate-300 font-black">+</span>}
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-black">{sideLengths[i]}{unit}</span>
            </motion.span>
          ))}
        </AnimatePresence>
        {tagged.size > 0 && (
          <span className="flex items-center gap-2">
            <span className="text-slate-300 font-black">=</span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 font-black">{runningTotal}{unit}</span>
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
