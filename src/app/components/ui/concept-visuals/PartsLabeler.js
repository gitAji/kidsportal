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

// Plain, friendly line-drawings (shapes, not photos) that the tappable
// part-pins sit on top of — one per "scene" name used in a diagram's
// config. Deliberately simple: the point is naming and locating real
// parts, not realistic art.
const SCENES = {
  plant: () => (
    <g>
      <ellipse cx="100" cy="183" rx="55" ry="10" fill="#a16207" opacity="0.5" />
      <path d="M90 183 Q 72 195 58 207 M100 183 L100 198 M110 183 Q 128 195 142 207" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="100" y1="183" x2="100" y2="70" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
      <path d="M100 95 C 70 85, 58 55, 72 42 C 88 58, 95 78, 100 95 Z" fill="#22c55e" />
      <path d="M100 115 C 132 105, 142 75, 128 62 C 112 78, 105 98, 100 115 Z" fill="#16a34a" />
      <circle cx="100" cy="42" r="15" fill="#f472b6" />
      <circle cx="100" cy="42" r="6" fill="#fde047" />
    </g>
  ),
  tree: () => (
    <g>
      <ellipse cx="100" cy="195" rx="60" ry="8" fill="#854d0e" opacity="0.35" />
      <path d="M88 195 Q 70 185 85 150 L115 150 Q 130 185 112 195 Z" fill="#92400e" />
      <path d="M90 195 Q 70 203 55 212 M100 195 L100 208 M110 195 Q 130 203 145 212" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="100" y1="150" x2="78" y2="118" stroke="#78350f" strokeWidth="5" />
      <line x1="100" y1="150" x2="122" y2="118" stroke="#78350f" strokeWidth="5" />
      <circle cx="70" cy="95" r="36" fill="#22c55e" />
      <circle cx="130" cy="95" r="36" fill="#16a34a" />
      <circle cx="100" cy="65" r="40" fill="#4ade80" />
    </g>
  ),
  face: () => (
    <g>
      <circle cx="100" cy="95" r="58" fill="#fcd9b8" stroke="#d97706" strokeWidth="2" />
      <path d="M58 90 Q 44 96 58 108" stroke="#d97706" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M142 90 Q 156 96 142 108" stroke="#d97706" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="78" cy="85" rx="8" ry="6" fill="#1e293b" />
      <ellipse cx="122" cy="85" rx="8" ry="6" fill="#1e293b" />
      <path d="M100 90 L94 112 Q100 118 106 112" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M78 130 Q100 146 122 130" stroke="#b91c1c" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  ),
  hand: () => (
    <g fill="#fcd9b8" stroke="#d97706" strokeWidth="2">
      <rect x="72" y="95" width="56" height="62" rx="22" />
      <rect x="55" y="48" width="16" height="58" rx="8" />
      <rect x="76" y="30" width="14" height="75" rx="7" />
      <rect x="93" y="22" width="14" height="83" rx="7" />
      <rect x="110" y="30" width="14" height="75" rx="7" />
      <rect x="127" y="48" width="14" height="58" rx="7" />
    </g>
  ),
  skeleton: () => (
    <g stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none">
      <circle cx="100" cy="28" r="18" fill="#f1f5f9" stroke="#475569" strokeWidth="3" />
      <line x1="100" y1="46" x2="100" y2="120" />
      <ellipse cx="100" cy="75" rx="30" ry="24" fill="none" />
      <line x1="100" y1="90" x2="58" y2="60" />
      <line x1="58" y1="60" x2="42" y2="102" />
      <line x1="100" y1="90" x2="142" y2="60" />
      <line x1="142" y1="60" x2="158" y2="102" />
      <line x1="78" y1="118" x2="122" y2="118" strokeWidth="7" />
      <line x1="100" y1="120" x2="68" y2="162" />
      <line x1="68" y1="162" x2="62" y2="198" />
      <line x1="100" y1="120" x2="132" y2="162" />
      <line x1="132" y1="162" x2="138" y2="198" />
    </g>
  ),
  insect: () => (
    <g>
      <ellipse cx="100" cy="142" rx="36" ry="46" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
      <ellipse cx="100" cy="85" rx="23" ry="21" fill="#65a30d" stroke="#4d7c0f" strokeWidth="2" />
      <circle cx="100" cy="44" r="17" fill="#4d7c0f" />
      <path d="M90 31 Q 74 8 63 13" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M110 31 Q 126 8 137 13" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="80" y1="90" x2="52" y2="74" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="78" y1="102" x2="46" y2="102" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="114" x2="52" y2="134" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="90" x2="148" y2="74" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="122" y1="102" x2="154" y2="102" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="114" x2="148" y2="134" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
};

// A labelled-diagram widget: a plain illustration (plant, tree, face,
// skeleton, insect...) with a handful of tappable numbered pins. Tapping
// a pin names that part, speaks a one-line fact about it, and marks it
// found — turning "label the parts" from a paragraph to read into a
// picture the child actually points at.
export default function PartsLabeler({ diagrams, onComplete }) {
  const DIAGRAMS = useMemo(() => (diagrams && diagrams.length > 0 ? diagrams : [
    { scene: 'plant', title: 'Parts of a Flowering Plant', parts: [
      { label: 'Roots', x: 100, y: 200, fact: 'Roots soak up water from the soil and hold the plant steady.' },
      { label: 'Stem', x: 100, y: 130, fact: 'The stem carries water up to the leaves and flower.' },
      { label: 'Leaf', x: 75, y: 70, fact: 'Leaves catch sunlight and make food for the plant.' },
      { label: 'Flower', x: 100, y: 42, fact: 'The flower makes seeds so new plants can grow.' },
    ] },
  ]), [diagrams]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const diagram = DIAGRAMS[index];
  const Scene = SCENES[diagram.scene] || SCENES.plant;
  const isLast = index === DIAGRAMS.length - 1;
  const complete = revealed.length === diagram.parts.length;

  const tapPart = useCallback((i) => {
    if (revealed.includes(i)) return;
    const part = diagram.parts[i];
    const nextRevealed = [...revealed, i];
    speak(`${part.label}. ${part.fact}`);
    setRevealed(nextRevealed);
    if (nextRevealed.length === diagram.parts.length) {
      setTimeout(() => speak(`Great job — you found every part of ${diagram.title}!`), 900);
    }
  }, [revealed, diagram]);

  const next = () => { setIndex((i) => i + 1); setRevealed([]); };
  const replay = () => speak(diagram.parts.map((p) => `${p.label}: ${p.fact}`).join(' '));

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {DIAGRAMS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center mb-1">{diagram.title}</h3>
      <p className="text-sm font-bold text-slate-400 mb-4 text-center">
        {complete ? 'All parts found!' : 'Tap each glowing number to find out what it is'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xs aspect-square">
          <svg viewBox="0 0 200 215" className="w-full h-full">
            <Scene />
            {diagram.parts.map((part, i) => {
              const isRevealed = revealed.includes(i);
              return (
                <g key={i} onClick={() => tapPart(i)} style={{ cursor: isRevealed ? 'default' : 'pointer' }}>
                  <circle cx={part.x} cy={part.y} r={16} fill="transparent" />
                  <motion.circle
                    cx={part.x} cy={part.y} r={10}
                    animate={{ fill: isRevealed ? '#10b981' : '#ffffff', scale: isRevealed ? [1, 1.3, 1] : 1 }}
                    stroke={isRevealed ? '#10b981' : '#6366f1'} strokeWidth={2.5}
                  />
                  <text x={part.x} y={part.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={isRevealed ? '#ffffff' : '#6366f1'} style={{ pointerEvents: 'none' }}>
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 w-full max-w-xs flex flex-col gap-1.5">
        {diagram.parts.map((part, i) => revealed.includes(i) && (
          <motion.p key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl px-3 py-1.5">
            <span className="font-black">{part.label}:</span> {part.fact}
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
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Diagram'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
