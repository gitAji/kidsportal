import React from 'react';
import { FaStar, FaHeart, FaCircle, FaSquare } from 'react-icons/fa';

// Explicit class strings (not template-built) so Tailwind's scanner keeps them.
const TEXT_COLOR = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-400',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
};

const ICONS = {
  circle: FaCircle,
  square: FaSquare,
  star: FaStar,
  heart: FaHeart,
};

export default function Stamp({ shape, color, size = 32 }) {
  const Icon = ICONS[shape] || FaCircle;
  const colorClass = TEXT_COLOR[color] || 'text-slate-400';
  return <Icon size={size} className={`${colorClass} drop-shadow-sm`} />;
}
