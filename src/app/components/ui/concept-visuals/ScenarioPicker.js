"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp, FaTimesCircle } from 'react-icons/fa';

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang || 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// A "what would you do?" decision activity for safety and social-skills
// lessons (stranger danger, fire/home/road safety, online safety, digital
// citizenship, conflict resolution...). Each round poses a short real-life
// situation with 2-3 possible responses; tapping the safe/kind one gets
// an explanation of why, tapping a wrong one nudges to try again —
// practising the actual judgement call a "what should you do if..."
// lesson is after, instead of reading a paragraph that states the rule.
export default function ScenarioPicker({ rounds, lang, onComplete }) {
  const ROUNDS = useMemo(() => (rounds && rounds.length > 0 ? rounds : [
    { situation: 'A stranger offers you sweets and asks you to get in their car.', options: ['Get in the car', 'Say no and find a trusted adult', 'Take the sweets first'], correctIndex: 1, why: "It's never safe to go anywhere with a stranger, even if they offer something nice." },
  ]), [rounds]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const round = ROUNDS[index];
  const isLast = index === ROUNDS.length - 1;

  const tapOption = useCallback((i) => {
    if (status === 'correct') return;
    setChosen(i);
    if (i === round.correctIndex) {
      setStatus('correct');
      speak(round.why || round.options[i], lang);
    } else {
      setStatus('wrong');
      speak("That's not the safest choice — try again!", lang);
      setTimeout(() => { setStatus('idle'); setChosen(null); }, 800);
    }
  }, [status, round, lang]);

  const next = () => { setIndex((i) => i + 1); setChosen(null); setStatus('idle'); };
  const replay = () => speak(round.why || round.options[round.correctIndex], lang);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-5">
        {ROUNDS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="w-full max-w-md bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 mb-5 text-center">
        <p className="font-bold text-slate-800 leading-snug">{round.situation}</p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-2.5 mb-4">
        {round.options.map((opt, i) => {
          const isRight = status === 'correct' && i === chosen;
          const isWrong = status === 'wrong' && i === chosen;
          return (
            <motion.button
              key={i}
              onClick={() => tapOption(i)}
              whileTap={{ scale: 0.97 }}
              animate={isWrong ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
              disabled={status === 'correct'}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left font-bold text-sm transition-colors ${isRight
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                : isWrong
                  ? 'bg-rose-50 border-rose-400 text-rose-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                }`}
            >
              {isRight && <FaCheckCircle className="flex-shrink-0" />}
              {isWrong && <FaTimesCircle className="flex-shrink-0" />}
              {opt}
            </motion.button>
          );
        })}
      </div>

      {status === 'correct' && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center mb-2">
          <p className="text-sm font-bold text-emerald-600 mb-2">{round.why}</p>
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-xs" />
          </button>
        </motion.div>
      )}

      <div className="mt-4 h-14 flex items-center">
        {status === 'correct' && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Round'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
