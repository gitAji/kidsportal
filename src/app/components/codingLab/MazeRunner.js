"use client";
import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaRedo, FaArrowRight, FaLightbulb } from 'react-icons/fa';
import BlocklyWorkspace from './BlocklyWorkspace';
import mazeLevels from './mazeLevels';
import { TooManyStepsError } from './engine';

const CELL = 56;
const STEP_MS = 420;
const TOOLBOX = ['lab_move_forward', 'lab_turn_left', 'lab_turn_right', 'lab_repeat'];

function isWall(grid, row, col) {
  if (row < 0 || row >= grid.length) return true;
  const line = grid[row];
  if (col < 0 || col >= line.length) return true;
  return line[col] === '#';
}

function findChar(grid, ch) {
  for (let row = 0; row < grid.length; row++) {
    const col = grid[row].indexOf(ch);
    if (col !== -1) return { row, col };
  }
  return { row: 0, col: 0 };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default function MazeRunner() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = mazeLevels[levelIndex];
  const start = useMemo(() => findChar(level.grid, 'S'), [level]);
  const goal = useMemo(() => findChar(level.grid, 'G'), [level]);

  const [pos, setPos] = useState({ row: start.row, col: start.col, dir: level.startDir });
  const [status, setStatus] = useState('idle'); // idle | running | success | fail
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const workspaceRef = useRef(null);
  const runIdRef = useRef(0);

  const resetPosition = () => setPos({ row: start.row, col: start.col, dir: level.startDir });

  const goToLevel = (index) => {
    runIdRef.current++;
    setLevelIndex(index);
    setStatus('idle');
    setMessage('');
    setShowHint(false);
    const lvl = mazeLevels[index];
    const s = findChar(lvl.grid, 'S');
    setPos({ row: s.row, col: s.col, dir: lvl.startDir });
  };

  const handleRun = async () => {
    if (status === 'running' || !workspaceRef.current) return;
    let commands;
    try {
      commands = workspaceRef.current.run();
    } catch (err) {
      setStatus('fail');
      setMessage(err instanceof TooManyStepsError ? err.message : 'Something went wrong with those blocks.');
      return;
    }
    if (!commands || commands.length === 0) {
      setMessage('Snap some blocks inside Start first!');
      return;
    }

    const myRunId = ++runIdRef.current;
    setStatus('running');
    setMessage('');
    resetPosition();
    await sleep(200);

    let cur = { row: start.row, col: start.col, dir: level.startDir };
    for (const cmd of commands) {
      if (runIdRef.current !== myRunId) return; // superseded by a reset/new run
      let next = { ...cur };
      if (cmd.type === 'turnLeft') next.dir = (cur.dir + 3) % 4;
      else if (cmd.type === 'turnRight') next.dir = (cur.dir + 1) % 4;
      else if (cmd.type === 'move') {
        const deltas = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // N, E, S, W
        const [dr, dc] = deltas[cur.dir];
        const nr = cur.row + dr, nc = cur.col + dc;
        if (isWall(level.grid, nr, nc)) {
          setPos(cur);
          setStatus('fail');
          setMessage('Bumped into a wall! Try again.');
          return;
        }
        next.row = nr; next.col = nc;
      }
      cur = next;
      setPos(cur);
      await sleep(STEP_MS);
    }

    if (runIdRef.current !== myRunId) return;
    if (cur.row === goal.row && cur.col === goal.col) {
      setStatus('success');
      setMessage('You made it! 🎉');
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      });
    } else {
      setStatus('fail');
      setMessage("Not quite there yet — keep trying!");
    }
  };

  const handleClear = () => {
    runIdRef.current++;
    workspaceRef.current?.reset();
    resetPosition();
    setStatus('idle');
    setMessage('');
  };

  const gridWidth = Math.max(...level.grid.map(r => r.length));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Game board */}
      <div className="flex-1 min-w-0 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
          {mazeLevels.map((lvl, i) => (
            <button
              key={lvl.id}
              onClick={() => goToLevel(i)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all ${i === levelIndex
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-400 border-2 border-slate-100 hover:border-violet-200'
                }`}
            >
              {i + 1}. {lvl.name}
            </button>
          ))}
        </div>

        {/* Wider mazes (e.g. the 10-cell-wide corridor) don't fit a phone
            screen at a fixed cell size — scroll the board horizontally
            within its own box instead of overflowing the whole page. */}
        <div className="max-w-full overflow-x-auto">
          <div
            className="relative bg-slate-100 rounded-2xl p-3 shadow-inner mx-auto"
            style={{ width: gridWidth * CELL + 24 }}
          >
            <div className="relative" style={{ width: gridWidth * CELL, height: level.grid.length * CELL }}>
              {level.grid.map((line, r) => (
                [...Array(gridWidth)].map((_, c) => {
                  const ch = line[c] || '#';
                  const wall = ch === '#';
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`absolute rounded-md ${wall ? 'bg-slate-300' : 'bg-white border border-slate-200'}`}
                      style={{ left: c * CELL + 2, top: r * CELL + 2, width: CELL - 4, height: CELL - 4 }}
                    >
                      {ch === 'G' && <span className="flex items-center justify-center h-full text-2xl">🏁</span>}
                    </div>
                  );
                })
              ))}
              <motion.div
                className="absolute flex items-center justify-center text-3xl"
                style={{ width: CELL, height: CELL }}
                animate={{ x: pos.col * CELL, y: pos.row * CELL, rotate: pos.dir * 90 }}
                transition={{ duration: STEP_MS / 1000, ease: 'easeInOut' }}
              >
                🤖
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={handleRun}
            disabled={status === 'running'}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-black shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <FaPlay /> Run
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-500 font-black hover:border-slate-300 transition-all"
          >
            <FaRedo /> Clear
          </button>
          <button
            onClick={() => setShowHint(s => !s)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-700 font-black hover:bg-amber-200 transition-all"
          >
            <FaLightbulb /> Hint
          </button>
          {status === 'success' && levelIndex < mazeLevels.length - 1 && (
            <button
              onClick={() => goToLevel(levelIndex + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg hover:scale-105 transition-all"
            >
              Next Level <FaArrowRight />
            </button>
          )}
        </div>

        {showHint && (
          <p className="mt-3 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">{level.hint}</p>
        )}
        {message && (
          <p className={`mt-3 text-lg font-black ${status === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>{message}</p>
        )}
      </div>

      {/* Blockly editor */}
      <div className="flex-1 min-w-0">
        <BlocklyWorkspace ref={workspaceRef} blocks={TOOLBOX} height={480} />
      </div>
    </div>
  );
}
