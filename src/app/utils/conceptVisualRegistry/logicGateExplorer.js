import LogicGateExplorer from '@/app/components/ui/concept-visuals/LogicGateExplorer';

const GATES = [
  { type: 'AND', label: 'AND Gate' },
  { type: 'OR', label: 'OR Gate' },
  { type: 'NOT', label: 'NOT Gate' },
];

const entry = { Component: LogicGateExplorer, props: { gates: GATES } };

export default {
  'coding-5-level-3-lesson': entry,
  'coding-4-level-14-lesson': entry,
  'computerscience-7-level-4-lesson': entry,
  'computerscience-7-level-12-lesson': entry,
  'computerscience-7-level-21-lesson': entry,
  'computerscience-9-level-14-lesson': entry,
  'computerscience-10-level-3-lesson': entry,
};
