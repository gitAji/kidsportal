import ProbabilityExplorer from '@/app/components/ui/concept-visuals/ProbabilityExplorer';

export default {
  'math-6-level-7-lesson': {
    Component: ProbabilityExplorer,
    props: { outcomes: [
      { label: 'Red', count: 3, color: '#f87171' },
      { label: 'Blue', count: 2, color: '#60a5fa' },
      { label: 'Yellow', count: 1, color: '#fbbf24' },
    ] },
  },
  'math-7-level-15-lesson': {
    Component: ProbabilityExplorer,
    props: { outcomes: [
      { label: 'Green', count: 4, color: '#34d399' },
      { label: 'Purple', count: 3, color: '#a78bfa' },
      { label: 'Orange', count: 5, color: '#fb923c' },
    ] },
  },
};
