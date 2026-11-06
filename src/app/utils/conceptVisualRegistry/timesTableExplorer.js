import TimesTableExplorer from '@/app/components/ui/concept-visuals/TimesTableExplorer';

export default {
  'math-1-level-9-lesson': {
    Component: TimesTableExplorer,
    props: { tables: [{ factor: 2, upTo: 10 }, { factor: 5, upTo: 10 }, { factor: 10, upTo: 10 }] },
  },
  'math-2-level-11-lesson': {
    Component: TimesTableExplorer,
    props: { tables: [{ factor: 2, upTo: 12 }, { factor: 5, upTo: 12 }, { factor: 10, upTo: 12 }] },
  },
  'math-2-level-3-lesson': {
    Component: TimesTableExplorer,
    props: { tables: [{ factor: 3, upTo: 12 }, { factor: 4, upTo: 12 }, { factor: 8, upTo: 12 }] },
  },
  'math-2-level-14-lesson': {
    Component: TimesTableExplorer,
    props: { tables: [{ factor: 3, upTo: 12 }, { factor: 4, upTo: 12 }] },
  },
  'math-3-level-3-lesson': {
    Component: TimesTableExplorer,
    props: { tables: [{ factor: 6, upTo: 12 }, { factor: 7, upTo: 12 }, { factor: 9, upTo: 12 }, { factor: 11, upTo: 12 }, { factor: 12, upTo: 12 }] },
  },
};
