import SymmetryExplorer from '@/app/components/ui/concept-visuals/SymmetryExplorer';

export default {
  'math-4-level-18-lesson': {
    Component: SymmetryExplorer,
    props: { shapes: [{ name: 'Equilateral Triangle', sides: 3 }, { name: 'Square', sides: 4 }, { name: 'Regular Pentagon', sides: 5 }, { name: 'Regular Hexagon', sides: 6 }] },
  },
};
