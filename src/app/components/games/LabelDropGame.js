"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaCheckCircle } from 'react-icons/fa';
import GameCompleteScreen from './GameCompleteScreen';

// Fisher-Yates, same pattern used by the other game engines.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Renders one decorative diagram piece. `shapes` is plain data (svg
// primitive attrs, or an emoji glyph + position) rather than an uploaded
// image, so diagrams live entirely in gamesContent.js like every other
// game's data — no image hosting/upload pipeline needed.
function DiagramShape({ shape }) {
  if (shape.kind === 'emoji') {
    return (
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ left: `${shape.x}%`, top: `${shape.y}%`, fontSize: shape.size || 40 }}
      >
        {shape.value}
      </div>
    );
  }
  const { tag, props } = shape;
  const Tag = tag;
  return <Tag {...props} />;
}

export default function LabelDropGame({ game, onFinish }) {
  const { instruction, viewBox = '0 0 100 100', background, shapes = [], zones } = game.data;

  const [placed, setPlaced] = useState({}); // zoneId -> label, once correctly dropped
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeZoneId, setShakeZoneId] = useState(null);
  const [done, setDone] = useState(false);

  const zoneRefs = useRef({});
  const containerRef = useRef(null);

  // Starts in the diagram's own (deterministic) order so the server-rendered
  // HTML and the client's first render match exactly, then shuffles once the
  // component has mounted — shuffling during render itself (e.g. in a
  // useMemo) calls Math.random() on both the server and the client, which
  // produces two different orders and triggers a hydration mismatch.
  const [tray, setTray] = useState(() => zones.map((z) => ({ zoneId: z.id, label: z.label })));
  // Keyed on game.id (not just []) so the tray — and any progress — resets
  // if this same component instance is ever reused for a different game
  // (e.g. a future "next game" navigation that doesn't unmount), instead of
  // silently showing the previous game's labels.
  useEffect(() => {
    setTray(shuffle(zones.map((z) => ({ zoneId: z.id, label: z.label }))));
    setPlaced({});
    setWrongAttempts(0);
    setShakeZoneId(null);
    setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);
  const remaining = tray.filter((t) => !placed[t.zoneId]);

  const starsFor = () => {
    if (wrongAttempts === 0) return 3;
    if (wrongAttempts <= zones.length) return 2;
    return 1;
  };

  const handleDragEnd = useCallback((event, info, chip) => {
    const point = { x: info.point.x, y: info.point.y };
    let hitZoneId = null;

    for (const zone of zones) {
      if (placed[zone.id]) continue;
      const el = zoneRefs.current[zone.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom) {
        hitZoneId = zone.id;
        break;
      }
    }

    if (!hitZoneId) return; // no zone under the drop — framer snaps the chip back

    if (hitZoneId === chip.zoneId) {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
      setPlaced((prev) => {
        const next = { ...prev, [hitZoneId]: chip.label };
        if (Object.keys(next).length === zones.length) {
          setTimeout(() => setDone(true), 500);
        }
        return next;
      });
    } else {
      setWrongAttempts((w) => w + 1);
      setShakeZoneId(hitZoneId);
      setTimeout(() => setShakeZoneId(null), 500);
    }
  }, [zones, placed]);

  const reset = () => {
    setPlaced({});
    setWrongAttempts(0);
    setShakeZoneId(null);
    setDone(false);
  };

  if (done) {
    const stars = starsFor();
    return (
      <GameCompleteScreen
        title={game.title}
        stars={stars}
        message={`You labelled all ${zones.length} parts${wrongAttempts === 0 ? ' with no mistakes!' : '!'}`}
        onPlayAgain={reset}
        onBackToGames={() => onFinish(stars)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pt-20">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
          {game.title} — {Object.keys(placed).length} / {zones.length} labelled
        </p>
        <p className="text-center text-slate-500 font-bold mb-6">{instruction}</p>

        {/* Diagram */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square sm:aspect-[4/3] rounded-[2rem] shadow-xl overflow-hidden mb-6"
          style={{ background: background || 'linear-gradient(180deg, #dbeafe 0%, #bbf7d0 60%, #d6b58a 100%)' }}
        >
          <svg viewBox={viewBox} className="absolute inset-0 w-full h-full">
            {shapes.filter((s) => s.kind === 'svg').map((s, i) => (
              <DiagramShape key={i} shape={s} />
            ))}
          </svg>
          {shapes.filter((s) => s.kind === 'emoji').map((s, i) => (
            <DiagramShape key={i} shape={s} />
          ))}

          {zones.map((zone) => {
            const isPlaced = !!placed[zone.id];
            const isShaking = shakeZoneId === zone.id;
            return (
              <motion.div
                key={zone.id}
                ref={(el) => { zoneRefs.current[zone.id] = el; }}
                animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full font-black text-[10px] sm:text-xs text-center px-1 transition-colors ${isPlaced
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/70 border-2 border-dashed border-slate-400 text-slate-400'
                  }`}
                style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: 76, height: 76 }}
              >
                {isPlaced ? (
                  <span className="flex flex-col items-center gap-0.5">
                    <FaCheckCircle className="text-sm" />
                    {placed[zone.id]}
                  </span>
                ) : '?'}
              </motion.div>
            );
          })}
        </div>

        {/* Draggable label tray */}
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {remaining.map((chip) => (
              <motion.div
                key={chip.zoneId}
                drag
                dragMomentum={false}
                dragElastic={0.15}
                dragSnapToOrigin
                whileDrag={{ scale: 1.1, zIndex: 50 }}
                onDragEnd={(event, info) => handleDragEnd(event, info, chip)}
                style={{ touchAction: 'none' }}
                exit={{ scale: 0, opacity: 0 }}
                className="cursor-grab active:cursor-grabbing bg-white border-2 border-blue-300 text-slate-800 font-bold text-sm px-5 py-3 rounded-2xl shadow-md select-none"
              >
                {chip.label}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
