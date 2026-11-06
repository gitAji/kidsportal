"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp } from 'react-icons/fa';

// Speaks a short phrase in a clear English voice — same "always en-GB,
// never mismatched with translated text" rule established for AudioPlayer
// elsewhere, but inlined here since these are rapid-fire tap reactions
// (a count, a side length) rather than a single page-level narration.
function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// Regular polygon vertex points for an N-sided shape, centered in a
// 0-200 viewBox, point-up.
function polygonPoints(sides, radius = 70, cx = 100, cy = 105) {
  const pts = [];
  const startAngle = -Math.PI / 2 - Math.PI / sides; // keeps shapes point-up / flat-top consistently
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / sides;
    pts.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  }
  return pts;
}

const SHAPES = [
  { id: 'triangle', name: 'Triangle', sides: 3, color: '#f472b6' },
  { id: 'square', name: 'Square', sides: 4, color: '#60a5fa' },
  { id: 'pentagon', name: 'Pentagon', sides: 5, color: '#34d399' },
  { id: 'hexagon', name: 'Hexagon', sides: 6, color: '#fbbf24' },
];

// Tap-to-count interactive shape: a kid taps each side, then each corner
// (vertex) of a shape to count them out loud, instead of reading a
// paragraph that states the counts — "show an actual shape... the user
// can interact with it and show it practically."
export default function ShapeExplorer({ onComplete }) {
  const [shapeIndex, setShapeIndex] = useState(0);
  const [phase, setPhase] = useState('sides'); // 'sides' | 'vertices'
  const [taggedSides, setTaggedSides] = useState(new Set());
  const [taggedVertices, setTaggedVertices] = useState(new Set());

  const shape = SHAPES[shapeIndex];
  const points = useMemo(() => polygonPoints(shape.sides), [shape.sides]);
  const isLastShape = shapeIndex === SHAPES.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => speak(`Let's explore a ${shape.name}! Tap each side to count it.`), 300);
    return () => clearTimeout(timer);
  }, [shapeIndex, shape.name]);

  const sidesDone = taggedSides.size === shape.sides;
  const verticesDone = taggedVertices.size === shape.sides;

  const tapSide = useCallback((idx) => {
    if (taggedSides.has(idx)) return;
    const next = new Set(taggedSides).add(idx);
    setTaggedSides(next);
    if (next.size === shape.sides) {
      speak(`Great! This ${shape.name.toLowerCase()} has ${shape.sides} sides.`);
    } else {
      speak(String(next.size));
    }
  }, [taggedSides, shape]);

  const tapVertex = useCallback((idx) => {
    if (taggedVertices.has(idx)) return;
    const next = new Set(taggedVertices).add(idx);
    setTaggedVertices(next);
    if (next.size === shape.sides) {
      speak(`This ${shape.name.toLowerCase()} also has ${shape.sides} vertices, or corners.`);
    } else {
      speak(String(next.size));
    }
  }, [taggedVertices, shape]);

  const goToVertices = () => {
    setPhase('vertices');
    setTimeout(() => speak(`Now tap each corner, or vertex, to count them.`), 200);
  };

  const nextShape = () => {
    setShapeIndex((i) => i + 1);
    setPhase('sides');
    setTaggedSides(new Set());
    setTaggedVertices(new Set());
  };

  const replay = () => {
    if (phase === 'sides') speak(`This ${shape.name.toLowerCase()} has ${shape.sides} sides.`);
    else speak(`This ${shape.name.toLowerCase()} has ${shape.sides} vertices.`);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {SHAPES.map((s, i) => (
            <span key={s.id} className={`w-2.5 h-2.5 rounded-full ${i < shapeIndex ? 'bg-emerald-400' : i === shapeIndex ? 'bg-indigo-500' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${phase === 'sides' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>1. Sides</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${phase === 'vertices' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>2. Vertices</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={shape.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-xs aspect-square"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Shape fill */}
              <polygon
                points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                fill={`${shape.color}22`}
                stroke="none"
              />
              {/* Sides — wide invisible hit area + visible stroke */}
              {points.map((p, i) => {
                const next = points[(i + 1) % points.length];
                const tagged = taggedSides.has(i);
                const mx = (p.x + next.x) / 2;
                const my = (p.y + next.y) / 2;
                return (
                  <g key={`side-${i}`}>
                    <line
                      x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                      stroke="transparent" strokeWidth={22}
                      onClick={() => phase === 'sides' && tapSide(i)}
                      style={{ cursor: phase === 'sides' ? 'pointer' : 'default' }}
                    />
                    <line
                      x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                      stroke={tagged ? '#10b981' : shape.color}
                      strokeWidth={tagged ? 7 : 4}
                      strokeLinecap="round"
                      style={{ transition: 'stroke 0.2s, stroke-width 0.2s', pointerEvents: 'none' }}
                    />
                    {tagged && (
                      <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx={mx} cy={my} r={11} fill="#10b981" style={{ pointerEvents: 'none' }} />
                    )}
                    {tagged && (
                      <text x={mx} y={my + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="white" style={{ pointerEvents: 'none' }}>
                        {[...taggedSides].indexOf(i) + 1}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Vertices */}
              {points.map((p, i) => {
                const tagged = taggedVertices.has(i);
                return (
                  <g key={`vertex-${i}`}>
                    <circle
                      cx={p.x} cy={p.y} r={phase === 'vertices' ? 16 : 6}
                      fill={tagged ? '#10b981' : phase === 'vertices' ? '#1e293b' : '#334155'}
                      stroke="white" strokeWidth={2}
                      onClick={() => phase === 'vertices' && tapVertex(i)}
                      style={{ cursor: phase === 'vertices' ? 'pointer' : 'default', transition: 'r 0.2s, fill 0.2s' }}
                    />
                    {tagged && (
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="white" style={{ pointerEvents: 'none' }}>
                        {[...taggedVertices].indexOf(i) + 1}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-3">
          <h3 className="text-xl font-black text-slate-700">{shape.name}</h3>
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        </div>

        <p className="text-sm font-bold text-slate-400 mt-1">
          {phase === 'sides'
            ? `Tap each side — ${taggedSides.size}/${shape.sides} counted`
            : `Tap each corner — ${taggedVertices.size}/${shape.sides} counted`}
        </p>

        <div className="mt-6 h-14 flex items-center">
          {phase === 'sides' && sidesDone && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={goToVertices}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-black shadow-lg">
              <FaCheckCircle /> Now count the corners <FaArrowRight className="text-xs" />
            </motion.button>
          )}
          {phase === 'vertices' && verticesDone && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={isLastShape ? onComplete : nextShape}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
              <FaCheckCircle /> {isLastShape ? 'Done!' : 'Next Shape'} <FaArrowRight className="text-xs" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
