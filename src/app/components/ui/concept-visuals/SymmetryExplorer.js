"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

const CENTER = { x: 100, y: 100 };
const RADIUS = 70;

// Regular polygon vertices, point-up, same convention as ShapeExplorer.
function polygonPoints(sides) {
  const pts = [];
  const startAngleDeg = -90 - 180 / sides;
  for (let i = 0; i < sides; i++) {
    const angleDeg = startAngleDeg + (i * 360) / sides;
    const rad = (angleDeg * Math.PI) / 180;
    pts.push({ x: CENTER.x + RADIUS * Math.cos(rad), y: CENTER.y + RADIUS * Math.sin(rad) });
  }
  return pts;
}

// A regular shape's N lines of symmetry are evenly spaced every 180/N
// degrees, starting from its first vertex's own angle — true for both
// odd N (each line runs vertex-to-opposite-midpoint) and even N (lines
// alternate vertex-to-vertex and midpoint-to-midpoint).
function symmetryLineAngles(sides) {
  const startAngleDeg = -90 - 180 / sides;
  const step = 180 / sides;
  return Array.from({ length: sides }, (_, k) => startAngleDeg + k * step);
}

function lineEndpoints(angleDeg, length = RADIUS * 1.3) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x1: CENTER.x - length * Math.cos(rad), y1: CENTER.y - length * Math.sin(rad),
    x2: CENTER.x + length * Math.cos(rad), y2: CENTER.y + length * Math.sin(rad),
  };
}

// A shape whose lines of symmetry a kid taps one at a time, each one
// drawn in and counted aloud, ending in "this shape has N lines of
// symmetry" — instead of a flip-card paragraph defining a line of
// symmetry in words with no shape to actually check it against.
export default function SymmetryExplorer({ shapes, onComplete }) {
  const SHAPES = useMemo(() => (shapes && shapes.length > 0 ? shapes : [
    { name: 'Equilateral Triangle', sides: 3 }, { name: 'Square', sides: 4 }, { name: 'Regular Pentagon', sides: 5 },
  ]), [shapes]);

  const [index, setIndex] = useState(0);
  const [tagged, setTagged] = useState(new Set());
  const shape = SHAPES[index];
  const points = useMemo(() => polygonPoints(shape.sides), [shape.sides]);
  const angles = useMemo(() => symmetryLineAngles(shape.sides), [shape]);
  const done = tagged.size === angles.length;
  const isLast = index === SHAPES.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => speak(`Tap each line to find every line of symmetry on this ${shape.name.toLowerCase()}.`), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per shape change
  }, [index]);

  const tapLine = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    if (next.size === angles.length) {
      speak(`This ${shape.name.toLowerCase()} has ${angles.length} ${angles.length === 1 ? 'line' : 'lines'} of symmetry.`);
    } else {
      speak(String(next.size));
    }
  }, [tagged, angles.length, shape.name]);

  const next = () => { setIndex((i) => i + 1); setTagged(new Set()); };
  const replay = () => speak(`This ${shape.name.toLowerCase()} has ${angles.length} ${angles.length === 1 ? 'line' : 'lines'} of symmetry.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {SHAPES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-xs aspect-square"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <clipPath id={`clip-${index}`}>
              <polygon points={points.map((p) => `${p.x},${p.y}`).join(' ')} />
            </clipPath>
            <polygon points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="#dbeafe" stroke="#1e293b" strokeWidth={3} />

            <g clipPath={`url(#clip-${index})`}>
              {angles.map((angleDeg, idx) => {
                const tagged_ = tagged.has(idx);
                if (!tagged_) return null;
                const { x1, y1, x2, y2 } = lineEndpoints(angleDeg);
                return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f472b6" strokeWidth={2.5} strokeDasharray="4 3" />;
              })}
            </g>

            {angles.map((angleDeg, idx) => {
              const tagged_ = tagged.has(idx);
              const { x1, y1, x2, y2 } = lineEndpoints(angleDeg);
              return (
                <g key={idx}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={18}
                    onClick={() => tapLine(idx)} style={{ cursor: tagged_ ? 'default' : 'pointer' }} />
                  {!tagged_ && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" style={{ pointerEvents: 'none' }} />}
                </g>
              );
            })}
          </svg>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
        <h3 className="text-xl font-black text-slate-700">{shape.name}</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mt-1">
        Tap each dashed line — {tagged.size}/{angles.length} found
      </p>

      <div className="mt-6 h-14 flex items-center">
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Shape'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
