import ClockExplorer from '@/app/components/ui/concept-visuals/ClockExplorer';

export default {
  'math-1-level-17-lesson': {
    Component: ClockExplorer,
    props: { times: [{ hour: 3, minute: 0 }, { hour: 7, minute: 30 }, { hour: 11, minute: 0 }] },
  },
  'math-2-level-16-lesson': {
    Component: ClockExplorer,
    props: { times: [{ hour: 5, minute: 5 }, { hour: 8, minute: 15 }, { hour: 2, minute: 30 }, { hour: 6, minute: 45 }] },
  },
};
