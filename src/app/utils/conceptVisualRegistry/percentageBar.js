import PercentageBar from '@/app/components/ui/concept-visuals/PercentageBar';

const DECIMALS_INTRO = [
  { percent: 10, prompt: 'Shade 10 out of 100 squares' },
  { percent: 25, prompt: 'Shade 25 out of 100 squares' },
  { percent: 50, prompt: 'Shade 50 out of 100 squares' },
];

const FRACTIONS_DECIMALS_PERCENTAGES = [
  { percent: 20, prompt: 'Shade 20 out of 100 squares' },
  { percent: 40, prompt: 'Shade 40 out of 100 squares' },
  { percent: 75, prompt: 'Shade 75 out of 100 squares' },
  { percent: 80, prompt: 'Shade 80 out of 100 squares' },
];

export default {
  'math-3-level-4-lesson': { Component: PercentageBar, props: { examples: DECIMALS_INTRO } },
  'math-4-level-5-lesson': { Component: PercentageBar, props: { examples: FRACTIONS_DECIMALS_PERCENTAGES } },
  'math-4-level-14-lesson': { Component: PercentageBar, props: { examples: DECIMALS_INTRO } },
  'math-5-level-3-lesson': { Component: PercentageBar, props: { examples: FRACTIONS_DECIMALS_PERCENTAGES } },
  'math-5-level-19-lesson': { Component: PercentageBar, props: { examples: FRACTIONS_DECIMALS_PERCENTAGES } },
  'math-6-level-3-lesson': { Component: PercentageBar, props: { examples: FRACTIONS_DECIMALS_PERCENTAGES } },
};
