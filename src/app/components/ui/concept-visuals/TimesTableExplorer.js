"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// A times table a kid taps through fact by fact, in order, each one
// narrated ("3 times 4 is 12") and added to a growing grid — the same
// tap-and-reveal, build-up treatment as the other concept visuals,
// applied to multiplication facts instead of a flip-card listing the
// whole table as a wall of numbers to memorise.
export default function TimesTableExplorer({ tables, onComplete }) {
  const TABLES = useMemo(() => (tables && tables.length > 0 ? tables : [{ factor: 3, upTo: 12 }]), [tables]);
  const [index, setIndex] = useState(0);
  const [tagged, setTagged] = useState(new Set());
  const table = TABLES[index];
  const facts = useMemo(() => Array.from({ length: table.upTo }, (_, i) => i + 1), [table]);
  const done = tagged.size === facts.length;
  const isLast = index === TABLES.length - 1;

  const tapFact = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    const n = facts[idx];
    const product = table.factor * n;
    if (next.size === facts.length) {
      speak(`That's the whole ${table.factor} times table, up to ${table.factor} times ${table.upTo}.`);
    } else {
      speak(`${table.factor} times ${n} is ${product}.`);
    }
  }, [tagged, facts, table]);

  const next = () => { setIndex((i) => i + 1); setTagged(new Set()); };
  const replay = () => speak(`That's the whole ${table.factor} times table, up to ${table.factor} times ${table.upTo}.`);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        {TABLES.map((_, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-xl font-black text-slate-700">The {table.factor} Times Table</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each fact in order — {tagged.size}/{facts.length}</p>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm">
          {facts.map((n, idx) => {
            const isTagged = tagged.has(idx);
            const canTap = idx === 0 || tagged.has(idx - 1);
            return (
              <button
                key={n}
                type="button"
                onClick={() => tapFact(idx)}
                disabled={isTagged || !canTap}
                className="flex flex-col items-center justify-center rounded-xl py-2.5 sm:py-3 font-black shadow-sm border-2 transition-all active:scale-95"
                style={{
                  background: isTagged ? '#d1fae5' : canTap ? '#fff' : '#f8fafc',
                  borderColor: isTagged ? '#10b981' : canTap ? '#e2e8f0' : '#f1f5f9',
                  color: isTagged ? '#047857' : canTap ? '#1e293b' : '#cbd5e1',
                  cursor: isTagged || !canTap ? 'default' : 'pointer',
                }}
              >
                <span className="text-[10px] sm:text-xs opacity-70">{table.factor} &times; {n}</span>
                <span className="text-base sm:text-lg">{isTagged ? table.factor * n : '?'}</span>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 h-14 flex items-center">
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={isLast ? onComplete : next}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> {isLast ? 'Done!' : 'Next Table'} <FaArrowRight className="text-xs" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
