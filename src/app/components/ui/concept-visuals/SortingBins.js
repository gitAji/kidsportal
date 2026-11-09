"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
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

// A tap-to-sort grouping activity: tap an item, then tap the bin it
// belongs in. Right answer, it slots into the bin and is spoken aloud;
// wrong bin, a shake and a nudge to try again — the actual skill a
// "grouping"/"classifying" lesson is after, done by sorting real items
// instead of reading a paragraph that names the groups.
export default function SortingBins({ rounds, onComplete }) {
  const ROUNDS = useMemo(() => (rounds && rounds.length > 0 ? rounds : [
    { prompt: 'Sort each item into its group', bins: [
      { label: 'Wood', emoji: '🪵' }, { label: 'Plastic', emoji: '🧴' },
    ], items: [
      { label: 'Table', emoji: '🪑', binIndex: 0 },
      { label: 'Bottle', emoji: '🍼', binIndex: 1 },
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
    speak(round.items[i].label);
  }, [placed, round]);

  const tapBin = useCallback((binIdx) => {
    if (picked === null) return;
    const item = round.items[picked];
    if (item.binIndex === binIdx) {
      const pickedIdx = picked;
      setPlaced((p) => ({ ...p, [pickedIdx]: binIdx }));
      speak(`Yes! ${item.label} goes with ${round.bins[binIdx].label}.`);
      setPicked(null);
    } else {
      setWrongBin(binIdx);
      speak('Not quite — try a different group!');
      setTimeout(() => setWrongBin(null), 600);
    }
  }, [picked, round]);

  const next = () => { setIndex((i) => i + 1); setPlaced({}); setPicked(null); };
  const replay = () => speak(round.items.map((it) => `${it.label} goes with ${round.bins[it.binIndex].label}`).join('. '));

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {ROUNDS.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <p className="text-sm font-bold text-slate-400 mb-4 text-center">{round.prompt}</p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 min-h-[4rem]">
        {round.items.map((item, i) => placed[i] === undefined && (
          <motion.button
            key={i}
            onClick={() => tapItem(i)}
            animate={{ scale: picked === i ? 1.15 : 1 }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 transition-colors ${picked === i ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-[10px] font-black text-slate-500">{item.label}</span>
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
            className="flex flex-col items-center gap-2 w-28 sm:w-32 p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-indigo-300 transition-colors"
          >
            <span className="text-2xl">{bin.emoji}</span>
            <span className="text-xs font-black text-slate-600 text-center">{bin.label}</span>
            <div className="flex flex-wrap gap-1 justify-center min-h-[1.5rem]">
              {round.items.map((item, i) => placed[i] === bi && (
                <span key={i} className="text-lg">{item.emoji}</span>
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
