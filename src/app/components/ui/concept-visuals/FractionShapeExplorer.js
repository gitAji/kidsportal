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

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplify(n, d) {
  const g = gcd(n, d);
  return [n / g, d / g];
}
const WORDS = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 8: 'eighth', 10: 'tenth', 100: 'hundredth' };
function fractionWord(n, d) {
  const [sn, sd] = simplify(n, d);
  const unit = WORDS[sd] || `${sd}th`;
  if (sn === 1) return `one ${unit}`;
  return `${sn} ${unit}${sd === 2 && sn === 1 ? '' : 's'}`.replace('halfs', 'halves');
}

// Circle sector path for the i-th of `total` equal wedges.
function sectorPath(i, total, r = 70, cx = 90, cy = 90) {
  const start = (i / total) * 2 * Math.PI - Math.PI / 2;
  const end = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2;
  const large = (end - start) > Math.PI ? 1 : 0;
  const p0 = { x: cx + r * Math.cos(start), y: cy + r * Math.sin(start) };
  const p1 = { x: cx + r * Math.cos(end), y: cy + r * Math.sin(end) };
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
}

// A shape (pie or bar) divided into equal parts, each of which a kid taps
// in turn — shaded parts are highlighted, each tap narrates "part N of
// M", and once every part is tapped the whole fraction is spoken and
// shown in writing (simplified where that gives a friendlier name, e.g.
// "2 out of 4, that's one half") — the same tap-and-reveal treatment as
// the other concept visuals, applied to fractions of a shape instead of
// a flip-card paragraph defining numerator/denominator in words.
export default function FractionShapeExplorer({ examples, onComplete }) {
  const EXAMPLES = useMemo(() => examples && examples.length > 0 ? examples : [
    { totalParts: 4, shadedParts: 1, shape: 'circle' },
  ], [examples]);

  const [index, setIndex] = useState(0);
  const [tagged, setTagged] = useState(new Set());
  const ex = EXAMPLES[index];
  const done = tagged.size === ex.totalParts;
  const isLast = index === EXAMPLES.length - 1;
  const [sn, sd] = simplify(ex.shadedParts, ex.totalParts);

  const summaryPhrase = () => `${ex.shadedParts} out of ${ex.totalParts} parts are shaded — that's ${fractionWord(ex.shadedParts, ex.totalParts)}, written as ${sn}/${sd}.`;

  const tapPart = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const isShaded = idx < ex.shadedParts;
    if (next.size === ex.totalParts) {
      speak(summaryPhrase());
    } else {
      speak(isShaded ? `Part ${idx + 1} — shaded.` : `Part ${idx + 1} — not shaded.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- summaryPhrase reads current ex via closure
  }, [tagged, ex]);

  const next = () => { setIndex((i) => i + 1); setTagged(new Set()); };
  const replay = () => speak(summaryPhrase());

  const parts = Array.from({ length: ex.totalParts }, (_, i) => i);
  const barWidth = 320;
  const partWidth = barWidth / ex.totalParts;

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {EXAMPLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-sm flex items-center justify-center"
        >
          {ex.shape === 'bar' ? (
            <svg viewBox={`0 0 ${barWidth} 70`} className="w-full h-auto max-w-xs">
              {parts.map((i) => {
                const isTagged = tagged.has(i);
                const isShaded = i < ex.shadedParts;
                return (
                  <g key={i} onClick={() => tapPart(i)} style={{ cursor: isTagged ? 'default' : 'pointer' }}>
                    <rect x={i * partWidth} y={10} width={partWidth} height={50}
                      fill={isTagged ? (isShaded ? '#34d399' : '#f1f5f9') : '#e2e8f0'}
                      stroke="#1e293b" strokeWidth={2}
                      style={{ transition: 'fill 0.2s' }} />
                    {isTagged && (
                      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        x={i * partWidth + partWidth / 2} y={40} textAnchor="middle" fontSize="12" fontWeight="900"
                        fill={isShaded ? '#065f46' : '#94a3b8'}>{i + 1}</motion.text>
                    )}
                  </g>
                );
              })}
            </svg>
          ) : (
            <svg viewBox="0 0 180 180" className="w-full h-auto max-w-[220px]">
              {parts.map((i) => {
                const isTagged = tagged.has(i);
                const isShaded = i < ex.shadedParts;
                return (
                  <path key={i} d={sectorPath(i, ex.totalParts)}
                    onClick={() => tapPart(i)}
                    fill={isTagged ? (isShaded ? '#34d399' : '#f8fafc') : '#e2e8f0'}
                    stroke="#1e293b" strokeWidth={2}
                    style={{ cursor: isTagged ? 'default' : 'pointer', transition: 'fill 0.2s' }} />
                );
              })}
            </svg>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
        <h3 className="text-xl font-black text-slate-700">
          {done ? `${sn}/${sd} — ${fractionWord(ex.shadedParts, ex.totalParts)}` : 'Tap Every Part'}
        </h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mt-1">
        {!done ? `Tap each part — ${tagged.size}/${ex.totalParts}` : 'Great job!'}
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
