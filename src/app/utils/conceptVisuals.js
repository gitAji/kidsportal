// A small, explicit registry mapping a lesson's taskId to a dedicated
// interactive visual component — for concepts where tapping through
// sentence cards ("flip the card, then read a paragraph") doesn't teach
// the idea nearly as well as an actual shape the child can tap, trace and
// hear explained. Deliberately opt-in and per-lesson rather than a
// blanket redesign of every lesson: most lesson content doesn't have (or
// need) a bespoke visual, so InteractiveLesson falls back to the normal
// card-based flow whenever a taskId isn't listed here. Add more entries
// here as more concept visuals are built.
import ShapeExplorer from '@/app/components/ui/concept-visuals/ShapeExplorer';
import PerimeterTracer from '@/app/components/ui/concept-visuals/PerimeterTracer';
import ClockExplorer from '@/app/components/ui/concept-visuals/ClockExplorer';
import BarChartExplorer from '@/app/components/ui/concept-visuals/BarChartExplorer';

const CONCEPT_VISUALS = {
  'math-2-level-15-lesson': { Component: ShapeExplorer, props: {} },
  'math-2-level-5-lesson': { Component: PerimeterTracer, props: { length: 5, width: 3, unit: 'cm' } },
  'math-1-level-17-lesson': {
    Component: ClockExplorer,
    props: { times: [{ hour: 3, minute: 0 }, { hour: 7, minute: 30 }, { hour: 11, minute: 0 }] },
  },
  'math-2-level-16-lesson': {
    Component: ClockExplorer,
    props: { times: [{ hour: 5, minute: 5 }, { hour: 8, minute: 15 }, { hour: 2, minute: 30 }, { hour: 6, minute: 45 }] },
  },
  'math-2-level-9-lesson': {
    Component: BarChartExplorer,
    props: { bars: [{ label: 'Football', value: 15 }, { label: 'Tennis', value: 9 }, { label: 'Swimming', value: 6 }], unit: 'votes' },
  },
  'math-3-level-16-lesson': {
    Component: BarChartExplorer,
    props: { bars: [{ label: 'Apples', value: 12 }, { label: 'Bananas', value: 8 }, { label: 'Oranges', value: 5 }, { label: 'Grapes', value: 10 }], unit: 'children' },
  },
};

export function getConceptVisual(taskId) {
  return CONCEPT_VISUALS[taskId] || null;
}
