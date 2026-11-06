"use client";
import React from 'react';

// Real, recognizable-looking UK coins and notes as plain SVG illustrations
// — not photographic/scanned reproductions of actual currency (which would
// be both a legal gray area and inappropriate to fake for a kids' product),
// just the same visual cues a child would use to tell them apart in real
// life: coin color and shape, note color and orientation. Pence coins use
// bronze/silver/gold coloring and the real 7-sided (20p/50p) and 12-sided
// (£1) shapes instead of a plain circle for every denomination; notes are
// rectangles in each denomination's real polymer-note color, not just a
// bigger coin with more zeros.

const COIN_META = {
  1: { label: '1p', sides: 0, fill: 'bronze' },
  2: { label: '2p', sides: 0, fill: 'bronze' },
  5: { label: '5p', sides: 0, fill: 'silver' },
  10: { label: '10p', sides: 0, fill: 'silver' },
  20: { label: '20p', sides: 7, fill: 'silver' },
  50: { label: '50p', sides: 7, fill: 'silver' },
  100: { label: '£1', sides: 12, fill: 'gold' },
  200: { label: '£2', sides: 0, fill: 'bimetal' },
};

const NOTE_META = {
  500: { label: '£5', color: '#1f9d8a' },   // teal, like the real polymer fiver
  1000: { label: '£10', color: '#c6621f' }, // orange-brown
  2000: { label: '£20', color: '#6a3fa0' }, // purple
  5000: { label: '£50', color: '#b4332a' }, // red
};

export function isNoteValue(pence) {
  return pence >= 500;
}

// A regular N-sided polygon path, point-up, inscribed in a circle of
// radius r centered at (cx, cy) — used for the 20p/50p heptagon and the
// £1 dodecagon instead of a plain circle.
function polygonPoints(cx, cy, r, sides) {
  const pts = [];
  const offset = -Math.PI / 2;
  for (let i = 0; i < sides; i++) {
    const angle = offset + (i * 2 * Math.PI) / sides;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

export function Coin({ value, size = 56, className = '' }) {
  const meta = COIN_META[value] || { label: `${value}p`, sides: 0, fill: 'silver' };
  const r = size / 2;
  const cx = r, cy = r;
  const gradients = {
    bronze: ['#d99a5b', '#b3701f'],
    silver: ['#f1f5f9', '#b6c0cc'],
    gold: ['#ffe9a8', '#d6a93c'],
  };
  const gradId = `coin-grad-${value}-${size}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        {meta.fill !== 'bimetal' && (
          <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={gradients[meta.fill][0]} />
            <stop offset="100%" stopColor={gradients[meta.fill][1]} />
          </radialGradient>
        )}
      </defs>

      {meta.fill === 'bimetal' ? (
        <>
          {/* £2: gold outer ring, silver center — the real coin's look */}
          <circle cx={cx} cy={cy} r={r - 1} fill="#d6a93c" stroke="#a9811f" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={r * 0.62} fill="#e7edf3" stroke="#b6c0cc" strokeWidth="1.5" />
        </>
      ) : meta.sides >= 3 ? (
        <polygon
          points={polygonPoints(cx, cy, r - 1.5, meta.sides)}
          fill={`url(#${gradId})`}
          stroke={meta.fill === 'gold' ? '#a9811f' : '#94a3b8'}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ) : (
        <circle cx={cx} cy={cy} r={r - 1.5} fill={`url(#${gradId})`} stroke={meta.fill === 'bronze' ? '#8a5215' : '#94a3b8'} strokeWidth="1.5" />
      )}

      {/* Inner rim detail, like a real coin's inner circle */}
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />

      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="central"
        fontSize={value >= 100 ? size * 0.3 : size * 0.26}
        fontWeight="900"
        fill={meta.fill === 'bronze' ? '#5c3511' : '#334155'}
        style={{ fontFamily: 'inherit' }}
      >
        {meta.label}
      </text>
    </svg>
  );
}

export function Banknote({ value, width = 92, className = '' }) {
  const meta = NOTE_META[value] || { label: `£${value / 100}`, color: '#1f9d8a' };
  const height = width * 0.5;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <defs>
        <linearGradient id={`note-grad-${value}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={meta.color} stopOpacity="1" />
          <stop offset="100%" stopColor={meta.color} stopOpacity="0.82" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width={width - 2} height={height - 2} rx={height * 0.12}
        fill={`url(#note-grad-${value})`} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
      {/* Simple decorative guilloché-style lines, suggesting banknote
          texture without copying any real security feature or portrait */}
      <g opacity="0.25" stroke="#fff" strokeWidth="1" fill="none">
        <ellipse cx={width * 0.78} cy={height * 0.5} rx={height * 0.32} ry={height * 0.32} />
        <ellipse cx={width * 0.78} cy={height * 0.5} rx={height * 0.2} ry={height * 0.2} />
      </g>
      <circle cx={width * 0.78} cy={height * 0.5} r={height * 0.3} fill="rgba(255,255,255,0.15)" />
      <text
        x={width * 0.22} y={height * 0.5}
        textAnchor="start" dominantBaseline="central"
        fontSize={height * 0.42}
        fontWeight="900"
        fill="#fff"
        style={{ fontFamily: 'inherit' }}
      >
        {meta.label}
      </text>
    </svg>
  );
}

// Picks Coin or Banknote automatically from the pence value — the one
// thing callers actually need to know (money-counting content is written
// as a flat list of pence amounts, see conceptVisuals.js).
export default function MoneyPiece({ value, coinSize = 56, noteWidth = 92, className = '' }) {
  return isNoteValue(value)
    ? <Banknote value={value} width={noteWidth} className={className} />
    : <Coin value={value} size={coinSize} className={className} />;
}
