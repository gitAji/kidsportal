"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import GameCompleteScreen from './GameCompleteScreen';

// Shows a repeating/growing sequence as a row of tiles with one blank tile
// at the end, then lets the kid tap an option to fill it in — tests
// recognizing a pattern's rule and predicting what comes next.
export default function PatternContinueGame({ game, onFinish }) {
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
      setCorrectCount((c) => c + 1);
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
    }
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (roundIndex < rounds.length - 1) {
        setRoundIndex((i) => i + 1);
      } else {
        setDone(true);
      }
    }, 1300);
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

  const filledBlank = feedback ? round.options[selected] : null;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-20">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm font-black text-slate-400 uppercase mb-2">
          {game.title} — {roundIndex + 1} / {rounds.length}
        </p>
        <p className="text-center text-slate-500 font-bold mb-8">{instruction}</p>

        <div className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {round.sequence.map((item, i) => (
              <div
                key={i}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-700"
              >
                {item}
              </div>
            ))}
            <AnimatePresence mode="wait">
              <motion.div
                key={feedback ? 'filled' : 'blank'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-colors ${
                  feedback === 'correct'
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : feedback === 'wrong'
                      ? 'bg-red-100 border-2 border-red-500 text-red-700'
                      : 'bg-blue-50 border-2 border-dashed border-blue-300 text-blue-300'
                }`}
              >
                {filledBlank ?? '?'}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center transition-all relative ${style}`}
              >
                {opt}
                {feedback && i === selected && (
                  <span className="absolute -top-2 -right-2 text-lg">
                    {feedback === 'correct' ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
