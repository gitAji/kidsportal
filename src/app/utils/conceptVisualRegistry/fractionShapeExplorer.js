import FractionShapeExplorer from '@/app/components/ui/concept-visuals/FractionShapeExplorer';

export default {
  'math-1-level-18-lesson': {
    Component: FractionShapeExplorer,
    props: { examples: [{ totalParts: 2, shadedParts: 1, shape: 'circle' }, { totalParts: 4, shadedParts: 1, shape: 'circle' }] },
  },
  'math-2-level-4-lesson': {
    Component: FractionShapeExplorer,
    props: { examples: [{ totalParts: 10, shadedParts: 3, shape: 'bar' }, { totalParts: 10, shadedParts: 7, shape: 'bar' }] },
  },
  'math-2-level-12-lesson': {
    Component: FractionShapeExplorer,
    props: { examples: [{ totalParts: 4, shadedParts: 3, shape: 'circle' }, { totalParts: 8, shadedParts: 5, shape: 'bar' }] },
  },
  'math-2-level-18-lesson': {
    Component: FractionShapeExplorer,
    props: { examples: [{ totalParts: 2, shadedParts: 1, shape: 'circle' }, { totalParts: 4, shadedParts: 3, shape: 'circle' }] },
  },
  'math-3-level-17-lesson': {
    Component: FractionShapeExplorer,
    props: { examples: [{ totalParts: 4, shadedParts: 2, shape: 'bar' }, { totalParts: 8, shadedParts: 4, shape: 'bar' }] },
  },
};
