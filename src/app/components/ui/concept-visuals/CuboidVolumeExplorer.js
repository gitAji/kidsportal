"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp } from 'react-icons/fa';

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// Simple isometric projection helper.
function iso(x, y, z, ox = 100, oy = 150, scale = 14) {
  return { x: ox + (x - z) * scale * 0.87, y: oy - y * scale - (x + z) * scale * 0.3 };
}

// A cuboid drawn in isometric view whose three edges (length, width,
// height) a kid taps in turn, each one narrated with its measurement
// and added to a running "L × W × H" expression — the same tap-and-build
// treatment PerimeterTracer gives a rectangle's sides, applied to an
// actual 3D box instead of a flip-card paragraph stating the volume
// formula.
export default function CuboidVolumeExplorer({ length = 4, width = 3, height = 2, unit = 'cm', onComplete }) {
  const [tagged, setTagged] = useState(new Set()); // 0=length,1=width,2=height
  const dims = [length, width, height];
  const dimNames = ['length', 'width', 'height'];
  const volume = length * width * height;
  const done = tagged.size === 3;

  const tapDim = useCallback((idx) => {
    if (tagged.has(idx)) return;
    const next = new Set(tagged).add(idx);
    setTagged(next);
    if (next.size === 3) {
      speak(`${length} times ${width} times ${height} equals ${volume} cubic ${unit}.`);
    } else {
      speak(`The ${dimNames[idx]} is ${dims[idx]} ${unit}.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dims/dimNames/volume are stable derived values
  }, [tagged, length, width, height, unit, volume]);

  const replay = () => speak(`${length} times ${width} times ${height} equals ${volume} cubic ${unit}.`);

  // Cuboid corners, box spans x:[0,length] y:[0,height] z:[0,width]
  const corners = {
    o: iso(0, 0, 0), x: iso(length, 0, 0), z: iso(0, 0, width), xz: iso(length, 0, width),
    oy: iso(0, height, 0), xy: iso(length, height, 0), zy: iso(0, height, width), xyz: iso(length, height, width),
  };
  const poly = (...pts) => pts.map((p) => `${p.x},${p.y}`).join(' ');

  const lengthTagged = tagged.has(0);
  const widthTagged = tagged.has(1);
  const heightTagged = tagged.has(2);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-black text-slate-700">Find the Volume</h3>
        {done && (
          <button onClick={replay} aria-label="Listen" className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
            <FaVolumeUp className="text-sm" />
          </button>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 mb-6">Tap each edge to measure it — {tagged.size}/3</p>

      <svg viewBox="0 0 220 180" className="w-full max-w-xs h-auto">
        {/* Top face */}
        <polygon points={poly(corners.oy, corners.xy, corners.xyz, corners.zy)} fill="#dbeafe" stroke="#1e293b" strokeWidth={1.5} />
        {/* Front face */}
        <polygon points={poly(corners.o, corners.x, corners.xy, corners.oy)} fill="#93c5fd" stroke="#1e293b" strokeWidth={1.5} />
        {/* Side face */}
        <polygon points={poly(corners.x, corners.xz, corners.xyz, corners.xy)} fill="#60a5fa" stroke="#1e293b" strokeWidth={1.5} />

        {/* Length edge (front-bottom) */}
        <line x1={corners.o.x} y1={corners.o.y} x2={corners.x.x} y2={corners.x.y}
          stroke="transparent" strokeWidth={18} onClick={() => tapDim(0)} style={{ cursor: lengthTagged ? 'default' : 'pointer' }} />
        <line x1={corners.o.x} y1={corners.o.y} x2={corners.x.x} y2={corners.x.y}
          stroke={lengthTagged ? '#10b981' : '#1e293b'} strokeWidth={lengthTagged ? 5 : 2.5} style={{ pointerEvents: 'none' }} />

        {/* Width edge (front-right going back) */}
        <line x1={corners.x.x} y1={corners.x.y} x2={corners.xz.x} y2={corners.xz.y}
          stroke="transparent" strokeWidth={18} onClick={() => tapDim(1)} style={{ cursor: widthTagged ? 'default' : 'pointer' }} />
        <line x1={corners.x.x} y1={corners.x.y} x2={corners.xz.x} y2={corners.xz.y}
          stroke={widthTagged ? '#10b981' : '#1e293b'} strokeWidth={widthTagged ? 5 : 2.5} style={{ pointerEvents: 'none' }} />

        {/* Height edge */}
        <line x1={corners.x.x} y1={corners.x.y} x2={corners.xy.x} y2={corners.xy.y}
          stroke="transparent" strokeWidth={18} onClick={() => tapDim(2)} style={{ cursor: heightTagged ? 'default' : 'pointer' }} />
        <line x1={corners.x.x} y1={corners.x.y} x2={corners.xy.x} y2={corners.xy.y}
          stroke={heightTagged ? '#10b981' : '#1e293b'} strokeWidth={heightTagged ? 5 : 2.5} style={{ pointerEvents: 'none' }} />

        {lengthTagged && <text x={(corners.o.x + corners.x.x) / 2} y={corners.o.y + 16} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">{length}{unit}</text>}
        {widthTagged && <text x={(corners.x.x + corners.xz.x) / 2 + 10} y={(corners.x.y + corners.xz.y) / 2 - 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">{width}{unit}</text>}
        {heightTagged && <text x={corners.x.x + 14} y={(corners.x.y + corners.xy.y) / 2} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">{height}{unit}</text>}
      </svg>

      <div className="mt-4 min-h-[3rem] flex items-center justify-center flex-wrap gap-2">
        <AnimatePresence>
          {[0, 1, 2].filter((i) => tagged.has(i)).map((i, pos) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
              {pos > 0 && <span className="text-slate-300 font-black">&times;</span>}
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-black">{dims[i]}{unit}</span>
            </motion.span>
          ))}
        </AnimatePresence>
        {done && (
          <span className="flex items-center gap-2">
            <span className="text-slate-300 font-black">=</span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 font-black">{volume} {unit}&sup3;</span>
          </span>
        )}
      </div>

      <div className="mt-6 h-14 flex items-center">
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-lg">
            <FaCheckCircle /> Done!
          </motion.button>
        )}
      </div>
    </div>
  );
}
