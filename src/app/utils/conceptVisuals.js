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

const CONCEPT_VISUALS = {
  'math-2-level-15-lesson': { Component: ShapeExplorer, props: {} },
  'math-2-level-5-lesson': { Component: PerimeterTracer, props: { length: 5, width: 3, unit: 'cm' } },
};

export function getConceptVisual(taskId) {
  return CONCEPT_VISUALS[taskId] || null;
}
