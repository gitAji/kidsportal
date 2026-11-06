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

// Formats a weight in grams the way the lesson content writes it: plain
// grams under 1000, "1 kg" / "1.5 kg" style above — matches the
// kg-and-g formatting used across the Mass/Weight quiz content.
function formatGrams(g) {
  if (g < 1000) return `${g} g`;
  const kg = g / 1000;
  const rounded = Math.round(kg * 100) / 100;
  return `${rounded} kg`;
}

// Max tilt in degrees for the most lopsided pair this component will
// realistically be given; beyond that the beam just stays maxed out
// rather than spinning past vertical for absurd ratios.
const MAX_TILT = 18;

function tiltForPair(leftG, rightG) {
  if (leftG === rightG) return 0;
  const ratio = Math.log((leftG + 1) / (rightG + 1));
  const clamped = Math.max(-1, Math.min(1, ratio / 3));
  return -clamped * MAX_TILT; // heavier side dips down
}

// A balance scale a kid taps apart, one pan at a time: each pan is
// revealed with its weight spoken aloud, and once both are known the
// beam tips (or sits level) to show which side is heavier, lighter, or
// equal — the same "show the actual thing, let them tap it" treatment
// as the other concept visuals, applied to mass/weight comparisons and
// the gram-kilogram equivalence instead of a flip-card paragraph stating
// "1 kg equals 1000 g".
export default function WeightBalance({ pairs, onComplete }) {
  const PAIRS = useMemo(() => (pairs && pairs.length > 0 ? pairs : [
    { left: { label: '1 kg weight', grams: 1000 }, right: { label: '1000 one-gram candies', grams: 1000 } },
  ]), [pairs]);

  const [index, setIndex] = useState(0);
  const [leftRevealed, setLeftRevealed] = useState(false);
  const [rightRevealed, setRightRevealed] = useState(false);
  const pair = PAIRS[index];
  const bothRevealed = leftRevealed && rightRevealed;
  const isLast = index === PAIRS.length - 1;
  const tilt = bothRevealed ? tiltForPair(pair.left.grams, pair.right.grams) : 0;

  const resultPhrase = () => {
    if (pair.left.grams === pair.right.grams) return `They balance — ${pair.left.label} and ${pair.right.label} weigh exactly the same: ${formatGrams(pair.left.grams)} each.`;
    const heavier = pair.left.grams > pair.right.grams ? pair.left : pair.right;
    const lighter = pair.left.grams > pair.right.grams ? pair.right : pair.left;
    return `${heavier.label} is heavier than ${lighter.label} — ${formatGrams(heavier.grams)} versus ${formatGrams(lighter.grams)}.`;
  };

  const tapLeft = useCallback(() => {
    if (leftRevealed) return;
    setLeftRevealed(true);
    speak(`${pair.left.label}: ${formatGrams(pair.left.grams)}.`);
  }, [leftRevealed, pair]);

  const tapRight = useCallback(() => {
    if (rightRevealed) return;
    setRightRevealed(true);
    speak(`${pair.right.label}: ${formatGrams(pair.right.grams)}.`);
  }, [rightRevealed, pair]);

  React.useEffect(() => {
    if (leftRevealed && rightRevealed) {
      const timer = setTimeout(() => speak(resultPhrase()), 1200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once when the second pan is revealed
  }, [leftRevealed, rightRevealed]);

  const next = () => { setIndex((i) => i + 1); setLeftRevealed(false); setRightRevealed(false); };
  const replay = () => speak(resultPhrase());

  // Beam geometry in a 0-220x0-160 viewBox, pivoting around the fulcrum.
  const PIVOT = { x: 110, y: 60 };
  const BEAM_HALF = 75;
  const rad = (tilt * Math.PI) / 180;
  const leftEnd = { x: PIVOT.x - BEAM_HALF * Math.cos(rad), y: PIVOT.y - BEAM_HALF * Math.sin(rad) };
  const rightEnd = { x: PIVOT.x + BEAM_HALF * Math.cos(rad), y: PIVOT.y + BEAM_HALF * Math.sin(rad) };
  const panDrop = 34;

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {PAIRS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-sm"
        >
          <div className="relative w-full aspect-[11/8]">
          <svg viewBox="0 0 220 160" className="w-full h-full">
            {/* Stand */}
            <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={150} stroke="#92400e" strokeWidth={8} strokeLinecap="round" />
            <line x1={PIVOT.x - 24} y1={150} x2={PIVOT.x + 24} y2={150} stroke="#92400e" strokeWidth={8} strokeLinecap="round" />

            {/* Beam */}
            <motion.line
              x1={leftEnd.x} y1={leftEnd.y} x2={rightEnd.x} y2={rightEnd.y}
              stroke="#78350f" strokeWidth={6} strokeLinecap="round"
              animate={{ x1: leftEnd.x, y1: leftEnd.y, x2: rightEnd.x, y2: rightEnd.y }}
              transition={{ type: 'spring', stiffness: 80, damping: 12 }}
            />
            <circle cx={PIVOT.x} cy={PIVOT.y} r={6} fill="#78350f" />

            {/* Strings */}
            <line x1={leftEnd.x} y1={leftEnd.y} x2={leftEnd.x} y2={leftEnd.y + panDrop} stroke="#78350f" strokeWidth={2} />
            <line x1={rightEnd.x} y1={rightEnd.y} x2={rightEnd.x} y2={rightEnd.y + panDrop} stroke="#78350f" strokeWidth={2} />

            {/* Left pan */}
            <g onClick={tapLeft} style={{ cursor: leftRevealed ? 'default' : 'pointer' }}>
              <ellipse cx={leftEnd.x} cy={leftEnd.y + panDrop} rx={30} ry={10} fill="transparent" stroke="transparent" strokeWidth={26} />
              <ellipse cx={leftEnd.x} cy={leftEnd.y + panDrop} rx={30} ry={9}
                fill={leftRevealed ? '#bbf7d0' : '#fde68a'} stroke="#92400e" strokeWidth={2.5}
                style={{ transition: 'fill 0.2s' }} />
              {leftRevealed && (
                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx={leftEnd.x} cy={leftEnd.y + panDrop} r={7} fill="#10b981" />
              )}
            </g>

            {/* Right pan */}
            <g onClick={tapRight} style={{ cursor: rightRevealed ? 'default' : 'pointer' }}>
              <ellipse cx={rightEnd.x} cy={rightEnd.y + panDrop} rx={30} ry={10} fill="transparent" stroke="transparent" strokeWidth={26} />
              <ellipse cx={rightEnd.x} cy={rightEnd.y + panDrop} rx={30} ry={9}
                fill={rightRevealed ? '#bbf7d0' : '#fde68a'} stroke="#92400e" strokeWidth={2.5}
                style={{ transition: 'fill 0.2s' }} />
              {rightRevealed && (
                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx={rightEnd.x} cy={rightEnd.y + panDrop} r={7} fill="#10b981" />
              )}
            </g>
          </svg>
          </div>

          {/* Labels under each pan */}
          <div className="flex justify-between mt-1 px-2">
            <span className="text-xs sm:text-sm font-black text-slate-600 text-center w-[42%] leading-tight">
              {pair.left.label}{leftRevealed && <span className="block text-emerald-600">{formatGrams(pair.left.grams)}</span>}
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-600 text-center w-[42%] leading-tight">
              {pair.right.label}{rightRevealed && <span className="block text-emerald-600">{formatGrams(pair.right.grams)}</span>}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
        <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center">
          {bothRevealed
            ? (pair.left.grams === pair.right.grams ? 'They balance!' : 'One side is heavier!')
            : 'Weigh Both Sides'}
        </h3>
        {bothRevealed && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mt-1">
        {!leftRevealed ? 'Tap the left pan to weigh it' : !rightRevealed ? 'Now tap the right pan' : 'Great job!'}
      </p>

      <div className="mt-6 h-14 flex items-center">
        {bothRevealed && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Pair'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
