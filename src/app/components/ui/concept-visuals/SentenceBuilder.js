"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp, FaRedo } from 'react-icons/fa';

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang || 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A tap-the-words-in-order activity for sentence-construction lessons
// (joining ideas, fronted adverbials, expanded noun phrases, simple vs.
// compound sentences...). Each round's `words` are given in their
// correct sentence order; the component shuffles them for display and
// the child taps them back into order — building the actual sentence
// with their own choices instead of reading one that's already built.
export default function SentenceBuilder({ rounds, lang, onComplete }) {
  const ROUNDS = useMemo(() => (rounds && rounds.length > 0 ? rounds : [
    { prompt: 'Tap the words in the right order', words: ['The', 'cat', 'is', 'sleeping'] },
  ]), [rounds]);

  const [index, setIndex] = useState(0);
  // Unshuffled on first render so server and client markup match exactly
  // (Math.random() in useState's initializer would run during SSR too,
  // producing a different order than the client re-render and tripping a
  // hydration mismatch) — the effect below shuffles it client-side right
  // after mount instead.
  const [shuffled, setShuffled] = useState(() => ROUNDS[0].words.map((text, i) => ({ text, origIndex: i })));
  const [built, setBuilt] = useState([]); // array of origIndex in tap order
  const [wrongTap, setWrongTap] = useState(null);

  const round = ROUNDS[index];
  const isLast = index === ROUNDS.length - 1;
  const complete = built.length === round.words.length;

  const loadRound = useCallback((i) => {
    setShuffled(shuffle(ROUNDS[i].words.map((text, idx) => ({ text, origIndex: idx }))));
    setBuilt([]);
  }, [ROUNDS]);

  useEffect(() => { loadRound(0); }, [loadRound]);

  const tapWord = (shuffledIdx, origIndex) => {
    if (built.includes(origIndex) || complete) return;
    const expectedNext = built.length;
    if (origIndex === expectedNext) {
      const next = [...built, origIndex];
      setBuilt(next);
      if (next.length === round.words.length) {
        speak(round.words.join(' '), lang);
      }
    } else {
      setWrongTap(shuffledIdx);
      setTimeout(() => setWrongTap(null), 500);
    }
  };

  const resetRound = () => setBuilt([]);
  const next = () => { const i = index + 1; setIndex(i); loadRound(i); };
  const replay = () => speak(round.words.join(' '), lang);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-5">
        {ROUNDS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <p className="text-sm font-bold text-slate-400 mb-4 text-center">{round.prompt}</p>

      <div className="w-full max-w-lg min-h-[4.5rem] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl px-5 py-4 mb-6 flex flex-wrap items-center gap-2 justify-center">
        {built.length === 0 ? (
          <span className="text-slate-300 font-bold text-sm">Tap words below to build the sentence</span>
        ) : (
          built.map((origIndex, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1.5 rounded-xl bg-indigo-500 text-white font-black text-sm"
            >
              {round.words[origIndex]}
            </motion.span>
          ))
        )}
        {complete && <FaCheckCircle className="text-emerald-500 text-xl ml-1" />}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
        {shuffled.map((w, i) => {
          const used = built.includes(w.origIndex);
          return (
            <motion.button
              key={i}
              onClick={() => tapWord(i, w.origIndex)}
              disabled={used}
              animate={wrongTap === i ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
              className={`px-4 py-2.5 rounded-2xl border-2 font-black text-sm transition-colors ${used ? 'opacity-0 pointer-events-none' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}
            >
              {w.text}
            </motion.button>
          );
        })}
      </div>

      {!complete && built.length > 0 && (
        <button onClick={resetRound} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-2">
          <FaRedo className="text-[10px]" /> Start over
        </button>
      )}

      {complete && (
        <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors mb-2">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-4 h-14 flex items-center">
        {complete && (
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
