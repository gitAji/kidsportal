"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const BAR_COLORS = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c'];
const CHART_HEIGHT = 140;

// A bar chart whose bars a kid taps, in any order, each one narrated with
// its value — then, once every bar is found, which category has the
// most/least is called out — instead of a flip-card paragraph stating
// "the height of a bar shows its value".
export default function BarChartExplorer({ bars, unit = '', onComplete }) {
  const BARS = useMemo(() => bars && bars.length > 0 ? bars : [
    { label: 'Football', value: 15 }, { label: 'Tennis', value: 9 }, { label: 'Swimming', value: 6 },
  ], [bars]);
  const [tagged, setTagged] = useState(new Set());
  const maxValue = Math.max(...BARS.map((b) => b.value));
  const done = tagged.size === BARS.length;
  const topBar = BARS.reduce((best, b) => (b.value > best.value ? b : best), BARS[0]);

  const unitLabel = (v) => `${v}${unit ? ` ${unit}` : ''}`;

  const tapBar = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const bar = BARS[idx];
    if (next.size === BARS.length) {
      speak(`Now we've read every bar — ${topBar.label} has the most, with ${unitLabel(topBar.value)}.`);
    } else {
      speak(`${bar.label}: ${unitLabel(bar.value)}.`);
    }
  }, [tagged, BARS, topBar, unit]);

  const replay = () => speak(`${topBar.label} has the most, with ${unitLabel(topBar.value)}.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Read the Bar Chart</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-8">Tap each bar to read its value — {tagged.size}/{BARS.length}</p>

      <div className="w-full max-w-sm flex items-end justify-center gap-4 sm:gap-6" style={{ height: CHART_HEIGHT + 50 }}>
        {BARS.map((bar, idx) => {
          const isTagged = tagged.has(idx);
          const h = Math.max(10, (bar.value / maxValue) * CHART_HEIGHT);
          return (
            <button
              key={bar.label}
              type="button"
              onClick={() => tapBar(idx)}
              disabled={isTagged}
              className="flex flex-col items-center gap-2 flex-1"
              style={{ cursor: isTagged ? 'default' : 'pointer' }}
            >
              <span className="text-xs font-black text-slate-500 h-4">
                {isTagged ? unitLabel(bar.value) : ''}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                className="w-full rounded-t-lg shadow-md flex items-start justify-center"
                style={{ background: isTagged ? BAR_COLORS[idx % BAR_COLORS.length] : '#e2e8f0', minHeight: 10 }}
              >
                {isTagged && (
                  <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mt-1">
                    <FaCheckCircle className="text-white text-xs" />
                  </motion.span>
                )}
              </motion.div>
              <span className="text-[11px] sm:text-xs font-black text-slate-600 text-center leading-tight">{bar.label}</span>
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
