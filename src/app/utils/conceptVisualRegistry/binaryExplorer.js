import BinaryExplorer from '@/app/components/ui/concept-visuals/BinaryExplorer';

const INTRO_4BIT = [{ bits: 4, target: 10 }, { bits: 4, target: 5 }, { bits: 4, target: null }];
const ADVANCED_8BIT = [{ bits: 8, target: 42 }, { bits: 8, target: 100 }, { bits: 8, target: null }];

const introEntry = { Component: BinaryExplorer, props: { examples: INTRO_4BIT } };
const advancedEntry = { Component: BinaryExplorer, props: { examples: ADVANCED_8BIT } };

export default {
  'computerscience-4-level-11-lesson': introEntry,
  'computerscience-4-level-19-lesson': introEntry,
  'computerscience-5-level-8-lesson': introEntry,
  'computerscience-6-level-6-lesson': introEntry,
  'computerscience-6-level-12-lesson': introEntry,
  'computerscience-9-level-4-lesson': advancedEntry,
  'computerscience-10-level-4-lesson': advancedEntry,
};
