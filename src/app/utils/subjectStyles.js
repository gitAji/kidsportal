// Single source of truth for each subject's color identity and icon,
// used by the Learning Zone hub and every page that should carry a
// subject's color through (e.g. its modules/levels page). Keeping this in
// one place avoids the two copies drifting apart, which is what happened
// before this file existed — the modules page hard-coded its own copy of
// these exact colors, but cycled through all of them per-level instead of
// using the one that actually matches the subject you're in.
import { FaBookOpen, FaCalculator, FaMicroscope, FaLanguage, FaStar, FaCode, FaLaptopCode } from 'react-icons/fa';

// hex/borderHex duplicate the bg/border Tailwind arbitrary-value colors as
// raw hex, for code that needs to compute a shade from them at runtime
// (see getLevelShade below) — Tailwind's JIT only picks up `bg-[#...]`
// classes it can see literally in source, so a runtime-computed hex can't
// be turned back into a class string and has to be applied as inline style
// instead.
export const SUBJECT_STYLE_MAP = {
  "English": { bg: "bg-[#FF9B9B]", border: "border-[#FF7272]", icon: "text-[#FF7272]", hex: "#FF9B9B", borderHex: "#FF7272" },
  "Math": { bg: "bg-[#72C6FF]", border: "border-[#40A5E5]", icon: "text-[#40A5E5]", hex: "#72C6FF", borderHex: "#40A5E5" },
  "Tamil": { bg: "bg-[#72E5A8]", border: "border-[#4CC287]", icon: "text-[#4CC287]", hex: "#72E5A8", borderHex: "#4CC287" },
  "Science": { bg: "bg-[#FFC972]", border: "border-[#E5A840]", icon: "text-[#E5A840]", hex: "#FFC972", borderHex: "#E5A840" },
  "Coding": { bg: "bg-[#C48CFF]", border: "border-[#A05CFF]", icon: "text-[#A05CFF]", hex: "#C48CFF", borderHex: "#A05CFF" },
  "Computer Science": { bg: "bg-[#8CEFFF]", border: "border-[#5CCEE5]", icon: "text-[#5CCEE5]", hex: "#8CEFFF", borderHex: "#5CCEE5" },
  "default": { bg: "bg-[#D1D5DB]", border: "border-[#9CA3AF]", icon: "text-[#9CA3AF]", hex: "#D1D5DB", borderHex: "#9CA3AF" },
};

// ── Per-level shade ramp ─────────────────────────────────────────────────
// Every level in a subject shares that subject's hue, but steps from a
// lighter shade at Level 1 to a darker one at the last level, so the level
// grid itself gives a visual sense of "how far along" a subject a kid is —
// on top of (not instead of) the explicit "Level X" label and progress bar.

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => Math.max(0, Math.min(255, Math.round((v + m) * 255)));
  return `#${[r, g, b].map(v => toHex(v).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Returns { bg, border } hex colors for level `index` of `total` levels in
 * a subject whose base colors are `baseHex`/`baseBorderHex`. index 0 comes
 * out a bit lighter than the subject's base color, the last index a bit
 * darker, interpolated evenly in between. Lightness is clamped so the
 * white icon/text on the card always stays readable, even for a 1-level
 * subject (which just gets the base color back, t = 0.5).
 */
export function getLevelShade(baseHex, baseBorderHex, index, total) {
  const t = total > 1 ? index / (total - 1) : 0.5; // 0 = first level, 1 = last
  const range = 22; // total lightness spread, in percentage points, light → dark
  const shift = (0.5 - t) * range;

  const bgHsl = hexToHsl(baseHex);
  const bg = hslToHex(bgHsl.h, bgHsl.s, Math.min(78, Math.max(38, bgHsl.l + shift)));

  const borderHsl = hexToHsl(baseBorderHex);
  const border = hslToHex(borderHsl.h, borderHsl.s, Math.min(68, Math.max(22, borderHsl.l + shift)));

  return { bg, border };
}

export const SUBJECT_ICON_MAP = {
  "English": FaBookOpen,
  "Math": FaCalculator,
  "Tamil": FaLanguage,
  "Science": FaMicroscope,
  "Coding": FaCode,
  "Computer Science": FaLaptopCode,
  "default": FaStar,
};
