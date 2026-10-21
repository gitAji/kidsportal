"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaRedo, FaArrowRight, FaLightbulb } from 'react-icons/fa';
import BlocklyWorkspace from './BlocklyWorkspace';
import patternLevels from './patternLevels';
import Stamp from './Stamp';
import { TooManyStepsError } from './engine';

const TOOLBOX = ['lab_set_color', 'lab_stamp', 'lab_repeat'];

function commandsToStamps(commands) {
  const stamps = [];
  let color = 'red';
  for (const cmd of commands) {
    if (cmd.type === 'color') color = cmd.color;
    else if (cmd.type === 'stamp') stamps.push({ shape: cmd.shape, color });
  }
  return stamps;
}

function sameStamp(a, b) {
  return a && b && a.shape === b.shape && a.color === b.color;
}

export default function PatternMatch() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = patternLevels[levelIndex];
  const [built, setBuilt] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | success | fail
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const workspaceRef = useRef(null);

  const goToLevel = (index) => {
    setLevelIndex(index);
    setBuilt([]);
    setStatus('idle');
    setMessage('');
    setShowHint(false);
  };

  const handleRun = () => {
    let commands;
    try {
      commands = workspaceRef.current?.run();
    } catch (err) {
      setStatus('fail');
      setMessage(err instanceof TooManyStepsError ? err.message : 'Something went wrong with those blocks.');
      return;
    }
    const stamps = commandsToStamps(commands || []);
    setBuilt(stamps);

    if (stamps.length === 0) {
      setMessage('Set a color and stamp a shape to get started!');
      setStatus('idle');
      return;
    }

    const matches = stamps.length === level.target.length &&
      stamps.every((s, i) => sameStamp(s, level.target[i]));

    if (matches) {
      setStatus('success');
      setMessage('Perfect match! 🎉');
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      });
    } else {
      setStatus('fail');
      const firstDiff = stamps.findIndex((s, i) => !sameStamp(s, level.target[i]));
      if (stamps.length !== level.target.length) {
        setMessage(`Target has ${level.target.length} shapes — you made ${stamps.length}.`);
      } else {
        setMessage(`Shape #${firstDiff + 1} doesn't match yet. Keep trying!`);
      }
    }
  };

  const handleClear = () => {
    workspaceRef.current?.reset();
    setBuilt([]);
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
          {patternLevels.map((lvl, i) => (
            <button
              key={lvl.id}
              onClick={() => goToLevel(i)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all ${i === levelIndex
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-400 border-2 border-slate-100 hover:border-violet-200'
                }`}
            >
              {i + 1}. {lvl.name}
            </button>
          ))}
        </div>

        <div className="w-full max-w-xl bg-slate-50 rounded-2xl p-6 shadow-inner">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Match this pattern</p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6 bg-white rounded-xl p-4 shadow-sm">
            {level.target.map((s, i) => <Stamp key={i} shape={s.shape} color={s.color} />)}
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Your pattern</p>
          <div className="flex items-center justify-center gap-3 flex-wrap min-h-[64px] bg-white rounded-xl p-4 shadow-sm">
            <AnimatePresence>
              {built.length === 0 && <span className="text-slate-300 font-bold text-sm">Nothing yet — press Run!</span>}
              {built.map((s, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                  <Stamp shape={s.shape} color={s.color} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-black shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all"
          >
            <FaPlay /> Run
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-500 font-black hover:border-slate-300 transition-all"
          >
            <FaRedo /> Clear
          </button>
          <button
            onClick={() => setShowHint(s => !s)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-700 font-black hover:bg-amber-200 transition-all"
          >
            <FaLightbulb /> Hint
          </button>
          {status === 'success' && levelIndex < patternLevels.length - 1 && (
            <button
              onClick={() => goToLevel(levelIndex + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg hover:scale-105 transition-all"
            >
              Next Pattern <FaArrowRight />
            </button>
          )}
        </div>

        {showHint && (
          <p className="mt-3 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">{level.hint}</p>
        )}
        {message && (
          <p className={`mt-3 text-lg font-black ${status === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{message}</p>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <BlocklyWorkspace ref={workspaceRef} blocks={TOOLBOX} height={480} />
      </div>
    </div>
  );
}
