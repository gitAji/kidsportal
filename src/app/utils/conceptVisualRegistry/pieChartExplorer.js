import PieChartExplorer from '@/app/components/ui/concept-visuals/PieChartExplorer';

export default {
  'math-5-level-9-lesson': {
    Component: PieChartExplorer,
    props: { slices: [{ label: 'Football', value: 5 }, { label: 'Cricket', value: 3 }, { label: 'Tennis', value: 2 }], unit: 'votes' },
  },
  'math-6-level-16-lesson': {
    Component: PieChartExplorer,
    props: { slices: [{ label: 'Walk', value: 8 }, { label: 'Bus', value: 5 }, { label: 'Car', value: 3 }, { label: 'Cycle', value: 4 }], unit: 'children' },
  },
};
