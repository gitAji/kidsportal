"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp, FaBug } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// A spot-the-bug widget: a short set of everyday "instructions" is shown
// with one step out of place, and the child taps the step that's wrong —
// the same "find and fix the mistake" skill a debugging lesson is
// actually trying to teach, applied to something concrete instead of an
// abstract paragraph about mistakes in code.
export default function DebugHunt({ scenarios, onComplete }) {
  const SCENARIOS = useMemo(() => (scenarios && scenarios.length > 0 ? scenarios : [
    {
      title: 'Making Toast',
      steps: ['Put bread in the toaster', 'Eat the toast', 'Press the toaster down', 'Wait for it to pop up'],
      bugIndex: 1,
      bugFix: '"Eat the toast" should come LAST — you can\'t eat it before it\'s even toasted!',
    },
  ]), [scenarios]);

  const [index, setIndex] = useState(0);
  const [found, setFound] = useState(false);
  const [wrongTap, setWrongTap] = useState(null);
  const scenario = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;

  const tapStep = useCallback((i) => {
    if (found) return;
    if (i === scenario.bugIndex) {
      setFound(true);
      speak(`Found it! ${scenario.bugFix}`);
    } else {
      setWrongTap(i);
      speak('Hmm, that step looks fine. Keep looking!');
      setTimeout(() => setWrongTap(null), 600);
    }
  }, [found, scenario]);

  const next = () => { setIndex((i) => i + 1); setFound(false); setWrongTap(null); };
  const replay = () => speak(scenario.bugFix);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {SCENARIOS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-1">
        <FaBug className="text-rose-400" />
        <h3 className="text-lg sm:text-xl font-black text-slate-700 text-center">{scenario.title}</h3>
      </div>
      <p className="text-sm font-bold text-slate-400 mb-4 text-center">
        {found ? 'Bug fixed!' : 'One of these steps is wrong — tap it!'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-sm flex flex-col gap-2.5">
          {scenario.steps.map((step, i) => {
            const isBug = found && i === scenario.bugIndex;
            const isShaking = wrongTap === i;
            return (
              <motion.button
                key={i}
                onClick={() => tapStep(i)}
                animate={isShaking ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
                disabled={found}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-colors ${
                  isBug ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs bg-slate-100 text-slate-400">{i + 1}</span>
                {step}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {found && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm font-bold text-emerald-600 text-center max-w-sm">{scenario.bugFix}</motion.p>
      )}

      {found && (
        <button onClick={replay} aria-label="Listen" className="mt-2 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
        {found && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Bug'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
