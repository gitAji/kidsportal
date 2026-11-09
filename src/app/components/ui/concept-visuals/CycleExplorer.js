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

// A circular tap-to-reveal diagram for anything that repeats in stages —
// a life cycle, the water cycle, a growth cycle. Stages sit evenly round
// a ring with arrows showing which way the cycle flows; tapping one names
// it and speaks a one-line fact, which is how the idea that it loops
// back to the start actually lands, versus reading an ordered list.
export default function CycleExplorer({ cycles, onComplete }) {
  const CYCLES = useMemo(() => (cycles && cycles.length > 0 ? cycles : [
    { title: 'The Butterfly Life Cycle', stages: [
      { label: 'Egg', emoji: '🥚', fact: 'A butterfly starts life as a tiny egg laid on a leaf.' },
      { label: 'Caterpillar', emoji: '🐛', fact: 'The egg hatches into a caterpillar that eats and grows.' },
      { label: 'Pupa', emoji: '🛡️', fact: 'The caterpillar forms a hard case called a pupa, or chrysalis.' },
      { label: 'Butterfly', emoji: '🦋', fact: 'A fully grown butterfly emerges and can fly and lay new eggs.' },
    ] },
  ]), [cycles]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const cycle = CYCLES[index];
  const isLast = index === CYCLES.length - 1;
  const complete = revealed.length === cycle.stages.length;
  const n = cycle.stages.length;

  const positions = useMemo(() => cycle.stages.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: 100 + 72 * Math.cos(angle), y: 100 + 72 * Math.sin(angle) };
  }), [cycle, n]);

  const tapStage = useCallback((i) => {
    if (revealed.includes(i)) return;
    const stage = cycle.stages[i];
    const nextRevealed = [...revealed, i];
    speak(`${stage.label}. ${stage.fact}`);
    setRevealed(nextRevealed);
    if (nextRevealed.length === cycle.stages.length) {
      setTimeout(() => speak('And then the cycle starts all over again!'), 1000);
    }
  }, [revealed, cycle]);

  const next = () => { setIndex((i) => i + 1); setRevealed([]); };
  const replay = () => speak(cycle.stages.map((s) => `${s.label}: ${s.fact}`).join(' '));

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {CYCLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center mb-1">{cycle.title}</h3>
      <p className="text-sm font-bold text-slate-400 mb-4 text-center">
        {complete ? 'The cycle starts all over again!' : 'Tap each stage to see what happens'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xs aspect-square">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="72" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
            {cycle.stages.map((stage, i) => {
              const from = positions[i];
              const to = positions[(i + 1) % n];
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
              return (
                <polygon key={`arrow-${i}`} points="-5,-4 5,0 -5,4" fill="#cbd5e1" transform={`translate(${mx},${my}) rotate(${angle})`} />
              );
            })}
            {cycle.stages.map((stage, i) => {
              const isRevealed = revealed.includes(i);
              const pos = positions[i];
              return (
                <g key={i} onClick={() => tapStage(i)} style={{ cursor: isRevealed ? 'default' : 'pointer' }}>
                  <circle cx={pos.x} cy={pos.y} r={24} fill="transparent" />
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={20}
                    animate={{ fill: isRevealed ? '#10b981' : '#ffffff', scale: isRevealed ? [1, 1.25, 1] : 1 }}
                    stroke={isRevealed ? '#10b981' : '#6366f1'} strokeWidth={2.5}
                  />
                  <text x={pos.x} y={pos.y + 7} textAnchor="middle" fontSize="20" style={{ pointerEvents: 'none' }}>{stage.emoji}</text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </AnimatePresence>

      <div className="mt-2 w-full max-w-xs flex flex-col gap-1.5">
        {cycle.stages.map((stage, i) => revealed.includes(i) && (
          <motion.p key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl px-3 py-1.5">
            <span className="font-black">{stage.label}:</span> {stage.fact}
          </motion.p>
        ))}
      </div>

      {complete && (
        <button onClick={replay} aria-label="Listen" className="mt-3 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
        {complete && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Cycle'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
