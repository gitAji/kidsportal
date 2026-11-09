"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaVolumeUp } from 'react-icons/fa';

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang || 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// A tap-to-sort word-category activity — the text-based sibling of
// SortingBins (which assumes an emoji per item, which doesn't work for
// abstract grammar words like "quickly" or "happy"). Tap a word, then
// tap the category it belongs in: nouns vs. verbs, synonyms vs.
// antonyms, prefixes vs. suffixes — whatever two or three labeled bins
// the lesson needs. The actual skill a "classify these words" lesson
// is after, done by sorting real words instead of reading a paragraph
// that names the categories.
export default function WordSorter({ rounds, lang, onComplete }) {
  const ROUNDS = useMemo(() => (rounds && rounds.length > 0 ? rounds : [
    { prompt: 'Sort each word into its group', bins: [
      { label: 'Noun' }, { label: 'Verb' },
    ], items: [
      { text: 'dog', binIndex: 0 },
      { text: 'run', binIndex: 1 },
    ] },
  ]), [rounds]);

  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState({});
  const [picked, setPicked] = useState(null);
  const [wrongBin, setWrongBin] = useState(null);
  const round = ROUNDS[index];
  const isLast = index === ROUNDS.length - 1;
  const complete = Object.keys(placed).length === round.items.length;

  const tapItem = useCallback((i) => {
    if (placed[i] !== undefined) return;
    setPicked(i);
    speak(round.items[i].text, lang);
  }, [placed, round, lang]);

  const tapBin = useCallback((binIdx) => {
    if (picked === null) return;
    const item = round.items[picked];
    if (item.binIndex === binIdx) {
      const pickedIdx = picked;
      setPlaced((p) => ({ ...p, [pickedIdx]: binIdx }));
      speak(`Yes! ${item.text} is a ${round.bins[binIdx].label}.`, lang);
      setPicked(null);
    } else {
      setWrongBin(binIdx);
      speak('Not quite — try a different group!', lang);
      setTimeout(() => setWrongBin(null), 600);
    }
  }, [picked, round, lang]);

  const next = () => { setIndex((i) => i + 1); setPlaced({}); setPicked(null); };
  const replay = () => speak(round.items.map((it) => `${it.text} is a ${round.bins[it.binIndex].label}`).join('. '), lang);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {ROUNDS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <p className="text-sm font-bold text-slate-400 mb-4 text-center">{round.prompt}</p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 min-h-[3.5rem]">
        {round.items.map((item, i) => placed[i] === undefined && (
          <motion.button
            key={i}
            onClick={() => tapItem(i)}
            animate={{ scale: picked === i ? 1.15 : 1 }}
            className={`px-4 py-2.5 rounded-2xl border-2 font-black text-sm transition-colors ${picked === i ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}
          >
            {item.text}
          </motion.button>
        ))}
        {complete && (
          <p className="text-sm font-bold text-emerald-600">All sorted!</p>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        {round.bins.map((bin, bi) => (
          <motion.button
            key={bi}
            onClick={() => tapBin(bi)}
            animate={wrongBin === bi ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
            className="flex flex-col items-center gap-2 w-32 sm:w-36 p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-indigo-300 transition-colors"
          >
            <span className="text-xs font-black text-slate-600 uppercase tracking-wide text-center">{bin.label}</span>
            <div className="flex flex-wrap gap-1.5 justify-center min-h-[1.75rem]">
              {round.items.map((item, i) => placed[i] === bi && (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-white text-xs font-bold text-slate-600 border border-slate-200">{item.text}</span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {complete && (
        <button onClick={replay} aria-label="Listen" className="mt-4 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
          <FaVolumeUp className="text-sm" />
        </button>
      )}

      <div className="mt-6 h-14 flex items-center">
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
