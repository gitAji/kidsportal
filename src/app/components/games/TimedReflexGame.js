"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import GameCompleteScreen from './GameCompleteScreen';

export default function TimedReflexGame({ game, onFinish }) {
  const { instruction, timeLimit, items } = game.data;
  const totalTargets = items.filter(i => i.isTarget).length;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [found, setFound] = useState([]);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, running]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setRunning(false);
    setDone(true);
  };

  const handleTap = (index) => {
    if (!running || found.includes(index)) return;
    const item = items[index];
    if (item.isTarget) {
      const next = [...found, index];
      setFound(next);
      confetti({ particleCount: 12, spread: 40, origin: { y: 0.6 } });
      if (next.length === totalTargets) finish();
    } else {
      setWrongTaps(w => w + 1);
      setWrongFlash(index);
      setTimeout(() => setWrongFlash(null), 400);
    }
  };

  const starsFor = () => {
    const pct = found.length / totalTargets;
    if (pct === 1 && wrongTaps === 0) return 3;
    if (pct === 1 || pct >= 0.7) return 2;
    if (found.length > 0) return 1;
    return 0;
  };

  const reset = () => {
    doneRef.current = false;
    setTimeLeft(timeLimit); setFound([]); setWrongTaps(0); setWrongFlash(null); setRunning(true); setDone(false);
  };

  if (done) {
    const stars = starsFor();
    return (
      <GameCompleteScreen
        title={game.title}
        stars={stars}
        message={`You found ${found.length} of ${totalTargets}, with ${wrongTaps} wrong taps.`}
        onPlayAgain={reset}
        onBackToGames={() => onFinish(stars)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-20">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{game.title}</p>
          <div className={`px-4 py-1.5 rounded-full font-black text-sm ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-600 shadow-md'}`}>
            ⏳ {timeLeft}s
          </div>
        </div>
        <p className="text-center text-slate-500 font-bold mb-6">{instruction}</p>
        <p className="text-center text-sm font-bold text-emerald-600 mb-6">Found {found.length} / {totalTargets}</p>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {items.map((item, index) => {
            const isFound = found.includes(index);
            const isWrong = wrongFlash === index;
            return (
              <motion.button
                key={index}
                onClick={() => handleTap(index)}
                disabled={isFound}
                whileTap={{ scale: 0.9 }}
                className={`aspect-square rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-md transition-all ${isFound
                    ? 'bg-green-100 text-green-600 border-2 border-green-300 scale-95 opacity-70'
                    : isWrong
                      ? 'bg-red-200 text-red-700 border-2 border-red-400'
                      : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-blue-300'
                  }`}
              >
                {item.value}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

