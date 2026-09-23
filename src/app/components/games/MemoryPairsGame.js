"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import GameCompleteScreen from './GameCompleteScreen';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs) {
  const cards = pairs.flatMap(p => ([
    { key: `${p.id}-front`, pairId: p.id, label: p.front },
    { key: `${p.id}-match`, pairId: p.id, label: p.match },
  ]));
  return shuffle(cards);
}

export default function MemoryPairsGame({ game, onFinish }) {
  const { instruction, pairs } = game.data;
  const [deck, setDeck] = useState(() => buildDeck(pairs));
  const [flipped, setFlipped] = useState([]); // indices currently face-up (unmatched)
  const [matched, setMatched] = useState([]); // pairIds already matched
  const [wrongPair, setWrongPair] = useState([]); // indices briefly shown as a wrong guess
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const totalPairs = pairs.length;

  const starsFor = (moveCount) => {
    // Fewer moves than 1.5x the pair count is a great result for a young player.
    if (moveCount <= totalPairs * 1.3) return 3;
    if (moveCount <= totalPairs * 2) return 2;
    return 1;
  };

  const handleFlip = (index) => {
    if (busy || flipped.includes(index) || matched.includes(deck[index].pairId)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setBusy(true);
      setMoves(m => m + 1);
      const [a, b] = next;
      if (deck[a].pairId === deck[b].pairId) {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
        setTimeout(() => {
          const newMatched = [...matched, deck[a].pairId];
          setMatched(newMatched);
          setFlipped([]);
          setBusy(false);
          if (newMatched.length === totalPairs) setDone(true);
        }, 500);
      } else {
        setWrongPair(next);
        setTimeout(() => {
          setFlipped([]);
          setWrongPair([]);
          setBusy(false);
        }, 900);
      }
    }
  };

  const reset = () => {
    setDeck(buildDeck(pairs));
    setFlipped([]); setMatched([]); setWrongPair([]); setMoves(0); setBusy(false); setDone(false);
  };

  if (done) {
    const stars = starsFor(moves);
    return (
      <GameCompleteScreen
        title={game.title}
        stars={stars}
        message={`You found all ${totalPairs} pairs in ${moves} moves!`}
        onPlayAgain={reset}
        onBackToGames={() => onFinish(stars)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-20">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
          {game.title} — {matched.length} / {totalPairs} pairs
        </p>
        <p className="text-center text-slate-500 font-bold mb-8">{instruction}</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
          {deck.map((card, index) => {
            const isMatched = matched.includes(card.pairId);
            const isFaceUp = isMatched || flipped.includes(index);
            const isWrong = wrongPair.includes(index);
            return (
              <motion.button
                key={card.key}
                onClick={() => handleFlip(index)}
                disabled={isMatched}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl flex items-center justify-center font-black text-sm sm:text-lg p-2 text-center transition-all shadow-md ${isMatched
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : isWrong
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : isFaceUp
                        ? 'bg-white text-slate-800 border-2 border-blue-300'
                        : 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'
                  }`}
              >
                {isFaceUp ? card.label : '?'}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
