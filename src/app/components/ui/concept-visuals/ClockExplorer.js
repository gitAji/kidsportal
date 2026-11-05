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

// Puts into words how a time reads on a clock face, the same way the
// lesson content itself describes it (o'clock / half past / quarter
// past|to / "N minutes past") rather than a bare "3:30".
function timePhrase(hour, minute) {
  const h12 = ((hour + 11) % 12) + 1;
  if (minute === 0) return `${h12} o'clock`;
  if (minute === 30) return `half past ${h12}`;
  if (minute === 15) return `quarter past ${h12}`;
  if (minute === 45) return `quarter to ${((h12 % 12) + 1)}`;
  return `${minute} minutes past ${h12}`;
}

// Hand angles in degrees clockwise from 12 o'clock.
function handAngles(hour, minute) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  return { hourAngle, minuteAngle };
}

const CLOCK_CENTER = { x: 100, y: 100 };
const FACE_RADIUS = 88;

function handPoint(angleDeg, length) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: CLOCK_CENTER.x + length * Math.cos(rad), y: CLOCK_CENTER.y + length * Math.sin(rad) };
}

// A clock face a kid taps apart: first the hour hand (shorter, thicker),
// then the minute hand (longer, thinner), each tap naming what it is and
// where it points — the same "show the actual thing, let them tap it"
// treatment as ShapeExplorer/PerimeterTracer, applied to telling the time
// instead of a flip-card lesson that just states "the short hand is the
// hour hand".
export default function ClockExplorer({ times, onComplete }) {
  const TIMES = useMemo(() => (times && times.length > 0 ? times : [
    { hour: 3, minute: 0 },
    { hour: 7, minute: 30 },
  ]), [times]);

  const [timeIndex, setTimeIndex] = useState(0);
  const [phase, setPhase] = useState('hour'); // 'hour' | 'minute' | 'done'
  const current = TIMES[timeIndex];
  const { hourAngle, minuteAngle } = handAngles(current.hour, current.minute);
  const phrase = timePhrase(current.hour, current.minute);
  const isLastTime = timeIndex === TIMES.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => speak(`Let's read a clock! Tap the hour hand — the short, thick one.`), 300);
    return () => clearTimeout(timer);
  }, [timeIndex]);

  const tapHourHand = useCallback(() => {
    if (phase !== 'hour') return;
    const h12 = ((current.hour + 11) % 12) + 1;
    speak(`This is the hour hand. It's pointing at ${h12}.`);
    setPhase('minute');
    setTimeout(() => speak(`Now tap the minute hand — the longer, thinner one.`), 1800);
  }, [phase, current.hour]);

  const tapMinuteHand = useCallback(() => {
    if (phase !== 'minute') return;
    speak(`This is the minute hand. Together, they show it's ${phrase}.`);
    setPhase('done');
  }, [phase, phrase]);

  const nextTime = () => {
    setTimeIndex((i) => i + 1);
    setPhase('hour');
  };

  const replay = () => speak(`It's ${phrase}.`);

  const numerals = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const angle = n * 30;
    const pos = handPoint(angle, FACE_RADIUS - 18);
    return { n, x: pos.x, y: pos.y };
  }), []);

  const hourTip = handPoint(hourAngle, 42);
  const minuteTip = handPoint(minuteAngle, 68);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {TIMES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < timeIndex ? 'bg-emerald-400' : i === timeIndex ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={timeIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-xs aspect-square"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx={CLOCK_CENTER.x} cy={CLOCK_CENTER.y} r={FACE_RADIUS} fill="#fff" stroke="#334155" strokeWidth={4} />
            {numerals.map(({ n, x, y }) => (
              <text key={n} x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#475569">{n}</text>
            ))}
            <circle cx={CLOCK_CENTER.x} cy={CLOCK_CENTER.y} r={5} fill="#1e293b" />

            {/* Hour hand — wide invisible hit area + visible stroke */}
            <line x1={CLOCK_CENTER.x} y1={CLOCK_CENTER.y} x2={hourTip.x} y2={hourTip.y}
              stroke="transparent" strokeWidth={26} strokeLinecap="round"
              onClick={tapHourHand} style={{ cursor: phase === 'hour' ? 'pointer' : 'default' }} />
            <line x1={CLOCK_CENTER.x} y1={CLOCK_CENTER.y} x2={hourTip.x} y2={hourTip.y}
              stroke={phase === 'hour' ? '#f472b6' : '#1e293b'} strokeWidth={7} strokeLinecap="round"
              style={{ transition: 'stroke 0.2s', pointerEvents: 'none' }} />

            {/* Minute hand */}
            <line x1={CLOCK_CENTER.x} y1={CLOCK_CENTER.y} x2={minuteTip.x} y2={minuteTip.y}
              stroke="transparent" strokeWidth={22} strokeLinecap="round"
              onClick={tapMinuteHand} style={{ cursor: phase === 'minute' ? 'pointer' : 'default' }} />
            <line x1={CLOCK_CENTER.x} y1={CLOCK_CENTER.y} x2={minuteTip.x} y2={minuteTip.y}
              stroke={phase === 'minute' ? '#f472b6' : phase === 'done' ? '#10b981' : '#94a3b8'} strokeWidth={4} strokeLinecap="round"
              style={{ transition: 'stroke 0.2s', pointerEvents: 'none' }} />

            {phase !== 'hour' && (
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx={hourTip.x} cy={hourTip.y} r={9} fill="#10b981" style={{ pointerEvents: 'none' }} />
            )}
            {phase === 'done' && (
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx={minuteTip.x} cy={minuteTip.y} r={7} fill="#10b981" style={{ pointerEvents: 'none' }} />
            )}
          </svg>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
        <h3 className="text-xl font-black text-slate-700">
          {phase === 'done' ? `It's ${phrase}!` : 'Read the Clock'}
        </h3>
        <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      </div>

      <p className="text-sm font-bold text-slate-400 mt-1">
        {phase === 'hour' && 'Tap the short, thick hand — the hour hand'}
        {phase === 'minute' && 'Tap the long, thin hand — the minute hand'}
        {phase === 'done' && 'Both hands found!'}
      </p>

      <div className="mt-6 h-14 flex items-center">
        {phase === 'done' && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLastTime ? onComplete : nextTime}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLastTime ? 'Done!' : 'Next Clock'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
