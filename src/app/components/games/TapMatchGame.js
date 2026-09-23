"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import GameCompleteScreen from './GameCompleteScreen';

export default function TapMatchGame({ game, onFinish }) {
  const { instruction, rounds } = game.data;
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const round = rounds[roundIndex];

  const starsFor = (correct, total) => {
    const pct = correct / total;
    if (pct === 1) return 3;
    if (pct >= 0.6) return 2;
    if (pct > 0) return 1;
    return 0;
  };

  const handlePick = (index) => {
    if (feedback) return;
    setSelected(index);
    const isCorrect = index === round.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setCorrectCount(c => c + 1);
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
    }
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (roundIndex < rounds.length - 1) {
        setRoundIndex(i => i + 1);
      } else {
        setDone(true);
      }
    }, 1100);
  };

  if (done) {
    const stars = starsFor(correctCount, rounds.length);
    return (
      <GameCompleteScreen
        title={game.title}
        stars={stars}
        message={`You got ${correctCount} out of ${rounds.length} right!`}
        onPlayAgain={() => {
          setRoundIndex(0); setCorrectCount(0); setSelected(null); setFeedback(null); setDone(false);
        }}
        onBackToGames={() => onFinish(stars)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-20">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
          {game.title} — {roundIndex + 1} / {rounds.length}
        </p>
        <p className="text-center text-slate-500 font-bold mb-8">{instruction}</p>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-10 text-center mb-6">
          <p className="text-5xl sm:text-6xl font-black text-slate-800">{round.prompt}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {round.options.map((opt, i) => {
            let style = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50';
            if (feedback && i === selected) {
              style = feedback === 'correct'
                ? 'bg-green-100 border-2 border-green-500 text-green-800'
                : 'bg-red-100 border-2 border-red-500 text-red-800';
            } else if (feedback && i === round.correctIndex) {
              style = 'bg-green-50 border-2 border-green-300 text-green-700';
            }
            return (
              <motion.button
                key={i}
                onClick={() => handlePick(i)}
                disabled={!!feedback}
                whileTap={{ scale: 0.97 }}
                className={`p-5 rounded-2xl font-bold text-lg flex items-center justify-between transition-all ${style}`}
              >
                <span>{opt}</span>
                {feedback && i === selected && (
                  feedback === 'correct' ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
