"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaRedo, FaArrowRight, FaLightbulb } from 'react-icons/fa';

// Shared "tap tiles to build the right answer" engine — used by the Math
// Equation Builder and the English/Tamil Sentence Builders. Each level
// supplies its own tile bank and a check(selectedTiles) function, so this
// component never needs to know whether it's building a sum or a sentence.
//
// levels: [{ id, name, prompt, bank: string[], hint, check(tiles) => boolean }]
export default function TileBuilder({ levels, accent = 'blue', promptLabel = 'Build this', tileDir = 'ltr' }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = levels[levelIndex];
  // Each bank tile is tracked by its own slot index so duplicate tile text
  // (e.g. two "3" tiles, or "the" appearing twice) can each be tapped once.
  const [usedSlots, setUsedSlots] = useState([]); // indices into level.bank, in tap order
  const [status, setStatus] = useState('idle'); // idle | success | fail
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  const selectedTiles = usedSlots.map((slot) => level.bank[slot]);

  const accentClasses = {
    blue: { active: 'bg-blue-600 border-blue-600 shadow-blue-200/50', text: 'text-blue-600', ring: 'border-blue-200', grad: 'from-blue-600 to-cyan-500', chip: 'bg-blue-50 text-blue-700' },
    amber: { active: 'bg-amber-500 border-amber-500 shadow-amber-200/50', text: 'text-amber-600', ring: 'border-amber-200', grad: 'from-amber-500 to-orange-600', chip: 'bg-amber-50 text-amber-700' },
    emerald: { active: 'bg-emerald-600 border-emerald-600 shadow-emerald-200/50', text: 'text-emerald-600', ring: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', chip: 'bg-emerald-50 text-emerald-700' },
    fuchsia: { active: 'bg-fuchsia-600 border-fuchsia-600 shadow-fuchsia-200/50', text: 'text-fuchsia-600', ring: 'border-fuchsia-200', grad: 'from-fuchsia-500 to-pink-600', chip: 'bg-fuchsia-50 text-fuchsia-700' },
  }[accent];

  const goToLevel = (index) => {
    setLevelIndex(index);
    setUsedSlots([]);
    setStatus('idle');
    setMessage('');
    setShowHint(false);
  };

  const tapTile = (slot) => {
    if (status === 'success' || usedSlots.includes(slot)) return;
    setUsedSlots((prev) => [...prev, slot]);
    setStatus('idle');
    setMessage('');
  };

  const removeTile = (position) => {
    if (status === 'success') return;
    setUsedSlots((prev) => prev.filter((_, i) => i !== position));
    setStatus('idle');
    setMessage('');
  };

  const handleCheck = () => {
    if (selectedTiles.length === 0) {
      setMessage('Tap some tiles first!');
      return;
    }
    const correct = level.check(selectedTiles);
    if (correct) {
      setStatus('success');
      setMessage('Correct! 🎉');
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      });
    } else {
      setStatus('fail');
      setMessage("Not quite — try rearranging the tiles!");
    }
  };

  const handleClear = () => {
    setUsedSlots([]);
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
        {levels.map((lvl, i) => (
          <button
            key={lvl.id}
            onClick={() => goToLevel(i)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all border-2 ${i === levelIndex
              ? `text-white shadow-md ${accentClasses.active}`
              : `bg-white text-slate-400 border-slate-100 hover:${accentClasses.ring}`
              }`}
          >
            {i + 1}. {lvl.name}
          </button>
        ))}
      </div>

      <div className="w-full bg-slate-50 rounded-[2rem] p-6 shadow-inner">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 text-center">{promptLabel}</p>
        <p className={`text-center font-black text-xl mb-6 ${accentClasses.text}`} dir={tileDir}>{level.prompt}</p>

        {/* Answer slot */}
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Your Answer</p>
        <div dir={tileDir} className="flex items-center justify-center gap-2 flex-wrap min-h-[64px] bg-white rounded-2xl p-4 shadow-sm mb-6">
          <AnimatePresence>
            {usedSlots.length === 0 && <span className="text-slate-300 font-bold text-sm">Tap tiles below to start building!</span>}
            {usedSlots.map((slot, position) => (
              <motion.button
                key={`${slot}-${position}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                onClick={() => removeTile(position)}
                className={`px-4 py-2.5 rounded-xl font-black text-lg ${accentClasses.chip} hover:opacity-70 transition-opacity`}
              >
                {level.bank[slot]}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Tile bank */}
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Tiles</p>
        <div dir={tileDir} className="flex items-center justify-center gap-2 flex-wrap">
          {level.bank.map((tile, slot) => {
            const used = usedSlots.includes(slot);
            return (
              <button
                key={slot}
                onClick={() => tapTile(slot)}
                disabled={used || status === 'success'}
                className={`px-4 py-2.5 rounded-xl font-black text-lg border-2 transition-all ${used
                  ? 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:-translate-y-0.5 shadow-sm'
                  }`}
              >
                {tile}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={handleCheck}
          disabled={status === 'success'}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-black shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <FaCheck /> Check
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-500 font-black hover:border-slate-300 transition-all"
        >
          <FaRedo /> Clear
        </button>
        <button
          onClick={() => setShowHint((s) => !s)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-700 font-black hover:bg-amber-200 transition-all"
        >
          <FaLightbulb /> Hint
        </button>
        {status === 'success' && levelIndex < levels.length - 1 && (
          <button
            onClick={() => goToLevel(levelIndex + 1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${accentClasses.grad} text-white font-black shadow-lg hover:scale-105 transition-all`}
          >
            Next Level <FaArrowRight />
          </button>
        )}
      </div>

      {showHint && (
        <p className="mt-4 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">{level.hint}</p>
      )}
      {message && (
        <p className={`mt-4 text-lg font-black ${status === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{message}</p>
      )}
    </div>
  );
}
