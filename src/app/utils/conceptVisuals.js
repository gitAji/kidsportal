// A small, explicit registry mapping a lesson's taskId to a dedicated
// interactive visual component — for concepts where tapping through
// sentence cards ("flip the card, then read a paragraph") doesn't teach
// the idea nearly as well as an actual shape the child can tap, trace and
// hear explained. Deliberately opt-in and per-lesson rather than a
// blanket redesign of every lesson: most lesson content doesn't have (or
// need) a bespoke visual, so InteractiveLesson falls back to the normal
// card-based flow whenever a taskId isn't listed here.
//
// Each component's wiring lives in its own file under
// ./conceptVisualRegistry/ instead of one shared growing object here —
// deliberately, after the registry entries for five different concept
// visuals were each silently dropped in this same file during PR
// merges (components survived as files, their wiring didn't, because
// every new entry landed on the same handful of lines near the end of
// one big object literal, which conflicted almost every time two
// visual PRs merged close together). Splitting wiring into one file
// per component means a new visual's PR only ever *adds a new file*
// here, which can't conflict with anyone else's new file the same way.
// To add a concept visual: create ./conceptVisualRegistry/yourVisual.js
// exporting a default object of `{ taskId: { Component, props } }`,
// then add one import + one spread line below.
import shapeExplorer from './conceptVisualRegistry/shapeExplorer';
import perimeterTracer from './conceptVisualRegistry/perimeterTracer';
import clockExplorer from './conceptVisualRegistry/clockExplorer';
import barChartExplorer from './conceptVisualRegistry/barChartExplorer';
import coinCounter from './conceptVisualRegistry/coinCounter';
import angleExplorer from './conceptVisualRegistry/angleExplorer';
import weightBalance from './conceptVisualRegistry/weightBalance';
import numberLineExplorer from './conceptVisualRegistry/numberLineExplorer';
import fractionShapeExplorer from './conceptVisualRegistry/fractionShapeExplorer';
import coordinatePlotter from './conceptVisualRegistry/coordinatePlotter';
import placeValueExplorer from './conceptVisualRegistry/placeValueExplorer';
import timesTableExplorer from './conceptVisualRegistry/timesTableExplorer';
import areaGridExplorer from './conceptVisualRegistry/areaGridExplorer';
import pieChartExplorer from './conceptVisualRegistry/pieChartExplorer';
import cuboidVolumeExplorer from './conceptVisualRegistry/cuboidVolumeExplorer';
import probabilityExplorer from './conceptVisualRegistry/probabilityExplorer';
import circleExplorer from './conceptVisualRegistry/circleExplorer';
import symmetryExplorer from './conceptVisualRegistry/symmetryExplorer';
import percentageBar from './conceptVisualRegistry/percentageBar';

const CONCEPT_VISUALS = {
  ...shapeExplorer,
  ...perimeterTracer,
  ...clockExplorer,
  ...barChartExplorer,
  ...coinCounter,
  ...angleExplorer,
  ...weightBalance,
  ...numberLineExplorer,
  ...fractionShapeExplorer,
  ...coordinatePlotter,
  ...placeValueExplorer,
  ...timesTableExplorer,
  ...areaGridExplorer,
  ...pieChartExplorer,
  ...cuboidVolumeExplorer,
  ...probabilityExplorer,
  ...circleExplorer,
  ...symmetryExplorer,
  ...percentageBar,
};

export function getConceptVisual(taskId) {
  return CONCEPT_VISUALS[taskId] || null;
}
