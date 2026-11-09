import PatternSequencer from '@/app/components/ui/concept-visuals/PatternSequencer';

const PUZZLES = [
  { sequence: ['🔴', '🔵', '🔴', '🔵'], options: ['🔴', '🟢', '🔵'], answer: '🔴' },
  { sequence: ['🟦', '🟦', '🟨', '🟦', '🟦'], options: ['🟨', '🟥', '🟦'], answer: '🟨' },
  { sequence: ['🐱', '🐶', '🐱', '🐶', '🐱'], options: ['🐱', '🐦', '🐶'], answer: '🐶' },
  { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], options: ['🌙', '⭐', '☀️'], answer: '🌙' },
  { sequence: ['🍎', '🍌', '🍌', '🍎', '🍌', '🍌'], options: ['🍌', '🍊', '🍎'], answer: '🍎' },
  { sequence: ['🟢', '🟢', '🔵', '🔵', '🟢', '🟢'], options: ['🟢', '🔵', '🟡'], answer: '🔵' },
];

const entry = { Component: PatternSequencer, props: { puzzles: PUZZLES } };

export default {
  'math-1-level-6-lesson': entry,
  'computerscience-1-level-13-lesson': entry,
};
