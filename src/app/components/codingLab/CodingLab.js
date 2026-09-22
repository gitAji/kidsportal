"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRoute, FaShapes, FaPaintBrush } from 'react-icons/fa';

// Blockly touches the DOM at import time, so every game that embeds it must
// be excluded from server rendering entirely, not just lazy-loaded.
const MazeRunner = dynamic(() => import('./MazeRunner'), { ssr: false });
const PatternMatch = dynamic(() => import('./PatternMatch'), { ssr: false });
const FreeBuild = dynamic(() => import('./FreeBuild'), { ssr: false });

const TABS = [
  { id: 'maze', label: 'Maze Runner', icon: FaRoute, component: MazeRunner },
  { id: 'pattern', label: 'Pattern Match', icon: FaShapes, component: PatternMatch },
  { id: 'free', label: 'Free Build', icon: FaPaintBrush, component: FreeBuild },
];

export default function CodingLab() {
  const [activeTab, setActiveTab] = useState('maze');
  const Active = TABS.find(t => t.id === activeTab)?.component || MazeRunner;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex gap-2 mb-8 justify-center flex-wrap">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wide transition-all border-2 ${activeTab === tab.id
                ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200/50'
                : 'bg-white text-slate-400 border-slate-100 hover:border-violet-200 hover:text-violet-500'
                }`}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          <Active />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
