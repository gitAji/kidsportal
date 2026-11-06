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

const GRID_SIZE = 200;

// A coordinate grid a kid taps apart, one labelled point at a time: each
// tap plots (and narrates) that point's coordinates on the grid — the
// same "show the actual thing, let them tap it" treatment as the other
// concept visuals, applied to plotting coordinates instead of a
// flip-card paragraph stating "the first number tells you how far along".
export default function CoordinatePlotter({ points, range, onComplete }) {
  const RANGE = range ?? { minX: 0, maxX: 6, minY: 0, maxY: 6 };
  const POINTS = useMemo(() => points && points.length > 0 ? points : [
    { x: 2, y: 3, label: 'A' }, { x: 5, y: 1, label: 'B' }, { x: 4, y: 4, label: 'C' },
  ], [points]);

  const [tagged, setTagged] = useState(new Set());
  const done = tagged.size === POINTS.length;

  const toPx = (x, y) => ({
    x: ((x - RANGE.minX) / (RANGE.maxX - RANGE.minX)) * GRID_SIZE,
    y: GRID_SIZE - ((y - RANGE.minY) / (RANGE.maxY - RANGE.minY)) * GRID_SIZE,
  });
  const origin = toPx(0, 0);
  const hasNegative = RANGE.minX < 0 || RANGE.minY < 0;

  const xTicks = useMemo(() => {
    const arr = [];
    for (let v = RANGE.minX; v <= RANGE.maxX; v++) arr.push(v);
    return arr;
  }, [RANGE.minX, RANGE.maxX]);
  const yTicks = useMemo(() => {
    const arr = [];
    for (let v = RANGE.minY; v <= RANGE.maxY; v++) arr.push(v);
    return arr;
  }, [RANGE.minY, RANGE.maxY]);

  const tapPoint = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const p = POINTS[idx];
    speak(`Point ${p.label} is at ${p.x}, ${p.y}.`);
  }, [tagged, POINTS]);

  const replay = () => {
    const parts = POINTS.map((p) => `${p.label} at ${p.x}, ${p.y}`);
    speak(parts.join('. '));
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Plot the Points</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each labelled point to reveal its coordinates — {tagged.size}/{POINTS.length}</p>

      <div className="relative w-full max-w-xs aspect-square">
        <svg viewBox={`-20 -20 ${GRID_SIZE + 40} ${GRID_SIZE + 40}`} className="w-full h-full">
          {xTicks.map((v) => {
            const p = toPx(v, RANGE.minY);
            return <line key={`gx${v}`} x1={p.x} y1={0} x2={p.x} y2={GRID_SIZE} stroke="#e2e8f0" strokeWidth={1} />;
          })}
          {yTicks.map((v) => {
            const p = toPx(RANGE.minX, v);
            return <line key={`gy${v}`} x1={0} y1={p.y} x2={GRID_SIZE} y2={p.y} stroke="#e2e8f0" strokeWidth={1} />;
          })}
          <rect x={0} y={0} width={GRID_SIZE} height={GRID_SIZE} fill="none" stroke="#94a3b8" strokeWidth={2} />
          {hasNegative && (
            <>
              <line x1={0} y1={origin.y} x2={GRID_SIZE} y2={origin.y} stroke="#64748b" strokeWidth={2} />
              <line x1={origin.x} y1={0} x2={origin.x} y2={GRID_SIZE} stroke="#64748b" strokeWidth={2} />
            </>
          )}
          {xTicks.map((v) => {
            const p = toPx(v, RANGE.minY);
            return <text key={`xt${v}`} x={p.x} y={GRID_SIZE + 14} textAnchor="middle" fontSize="8" fontWeight="700" fill="#94a3b8">{v}</text>;
          })}
          {yTicks.map((v) => {
            const p = toPx(RANGE.minX, v);
            return <text key={`yt${v}`} x={-10} y={p.y + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="#94a3b8">{v}</text>;
          })}

          {POINTS.map((p, idx) => {
            const isTagged = tagged.has(idx);
            const pos = toPx(p.x, p.y);
            return (
              <g key={idx} onClick={() => tapPoint(idx)} style={{ cursor: isTagged ? 'default' : 'pointer' }}>
                <circle cx={pos.x} cy={pos.y} r={16} fill="transparent" />
                {isTagged ? (
                  <AnimatePresence>
                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <circle cx={pos.x} cy={pos.y} r={7} fill="#10b981" stroke="#fff" strokeWidth={2} />
                      <text x={pos.x} y={pos.y - 12} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">{p.label}</text>
                    </motion.g>
                  </AnimatePresence>
                ) : (
                  <circle cx={pos.x} cy={pos.y} r={7} fill="#f472b6" stroke="#fff" strokeWidth={2} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {done && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {POINTS.map((p) => (
            <span key={p.label} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm">
              {p.label} ({p.x}, {p.y})
            </span>
          ))}
        </div>
      )}

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
