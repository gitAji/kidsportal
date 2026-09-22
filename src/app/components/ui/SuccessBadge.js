"use client";
import React from 'react';
import { motion } from 'framer-motion';

// A proper "you did it!" moment: the icon pops in with a spring bounce
// while soft rings pulse outward behind it. Used on every lesson/quiz/exam
// completion screen instead of a static icon.
export default function SuccessBadge({ icon, ringColor = 'rgba(250, 204, 21, 0.5)', size = 100 }) {
  return (
    <div
      className="relative flex items-center justify-center mx-auto mb-6"
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, border: `3px solid ${ringColor}` }}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: [0.6, 1.9], opacity: [0.8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -25, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
        className="relative z-10 drop-shadow-lg"
      >
        {icon}
      </motion.div>
    </div>
  );
}
