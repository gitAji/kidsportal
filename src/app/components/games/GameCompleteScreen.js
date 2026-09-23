"use client";

import { motion } from 'framer-motion';
import { FaStar, FaRedo, FaArrowLeft } from 'react-icons/fa';

export default function GameCompleteScreen({ title, stars, message, onPlayAgain, onBackToGames }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-orange-100">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 max-w-md w-full text-center border-4 border-white"
      >
        <h1 className="text-3xl font-black text-slate-800 mb-4">{title}</h1>

        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: 'spring', bounce: 0.6 }}
            >
              <FaStar size={44} className={i < stars ? 'text-yellow-400 drop-shadow' : 'text-slate-200'} />
            </motion.div>
          ))}
        </div>

        <p className="text-slate-500 font-bold mb-8">{message}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black px-6 py-4 rounded-full text-lg hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <FaRedo /> Play Again
          </button>
          <button
            onClick={onBackToGames}
            className="w-full bg-white text-slate-600 font-bold px-6 py-3.5 rounded-full text-base border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Back to Games
          </button>
        </div>
      </motion.div>
    </div>
  );
}
