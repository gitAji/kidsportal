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

// A tap-the-right-mark activity for punctuation/capitalisation lessons
// (sentence types, full stops vs. question marks, apostrophes for
// possession...). Each round shows a sentence with one mark blanked
// out as "___"; tapping an option drops it into the blank, reads the
// finished sentence aloud, and either confirms or nudges to try again
// — practising the actual judgement call instead of reading a
// paragraph that explains the rule.
export default function PunctuationPicker({ rounds, lang, onComplete }) {
  const ROUNDS = useMemo(() => (rounds && rounds.length > 0 ? rounds : [
    { prompt: 'Pick the mark that finishes the sentence', sentence: 'Is the cat sleeping___', options: ['.', '?', '!'], correctIndex: 1 },
  ]), [rounds]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const round = ROUNDS[index];
  const isLast = index === ROUNDS.length - 1;

  const sentenceParts = round.sentence.split('___');
  const filledSentence = sentenceParts.join(chosen !== null ? round.options[chosen] : '___');

  const tapOption = useCallback((i) => {
    if (status === 'correct') return;
    setChosen(i);
    if (i === round.correctIndex) {
      setStatus('correct');
      speak(round.sentence.replace('___', round.options[i]), lang);
    } else {
      setStatus('wrong');
      speak('Not quite — try another one!', lang);
      setTimeout(() => { setStatus('idle'); setChosen(null); }, 700);
    }
  }, [status, round, lang]);

  const next = () => { setIndex((i) => i + 1); setChosen(null); setStatus('idle'); };
  const replay = () => speak(filledSentence, lang);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-5">
        {ROUNDS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <p className="text-sm font-bold text-slate-400 mb-4 text-center">{round.prompt}</p>

      <div className="w-full max-w-md bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-8 mb-6 text-center">
        <p className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
          {sentenceParts.map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={status === 'correct' ? 'text-emerald-500' : status === 'wrong' ? 'text-rose-500' : 'text-indigo-400'}
                >
                  {chosen !== null ? round.options[chosen] : '__'}
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        {round.options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => tapOption(i)}
            whileTap={{ scale: 0.92 }}
            animate={status === 'wrong' && chosen === i ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
            disabled={status === 'correct'}
            className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-colors ${status === 'correct' && chosen === i
              ? 'bg-emerald-50 border-emerald-400 text-emerald-600'
              : status === 'wrong' && chosen === i
                ? 'bg-rose-50 border-rose-400 text-rose-500'
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {status === 'correct' && (
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-2">
          <FaCheckCircle /> That's it!
          <button onClick={replay} aria-label="Listen" className="ml-2 p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-xs" />
          </button>
        </div>
      )}
      {status === 'wrong' && (
        <div className="flex items-center gap-2 text-rose-500 font-bold text-sm mb-2">
          <FaTimesCircle /> Try again!
        </div>
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
