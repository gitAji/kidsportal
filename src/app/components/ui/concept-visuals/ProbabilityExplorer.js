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

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// A bag of coloured counters a kid taps apart, one colour at a time:
// each tap is narrated with how many of that colour are in the bag and
// the probability of pulling one out as a simplified fraction — the same
// tap-and-reveal treatment as the other concept visuals, applied to
// basic probability instead of a flip-card paragraph defining "likely"
// and "unlikely" in the abstract.
export default function ProbabilityExplorer({ outcomes, onComplete }) {
  const OUTCOMES = useMemo(() => outcomes && outcomes.length > 0 ? outcomes : [
    { label: 'Red', count: 3, color: '#f87171' },
    { label: 'Blue', count: 2, color: '#60a5fa' },
    { label: 'Yellow', count: 1, color: '#fbbf24' },
  ], [outcomes]);
  const total = OUTCOMES.reduce((s, o) => s + o.count, 0);
  const [tagged, setTagged] = useState(new Set());
  const done = tagged.size === OUTCOMES.length;

  const fracFor = (count) => {
    const g = gcd(count, total);
    return [count / g, total / g];
  };

  const tapOutcome = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const o = OUTCOMES[idx];
    const [n, d] = fracFor(o.count);
    if (next.size === OUTCOMES.length) {
      speak(`That's every colour counted — there are ${total} counters in the bag altogether.`);
    } else {
      speak(`${o.label}: ${o.count} out of ${total}. The probability of picking ${o.label} is ${n} out of ${d}.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fracFor reads stable total via closure
  }, [tagged, OUTCOMES, total]);

  const replay = () => speak(`There are ${total} counters in the bag altogether: ${OUTCOMES.map((o) => `${o.count} ${o.label.toLowerCase()}`).join(', ')}.`);

  // Lay counters out in a bag-like cluster.
  const positions = useMemo(() => {
    const pts = [];
    let i = 0;
    OUTCOMES.forEach((o, idx) => {
      for (let k = 0; k < o.count; k++) {
        const angle = (i * 2.4) % (2 * Math.PI);
        const radius = 10 + (i % 5) * 11;
        pts.push({ x: 90 + radius * Math.cos(angle), y: 90 + radius * Math.sin(angle), outcomeIdx: idx });
        i++;
      }
    });
    return pts;
  }, [OUTCOMES]);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">What's in the Bag?</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each colour to find out how many — {tagged.size}/{OUTCOMES.length}</p>

      <svg viewBox="0 0 180 180" className="w-full max-w-[200px] h-auto">
        <path d="M 40 60 Q 20 90 40 150 Q 90 175 140 150 Q 160 90 140 60 Z" fill="#fef3c7" stroke="#b45309" strokeWidth={3} />
        {positions.map((p, i) => {
          const isTagged = tagged.has(p.outcomeIdx);
          const color = OUTCOMES[p.outcomeIdx].color;
          return (
            <motion.circle key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02 }}
              cx={p.x} cy={p.y} r={8} fill={isTagged ? color : '#d1d5db'} stroke="#78350f" strokeWidth={1}
              style={{ transition: 'fill 0.2s' }} />
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {OUTCOMES.map((o, idx) => {
          const isTagged = tagged.has(idx);
          return (
            <button key={o.label} type="button" onClick={() => tapOutcome(idx)} disabled={isTagged}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm transition-all active:scale-95"
              style={{ background: isTagged ? `${o.color}22` : '#f1f5f9', color: isTagged ? '#1e293b' : '#94a3b8', cursor: isTagged ? 'default' : 'pointer' }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: o.color }} />
              {o.label}{isTagged && ` — ${o.count}/${total}`}
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
