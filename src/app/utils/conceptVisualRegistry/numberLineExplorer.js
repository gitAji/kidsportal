import NumberLineExplorer from '@/app/components/ui/concept-visuals/NumberLineExplorer';

export default {
  'math-1-level-3-lesson': {
    Component: NumberLineExplorer,
    props: { min: 0, max: 50, points: [{ value: 12, label: '12' }, { value: 38, label: '38' }, { value: 23, label: '23' }, { value: 45, label: '45' }] },
  },
  'math-3-level-2-lesson': {
    Component: NumberLineExplorer,
    props: { min: -10, max: 10, points: [{ value: -5, label: '-5' }, { value: 3, label: '3' }, { value: -2, label: '-2' }, { value: 7, label: '7' }] },
  },
  'math-4-level-16-lesson': {
    Component: NumberLineExplorer,
    props: { min: -10, max: 10, points: [{ value: -8, label: '-8' }, { value: -3, label: '-3' }, { value: 0, label: '0' }, { value: 5, label: '5' }] },
  },
  'math-6-level-22-lesson': {
    Component: NumberLineExplorer,
    props: { min: -15, max: 15, points: [{ value: -12, label: '-12' }, { value: 4, label: '4' }, { value: -7, label: '-7' }, { value: 9, label: '9' }] },
  },
};
