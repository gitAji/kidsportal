// src/app/components/ui/FeedbackAnimations.js
import React from 'react';
import { motion } from 'framer-motion';

export const CorrectAnswerAnimation = ({ onComplete }) => (
  <motion.div
    initial={{ scale: 0, rotate: 0 }}
    animate={{ scale: 1, rotate: 360 }}
    transition={{ duration: 0.5 }}
    onAnimationComplete={onComplete}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div className="text-6xl">✅</div>
  </motion.div>
);

export const IncorrectAnswerAnimation = ({ onComplete }) => (
  <motion.div
    initial={{ x: 0 }}
    animate={{ x: [-10, 10, -10, 10, 0] }}
    transition={{ duration: 0.5 }}
    onAnimationComplete={onComplete}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div className="text-6xl">❌</div>
  </motion.div>
);

export const LevelCompleteAnimation = ({ onComplete }) => (
  <motion.div
    initial={{ opacity: 0, y: -100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    onAnimationComplete={onComplete}
    className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div className="text-6xl mb-4">🎉</div>
    <h2 className="text-4xl font-bold text-white">Level Complete!</h2>
  </motion.div>
);