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
import CoinCounter from '@/app/components/ui/concept-visuals/CoinCounter';
import AngleExplorer from '@/app/components/ui/concept-visuals/AngleExplorer';
import WeightBalance from '@/app/components/ui/concept-visuals/WeightBalance';
import SymmetryExplorer from '@/app/components/ui/concept-visuals/SymmetryExplorer';

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
  // Restored below: these two components (CoinCounter, AngleExplorer) and
  // their wiring here were dropped silently when PR #124 merged Test into
  // its branch and a conflict on this exact file got resolved in favor of
  // the wrong side — the component files survived, the wiring didn't, so
  // these 6 lessons silently fell back to the old flip-card flow.
  'math-1-level-15-lesson': { Component: CoinCounter, props: { coins: [1, 2, 5, 10] } },
  'math-1-level-16-lesson': { Component: CoinCounter, props: { coins: [10, 20, 50] } },
  'math-2-level-19-lesson': { Component: CoinCounter, props: { coins: [500, 200, 100, 50] } },
  'math-2-level-8-lesson': { Component: AngleExplorer, props: { angles: [45, 90, 135, 180] } },
  'math-4-level-7-lesson': { Component: AngleExplorer, props: { angles: [60, 90, 150, 200] } },
  'math-5-level-15-lesson': { Component: AngleExplorer, props: { angles: [40, 90, 180, 300] } },
  'math-1-level-12-lesson': {
    Component: WeightBalance,
    props: { pairs: [
      { left: { label: 'A feather', grams: 5 }, right: { label: 'A brick', grams: 2000 } },
      { left: { label: 'An apple', grams: 150 }, right: { label: 'A watermelon', grams: 3000 } },
    ] },
  },
  'math-2-level-13-lesson': {
    Component: WeightBalance,
    props: { pairs: [
      { left: { label: 'A bag of flour', grams: 1500 }, right: { label: 'A bag of sugar', grams: 1000 } },
      { left: { label: 'A kitten', grams: 1200 }, right: { label: 'A kitten', grams: 1200 } },
    ] },
  },
  'math-2-level-21-lesson': {
    Component: WeightBalance,
    props: { pairs: [
      { left: { label: '1 kg weight', grams: 1000 }, right: { label: '1,000 one-gram candies', grams: 1000 } },
      { left: { label: 'A 500 g bag of rice', grams: 500 }, right: { label: 'Two 250 g weights', grams: 500 } },
    ] },
  },
  'math-4-level-18-lesson': {
    Component: SymmetryExplorer,
    props: { shapes: [{ name: 'Equilateral Triangle', sides: 3 }, { name: 'Square', sides: 4 }, { name: 'Regular Pentagon', sides: 5 }, { name: 'Regular Hexagon', sides: 6 }] },
  },
};

export function getConceptVisual(taskId) {
  return CONCEPT_VISUALS[taskId] || null;
}
