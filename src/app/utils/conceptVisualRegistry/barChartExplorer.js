import BarChartExplorer from '@/app/components/ui/concept-visuals/BarChartExplorer';

export default {
  'math-2-level-9-lesson': {
    Component: BarChartExplorer,
    props: { bars: [{ label: 'Football', value: 15 }, { label: 'Tennis', value: 9 }, { label: 'Swimming', value: 6 }], unit: 'votes' },
  },
  'math-3-level-16-lesson': {
    Component: BarChartExplorer,
    props: { bars: [{ label: 'Apples', value: 12 }, { label: 'Bananas', value: 8 }, { label: 'Oranges', value: 5 }, { label: 'Grapes', value: 10 }], unit: 'children' },
  },
};
