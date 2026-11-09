"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp, FaLightbulb } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const GATE_EXPLAIN = {
  AND: 'AND needs BOTH switches on to light up.',
  OR: 'OR lights up if AT LEAST ONE switch is on.',
  NOT: 'NOT flips the switch — on becomes off, and off becomes on.',
};

function computeOutput(type, a, b) {
  if (type === 'AND') return a && b;
  if (type === 'OR') return a || b;
  if (type === 'NOT') return !a;
  return false;
}

// Two tappable switches feeding a lamp: flip A and B and watch the lamp
// react according to AND / OR / NOT — the actual truth table, built by
// tapping it rather than reading it off a table of 0s and 1s.
export default function LogicGateExplorer({ gates, onComplete }) {
  const GATES = useMemo(() => (gates && gates.length > 0 ? gates : [
    { type: 'AND', label: 'AND Gate' },
  ]), [gates]);

  const [index, setIndex] = useState(0);
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const gate = GATES[index];
  const isLast = index === GATES.length - 1;
  const output = computeOutput(gate.type, a, b);

  const toggleA = useCallback(() => {
    setA((v) => {
      const nv = !v;
      speak(`Switch A is now ${nv ? 'on' : 'off'}. The light is ${computeOutput(gate.type, nv, b) ? 'on' : 'off'}.`);
      return nv;
    });
  }, [b, gate.type]);

  const toggleB = useCallback(() => {
    setB((v) => {
      const nv = !v;
      speak(`Switch B is now ${nv ? 'on' : 'off'}. The light is ${computeOutput(gate.type, a, nv) ? 'on' : 'off'}.`);
      return nv;
    });
  }, [a, gate.type]);

  const next = () => { setIndex((i) => i + 1); setA(false); setB(false); };
  const replay = () => speak(GATE_EXPLAIN[gate.type]);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {GATES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center mb-1">{gate.label}</h3>
      <p className="text-sm font-bold text-slate-400 mb-5 text-center">{GATE_EXPLAIN[gate.type]}</p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-6">
            <button onClick={toggleA} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-black text-slate-400">A</span>
              <motion.span animate={{ backgroundColor: a ? '#6366f1' : '#e2e8f0' }} className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white shadow-sm">
                {a ? 'ON' : 'OFF'}
              </motion.span>
            </button>
            {gate.type !== 'NOT' && (
              <button onClick={toggleB} className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-black text-slate-400">B</span>
                <motion.span animate={{ backgroundColor: b ? '#6366f1' : '#e2e8f0' }} className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white shadow-sm">
                  {b ? 'ON' : 'OFF'}
                </motion.span>
              </button>
            )}
            <div className="text-2xl font-black text-slate-400">→</div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-black text-slate-400">Light</span>
              <motion.div animate={{ scale: output ? [1, 1.2, 1] : 1 }} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${output ? 'bg-yellow-300' : 'bg-slate-200'}`}>
                <FaLightbulb className={`text-2xl ${output ? 'text-yellow-600' : 'text-slate-400'}`} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={replay} aria-label="Listen" className="mt-5 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
        <FaVolumeUp className="text-sm" />
      </button>

      <div className="mt-6 h-14 flex items-center">
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onClick={isLast ? onComplete : next}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
          <FaCheckCircle /> {isLast ? 'Done!' : 'Next Gate'} <FaArrowRight className="text-xs" />
        </motion.button>
      </div>
    </div>
  );
}
