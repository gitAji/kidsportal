"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaRedo } from 'react-icons/fa';
import BlocklyWorkspace from './BlocklyWorkspace';
import { TooManyStepsError } from './engine';

const TOOLBOX = ['lab_move_forward', 'lab_turn_left', 'lab_turn_right', 'lab_repeat', 'lab_set_color', 'lab_stamp'];
const CANVAS_SIZE = 520;
const STEP_PX = 32;
const STEP_MS = 130;
const DIR_VECTORS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W

const COLOR_HEX = {
  red: '#ef4444', blue: '#3b82f6', green: '#22c55e',
  yellow: '#facc15', purple: '#a855f7', orange: '#f97316',
};

function drawShape(ctx, shape, x, y, hex) {
  ctx.fillStyle = hex;
  ctx.strokeStyle = hex;
  if (shape === 'circle') {
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
  } else if (shape === 'square') {
    ctx.fillRect(x - 9, y - 9, 18, 18);
  } else if (shape === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 11 : 5;
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const px = x + r * Math.cos(angle), py = y + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  } else if (shape === 'heart') {
    ctx.beginPath();
    ctx.arc(x - 5, y - 4, 6, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 4, 6, 0, Math.PI * 2);
    ctx.moveTo(x - 10, y - 1);
    ctx.lineTo(x, y + 10);
    ctx.lineTo(x + 10, y - 1);
    ctx.fill();
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const center = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };

export default function FreeBuild() {
  const canvasRef = useRef(null);
  const workspaceRef = useRef(null);
  const runIdRef = useRef(0);
  const [turtle, setTurtle] = useState({ x: center.x, y: center.y, dir: 0 });
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };

  useEffect(() => { clearCanvas(); }, []);

  const handleRun = async () => {
    if (running || !workspaceRef.current) return;
    let commands;
    try {
      commands = workspaceRef.current.run();
    } catch (err) {
      setMessage(err instanceof TooManyStepsError ? err.message : 'Something went wrong with those blocks.');
      return;
    }
    if (!commands || commands.length === 0) {
      setMessage('Snap some blocks inside Start first!');
      return;
    }

    setMessage('');
    const myRunId = ++runIdRef.current;
    setRunning(true);
    clearCanvas();
    let cur = { x: center.x, y: center.y, dir: 0 };
    let color = 'blue';
    setTurtle(cur);
    await sleep(150);

    const ctx = canvasRef.current?.getContext('2d');
    for (const cmd of commands) {
      if (runIdRef.current !== myRunId) return;
      if (cmd.type === 'turnLeft') cur = { ...cur, dir: (cur.dir + 3) % 4 };
      else if (cmd.type === 'turnRight') cur = { ...cur, dir: (cur.dir + 1) % 4 };
      else if (cmd.type === 'color') color = cmd.color;
      else if (cmd.type === 'stamp') {
        drawShape(ctx, cmd.shape, cur.x, cur.y, COLOR_HEX[color]);
      } else if (cmd.type === 'move') {
        const [dx, dy] = DIR_VECTORS[cur.dir];
        const nx = Math.min(CANVAS_SIZE - 4, Math.max(4, cur.x + dx * STEP_PX));
        const ny = Math.min(CANVAS_SIZE - 4, Math.max(4, cur.y + dy * STEP_PX));
        ctx.strokeStyle = COLOR_HEX[color];
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cur.x, cur.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        cur = { ...cur, x: nx, y: ny };
      }
      setTurtle(cur);
      await sleep(STEP_MS);
    }
    if (runIdRef.current === myRunId) setRunning(false);
  };

  const handleClear = () => {
    runIdRef.current++;
    workspaceRef.current?.reset();
    clearCanvas();
    setTurtle({ x: center.x, y: center.y, dir: 0 });
    setRunning(false);
    setMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0 flex flex-col items-center">
        <p className="text-sm font-bold text-slate-400 mb-3 text-center max-w-md">
          No goal here — just build! Move, turn, and stamp shapes to draw whatever you like.
        </p>
        {/* The canvas draws at fixed pixel coordinates, so on phones it
            scrolls horizontally within its own box rather than shrinking
            (which would desync the pencil overlay from the drawing). */}
        <div className="max-w-full overflow-x-auto">
          <div
            className="relative rounded-2xl overflow-hidden shadow-inner border-2 border-slate-200 mx-auto"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          >
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="absolute inset-0" />
            <motion.div
              className="absolute flex items-center justify-center text-2xl pointer-events-none"
              style={{ width: 28, height: 28, marginLeft: -14, marginTop: -14 }}
              animate={{ x: turtle.x, y: turtle.y, rotate: turtle.dir * 90 }}
              transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
            >
              ✏️
            </motion.div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={handleRun}
            disabled={running}
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
        </div>
        {message && <p className="mt-3 text-lg font-black text-rose-500">{message}</p>}
      </div>

      <div className="flex-1 min-w-0">
        <BlocklyWorkspace ref={workspaceRef} blocks={TOOLBOX} height={480} />
      </div>
    </div>
  );
}
