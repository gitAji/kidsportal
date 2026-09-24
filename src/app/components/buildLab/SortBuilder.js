"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRedo, FaArrowRight, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

// Shared "tap an item, then tap the zone it belongs in" classifier engine —
// used by the Science Habitat Builder. Each level supplies zones and items;
// this component never needs subject-specific knowledge.
//
// levels: [{ id, name, hint, zones: [{id,label,emoji}], items: [{id,label,emoji,correctZone}] }]
export default function SortBuilder({ levels, accent = 'emerald' }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = levels[levelIndex];
  const [placements, setPlacements] = useState({}); // itemId -> zoneId (only correct placements are kept)
  const [selectedItem, setSelectedItem] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(null); // itemId briefly flashed red
  const [showHint, setShowHint] = useState(false);

  const accentClasses = {
    emerald: { active: 'bg-emerald-600 border-emerald-600 shadow-emerald-200/50', text: 'text-emerald-600', ring: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', chip: 'bg-emerald-50 border-emerald-300' },
  }[accent] || { active: 'bg-emerald-600 border-emerald-600 shadow-emerald-200/50', text: 'text-emerald-600', ring: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', chip: 'bg-emerald-50 border-emerald-300' };

  const isComplete = level.items.every((item) => placements[item.id]);
  const unplacedItems = level.items.filter((item) => !placements[item.id]);

  const goToLevel = (index) => {
    setLevelIndex(index);
    setPlacements({});
    setSelectedItem(null);
    setWrongFlash(null);
    setShowHint(false);
  };

  const selectItem = (itemId) => {
    setSelectedItem((prev) => (prev === itemId ? null : itemId));
  };

  const tapZone = (zoneId) => {
    if (!selectedItem) return;
    const item = level.items.find((i) => i.id === selectedItem);
    if (item.correctZone === zoneId) {
      setPlacements((prev) => {
        const next = { ...prev, [item.id]: zoneId };
        if (level.items.every((i) => next[i.id])) {
          import('canvas-confetti').then(({ default: confetti }) => {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          });
        }
        return next;
      });
      setSelectedItem(null);
    } else {
      setWrongFlash(item.id);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  const handleClear = () => {
    setPlacements({});
    setSelectedItem(null);
    setWrongFlash(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
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
        {/* Zones */}
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">
          {selectedItem ? 'Tap the habitat where it belongs!' : 'Habitats'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {level.zones.map((zone) => {
            const placedHere = level.items.filter((i) => placements[i.id] === zone.id);
            return (
              <button
                key={zone.id}
                onClick={() => tapZone(zone.id)}
                className={`rounded-2xl p-4 border-2 transition-all min-h-[120px] flex flex-col items-center gap-2 ${selectedItem ? `bg-white ${accentClasses.chip} hover:scale-105` : 'bg-white border-slate-100'
                  }`}
              >
                <span className="text-3xl">{zone.emoji}</span>
                <span className="font-black text-sm text-slate-700">{zone.label}</span>
                <div className="flex flex-wrap gap-1 justify-center">
                  {placedHere.map((item) => (
                    <span key={item.id} className="text-xl" title={item.label}>{item.emoji}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Unplaced items bank */}
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Tap a creature, then tap its habitat</p>
        <div className="flex items-center justify-center gap-3 flex-wrap min-h-[64px] bg-white rounded-2xl p-4 shadow-sm">
          <AnimatePresence>
            {unplacedItems.length === 0 && (
              <span className="text-emerald-500 font-black text-sm flex items-center gap-2"><FaCheckCircle /> All sorted!</span>
            )}
            {unplacedItems.map((item) => (
              <motion.button
                key={item.id}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  x: wrongFlash === item.id ? [0, -8, 8, -8, 0] : 0,
                }}
                exit={{ scale: 0 }}
                onClick={() => selectItem(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all ${selectedItem === item.id
                  ? `${accentClasses.chip} scale-110 shadow-md`
                  : wrongFlash === item.id
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-bold text-slate-600">{item.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-500 font-black hover:border-slate-300 transition-all"
        >
          <FaRedo /> Start Over
        </button>
        <button
          onClick={() => setShowHint((s) => !s)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-700 font-black hover:bg-amber-200 transition-all"
        >
          <FaLightbulb /> Hint
        </button>
        {isComplete && levelIndex < levels.length - 1 && (
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
      {isComplete && (
        <p className="mt-4 text-lg font-black text-emerald-600">Great job! Every creature is home. 🎉</p>
      )}
    </div>
  );
}
