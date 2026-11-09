import LoopRepeater from '@/app/components/ui/concept-visuals/LoopRepeater';

const SCENARIOS = [
  { label: 'Clap', emoji: '👏', times: 4 },
  { label: 'Jump', emoji: '🤸', times: 3 },
  { label: 'Spin', emoji: '🌀', times: 5 },
  { label: 'Stomp', emoji: '🦶', times: 4 },
];

const entry = { Component: LoopRepeater, props: { scenarios: SCENARIOS } };

export default {
  'coding-1-level-4-lesson': entry,
  'coding-1-level-12-lesson': entry,
  'coding-1-level-17-lesson': entry,
  'coding-2-level-3-lesson': entry,
  'coding-2-level-4-lesson': entry,
  'coding-3-level-3-lesson': entry,
  'computerscience-4-level-1-lesson': entry,
  'coding-3-level-11-lesson': entry,
  'coding-3-level-18-lesson': entry,
  'coding-4-level-3-lesson': entry,
};
