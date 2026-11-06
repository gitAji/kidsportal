"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
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

const SLICE_COLORS = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c'];

function sliceePath(startFrac, endFrac, r = 70, cx = 90, cy = 90) {
  const start = startFrac * 2 * Math.PI - Math.PI / 2;
  const end = endFrac * 2 * Math.PI - Math.PI / 2;
  const large = (end - start) > Math.PI ? 1 : 0;
  const p0 = { x: cx + r * Math.cos(start), y: cy + r * Math.sin(start) };
  const p1 = { x: cx + r * Math.cos(end), y: cy + r * Math.sin(end) };
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
}

// A pie chart whose slices a kid taps, in any order, each one narrated
// with its value and share of the whole — then, once every slice is
// found, which category is the biggest is called out — instead of a
// flip-card paragraph stating "a pie chart shows parts of a whole".
export default function PieChartExplorer({ slices, unit = '', onComplete }) {
  const SLICES = useMemo(() => slices && slices.length > 0 ? slices : [
    { label: 'Red', value: 3 }, { label: 'Blue', value: 5 }, { label: 'Green', value: 2 },
  ], [slices]);
  const total = SLICES.reduce((s, x) => s + x.value, 0);
  const [tagged, setTagged] = useState(new Set());
  const done = tagged.size === SLICES.length;
  const biggest = SLICES.reduce((best, s) => (s.value > best.value ? s : best), SLICES[0]);

  const fracs = useMemo(() => {
    let acc = 0;
    return SLICES.map((s) => {
      const start = acc;
      acc += s.value / total;
      return { start, end: acc };
    });
  }, [SLICES, total]);

  const unitLabel = (v) => `${v}${unit ? ` ${unit}` : ''}`;
  const pct = (v) => Math.round((v / total) * 100);

  const tapSlice = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const s = SLICES[idx];
    if (next.size === SLICES.length) {
      speak(`Now we've read every slice — ${biggest.label} is the biggest, at ${pct(biggest.value)} percent.`);
    } else {
      speak(`${s.label}: ${unitLabel(s.value)}, that's ${pct(s.value)} percent.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pct/unitLabel are pure closures over stable props
  }, [tagged, SLICES, biggest]);

  const replay = () => speak(`${biggest.label} is the biggest, at ${pct(biggest.value)} percent.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Read the Pie Chart</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each slice to read its share — {tagged.size}/{SLICES.length}</p>

      <svg viewBox="0 0 180 180" className="w-full max-w-[220px] h-auto">
        {SLICES.map((s, idx) => {
          const isTagged = tagged.has(idx);
          const { start, end } = fracs[idx];
          return (
            <path key={s.label} d={sliceePath(start, end)}
              onClick={() => tapSlice(idx)}
              fill={isTagged ? SLICE_COLORS[idx % SLICE_COLORS.length] : '#e2e8f0'}
              stroke="#1e293b" strokeWidth={2}
              style={{ cursor: isTagged ? 'default' : 'pointer', transition: 'fill 0.2s' }} />
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {SLICES.map((s, idx) => {
          const isTagged = tagged.has(idx);
          return (
            <span key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm"
              style={{ background: isTagged ? `${SLICE_COLORS[idx % SLICE_COLORS.length]}22` : '#f1f5f9', color: isTagged ? '#1e293b' : '#94a3b8' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: isTagged ? SLICE_COLORS[idx % SLICE_COLORS.length] : '#cbd5e1' }} />
              {s.label}{isTagged && ` — ${unitLabel(s.value)}`}
            </span>
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
