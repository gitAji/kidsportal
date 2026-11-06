"use client";
import React, { useState, useCallback } from 'react';
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

const CENTER = { x: 100, y: 100 };
const PIXELS_PER_UNIT = 6;

// A circle whose radius, circumference and area a kid taps in turn —
// each one narrated with its value (circumference and area computed
// live from the radius and rounded to 1dp) — instead of a flip-card
// paragraph stating the formulas C = 2{π}r and A = {π}r{²} with no
// actual circle to point at.
export default function CircleExplorer({ radius = 5, unit = 'cm', onComplete }) {
  const [tagged, setTagged] = useState(new Set()); // 0=radius,1=circumference,2=area
  const r = PIXELS_PER_UNIT * Math.min(radius, 12);
  const circumference = Math.round(2 * Math.PI * radius * 10) / 10;
  const area = Math.round(Math.PI * radius * radius * 10) / 10;
  const done = tagged.size === 3;

  const radiusTagged = tagged.has(0);
  const circumferenceTagged = tagged.has(1);
  const areaTagged = tagged.has(2);

  const tapPart = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    if (idx === 0) speak(`The radius is ${radius} ${unit}.`);
    else if (idx === 1) speak(`The circumference — the distance all the way around — is 2 times pi times the radius, which is about ${circumference} ${unit}.`);
    else speak(`The area — the space inside — is pi times the radius squared, which is about ${area} square ${unit}.`);
  }, [tagged, radius, unit, circumference, area]);

  const replay = () => speak(`Radius ${radius} ${unit}. Circumference about ${circumference} ${unit}. Area about ${area} square ${unit}.`);

  const endX = CENTER.x + r;

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Explore the Circle</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">
        Tap the radius, the edge, and inside the circle — {tagged.size}/3
      </p>

      <svg viewBox="0 0 200 200" className="w-full max-w-xs h-auto">
        <circle cx={CENTER.x} cy={CENTER.y} r={r}
          onClick={() => tapPart(2)}
          fill={areaTagged ? '#a78bfa55' : '#e2e8f0'}
          stroke="none"
          style={{ cursor: areaTagged ? 'default' : 'pointer', transition: 'fill 0.2s' }} />
        <circle cx={CENTER.x} cy={CENTER.y} r={r}
          onClick={() => tapPart(1)}
          fill="none"
          stroke={circumferenceTagged ? '#f472b6' : '#94a3b8'}
          strokeWidth={circumferenceTagged ? 5 : 3}
          style={{ cursor: circumferenceTagged ? 'default' : 'pointer', transition: 'stroke 0.2s' }} />
        <line x1={CENTER.x} y1={CENTER.y} x2={endX} y2={CENTER.y}
          onClick={() => tapPart(0)}
          stroke="transparent" strokeWidth={18}
          style={{ cursor: radiusTagged ? 'default' : 'pointer' }} />
        <line x1={CENTER.x} y1={CENTER.y} x2={endX} y2={CENTER.y}
          stroke={radiusTagged ? '#10b981' : '#1e293b'} strokeWidth={radiusTagged ? 4 : 2.5}
          style={{ pointerEvents: 'none' }} />
        <circle cx={CENTER.x} cy={CENTER.y} r={3} fill="#1e293b" />
        {radiusTagged && (
          <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            x={(CENTER.x + endX) / 2} y={CENTER.y - 8} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">
            {radius}{unit}
          </motion.text>
        )}
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {radiusTagged && <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm">Radius: {radius}{unit}</span>}
        {circumferenceTagged && <span className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-600 font-black text-sm">Circumference: {circumference}{unit}</span>}
        {areaTagged && <span className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-600 font-black text-sm">Area: {area}{unit}&sup2;</span>}
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
