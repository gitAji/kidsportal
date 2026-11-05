"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function angleType(deg) {
  if (deg === 90) return 'right';
  if (deg < 90) return 'acute';
  if (deg === 180) return 'straight';
  if (deg < 180) return 'obtuse';
  return 'reflex';
}

const ANGLE_COLOR = { right: '#60a5fa', acute: '#f472b6', obtuse: '#fbbf24', straight: '#34d399', reflex: '#a78bfa' };

const VERTEX = { x: 40, y: 150 };
const RAY_LENGTH = 120;

function rayEnd(deg) {
  // 0deg points along the baseline (to the right); angle opens upward (anticlockwise) as deg grows.
  const rad = (deg * Math.PI) / 180;
  return { x: VERTEX.x + RAY_LENGTH * Math.cos(rad), y: VERTEX.y - RAY_LENGTH * Math.sin(rad) };
}

// Describes the angle's opening as an SVG arc path, swept anticlockwise
// from the baseline. A reflex angle (>180°) is drawn as the large arc on
// the far side rather than the small one, since that's the angle the
// question is actually asking about.
function arcPath(deg, radius = 36) {
  const large = deg > 180 ? 1 : 0;
  const start = { x: VERTEX.x + radius, y: VERTEX.y };
  const end = rayEnd(deg % 360 === 0 ? 359.9 : deg);
  const endOnArc = { x: VERTEX.x + radius * Math.cos((deg * Math.PI) / 180), y: VERTEX.y - radius * Math.sin((deg * Math.PI) / 180) };
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 0 ${endOnArc.x} ${endOnArc.y}`;
}

// A pair of rays from a shared vertex, swept open to a given angle. A kid
// taps the arc between the rays to reveal its measure and name (acute,
// right, obtuse, straight, reflex) — the same "tap the actual thing,
// don't just read a paragraph about it" treatment as the other concept
// visuals, applied to angles instead of a shape's sides or a clock's hands.
export default function AngleExplorer({ angles, onComplete }) {
  const ANGLES = useMemo(() => (angles && angles.length > 0 ? angles : [30, 90, 120, 180]), [angles]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const deg = ANGLES[index];
  const type = angleType(deg);
  const color = ANGLE_COLOR[type];
  const isLast = index === ANGLES.length - 1;
  const secondRayEnd = rayEnd(deg);

  useEffect(() => {
    const timer = setTimeout(() => speak(`Tap the curve between the two lines to measure this angle.`), 300);
    return () => clearTimeout(timer);
  }, [index]);

  const tapAngle = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    speak(`This is a ${type} angle. It measures ${deg} degrees.`);
  }, [revealed, type, deg]);

  const next = () => { setIndex((i) => i + 1); setRevealed(false); };
  const replay = () => speak(`This is a ${type} angle. It measures ${deg} degrees.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {ANGLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-xs aspect-[4/3]"
        >
          <svg viewBox="0 0 220 170" className="w-full h-full">
            <line x1={VERTEX.x} y1={VERTEX.y} x2={VERTEX.x + RAY_LENGTH} y2={VERTEX.y} stroke="#1e293b" strokeWidth={4} strokeLinecap="round" />
            <line x1={VERTEX.x} y1={VERTEX.y} x2={secondRayEnd.x} y2={secondRayEnd.y} stroke="#1e293b" strokeWidth={4} strokeLinecap="round" />
            <circle cx={VERTEX.x} cy={VERTEX.y} r={4} fill="#1e293b" />

            {/* Wide invisible hit area over the arc + the visible arc itself */}
            <path d={arcPath(deg, 36)} fill="none" stroke="transparent" strokeWidth={28}
              onClick={tapAngle} style={{ cursor: revealed ? 'default' : 'pointer' }} />
            <path d={arcPath(deg, 36)} fill="none" stroke={revealed ? color : '#94a3b8'} strokeWidth={revealed ? 5 : 3}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s', pointerEvents: 'none' }} />
          </svg>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
        <h3 className="text-xl font-black text-slate-700">
          {revealed ? `${deg}° — a ${type} angle` : 'Measure the Angle'}
        </h3>
        {revealed && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>

      <p className="text-sm font-bold text-slate-400 mt-1">
        {revealed ? 'Great job!' : 'Tap the curve between the two lines'}
      </p>

      <div className="mt-6 h-14 flex items-center">
        {revealed && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Angle'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
