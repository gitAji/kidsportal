import CoordinatePlotter from '@/app/components/ui/concept-visuals/CoordinatePlotter';

export default {
  'math-4-level-21-lesson': {
    Component: CoordinatePlotter,
    props: { range: { minX: 0, maxX: 6, minY: 0, maxY: 6 }, points: [{ x: 2, y: 3, label: 'A' }, { x: 5, y: 1, label: 'B' }, { x: 4, y: 4, label: 'C' }] },
  },
  'math-3-level-8-lesson': {
    Component: CoordinatePlotter,
    props: { range: { minX: 0, maxX: 8, minY: 0, maxY: 8 }, points: [{ x: 4, y: 5, label: 'A' }, { x: 7, y: 1, label: 'B' }, { x: 5, y: 3, label: 'C' }] },
  },
  'math-5-level-18-lesson': {
    Component: CoordinatePlotter,
    props: { range: { minX: -5, maxX: 5, minY: -5, maxY: 5 }, points: [{ x: 3, y: 2, label: 'A' }, { x: -2, y: 4, label: 'B' }, { x: -3, y: -3, label: 'C' }, { x: 4, y: -2, label: 'D' }] },
  },
};
