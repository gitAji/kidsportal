"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaCheckCircle, FaTimesCircle, FaUndo } from 'react-icons/fa';
import GameCompleteScreen from './GameCompleteScreen';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Tests recognizing the correct logical order of a task: steps are shown
// shuffled, the kid taps them into the order they belong in (tapping a
// placed step sends it back to the pool), then checks the result. Tracked
// by each step's original index rather than its text, so two steps that
// happen to share wording never get confused with each other.
export default function SequenceOrderGame({ game, onFinish }) {
  const { instruction, rounds } = game.data;
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [chosen, setChosen] = useState([]);

  const round = rounds[roundIndex];
  const pool = useMemo(
    () => shuffle(round.steps.map((text, correctIndex) => ({ id: correctIndex, text }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roundIndex]
  );
  const remaining = pool.filter((item) => !chosen.includes(item.id));

  const starsFor = (correct, total) => {
    const pct = correct / total;
    if (pct === 1) return 3;
    if (pct >= 0.6) return 2;
    if (pct > 0) return 1;
    return 0;
  };

  const handleTapStep = (id) => {
    if (feedback) return;
    setChosen((prev) => [...prev, id]);
  };

  const handleUndo = (index) => {
    if (feedback) return;
    setChosen((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const isCorrect = chosen.every((id, i) => id === i);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
    setTimeout(() => {
      setFeedback(null);
      setChosen([]);
      if (roundIndex < rounds.length - 1) {
        setRoundIndex((i) => i + 1);
      } else {
        setDone(true);
      }
    }, 1400);
  };

  if (done) {
    const stars = starsFor(correctCount, rounds.length);
    return (
      <GameCompleteScreen
        title={game.title}
        stars={stars}
        message={`You got ${correctCount} out of ${rounds.length} right!`}
        onPlayAgain={() => {
          setRoundIndex(0); setCorrectCount(0); setChosen([]); setFeedback(null); setDone(false);
        }}
        onBackToGames={() => onFinish(stars)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-20">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm font-black text-slate-400 uppercase mb-2">
          {game.title} — {roundIndex + 1} / {rounds.length}
        </p>
        <p className="text-center text-slate-500 font-bold mb-6">{instruction}</p>

        <div className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-8 text-center mb-6">
          <p className="font-black text-slate-800 text-xl sm:text-2xl">{round.prompt}</p>
        </div>

        <div className="mb-6">
          <p className="text-xs font-black text-slate-400 uppercase mb-2 ml-1">Your Order</p>
          <div className="flex flex-col gap-2 min-h-[56px]">
            {chosen.length === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center text-slate-300 font-bold text-sm">
                Tap the steps below, in order
              </div>
            )}
            <AnimatePresence initial={false}>
              {chosen.map((id, i) => {
                const item = pool.find((p) => p.id === id);
                let style = 'bg-blue-50 border-2 border-blue-200 text-blue-800';
                if (feedback) {
                  const isRight = id === i;
                  style = isRight
                    ? 'bg-green-100 border-2 border-green-400 text-green-800'
                    : 'bg-red-100 border-2 border-red-400 text-red-800';
                }
                return (
                  <motion.button
                    key={id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => handleUndo(i)}
                    disabled={!!feedback}
                    className={`flex items-center gap-3 p-3 sm:p-4 rounded-2xl font-bold text-left transition-all ${style}`}
                  >
                    <span className="w-7 h-7 flex-shrink-0 rounded-full bg-white/70 flex items-center justify-center text-sm font-black">
                      {i + 1}
                    </span>
                    <span className="flex-1">{item?.text}</span>
                    {feedback ? (
                      id === i ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />
                    ) : (
                      <FaUndo className="text-blue-300 text-xs" />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {remaining.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            <AnimatePresence initial={false}>
              {remaining.map((item) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => handleTapStep(item.id)}
                  whileTap={{ scale: 0.97 }}
                  className="p-3 sm:p-4 rounded-2xl font-bold text-left bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  {item.text}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}

        {remaining.length === 0 && !feedback && (
          <button
            onClick={handleCheck}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black py-4 rounded-full text-lg shadow-lg hover:scale-[1.02] transition-all"
          >
            Check Order!
          </button>
        )}
      </div>
    </div>
  );
}
