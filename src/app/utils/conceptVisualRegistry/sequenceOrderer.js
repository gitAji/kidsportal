import SequenceOrderer from '@/app/components/ui/concept-visuals/SequenceOrderer';

const SCENARIOS = [
  { title: 'Making a Jam Sandwich', steps: ['Get two slices of bread', 'Spread the jam', 'Put the slices together', 'Take a bite!'] },
  { title: 'Brushing Your Teeth', steps: ['Put toothpaste on the brush', 'Brush your teeth', 'Rinse your mouth', 'Put the toothbrush away'] },
  { title: 'Planting a Seed', steps: ['Fill a pot with soil', 'Push the seed into the soil', 'Water the soil', 'Put the pot in sunlight'] },
  { title: 'Getting Ready for Bed', steps: ['Put on pyjamas', 'Brush your teeth', 'Read a bedtime story', 'Turn off the light'] },
  { title: 'Washing Your Hands', steps: ['Turn on the tap', 'Add soap and scrub', 'Rinse your hands', 'Dry your hands with a towel'] },
  { title: 'Tying Your Shoelaces', steps: ['Cross the two laces', 'Make a loop with one lace', 'Wrap the other lace around', 'Pull it through to make a knot'] },
];

const entry = { Component: SequenceOrderer, props: { scenarios: SCENARIOS } };

export default {
  'computerscience-1-level-4-lesson': entry,
  'computerscience-1-level-5-lesson': entry,
  'computerscience-1-level-20-lesson': entry,
  'coding-1-level-1-lesson': entry,
  'coding-1-level-2-lesson': entry,
  'coding-1-level-11-lesson': entry,
  'coding-2-level-1-lesson': entry,
  'computerscience-2-level-17-lesson': entry,
  'computerscience-2-level-19-lesson': entry,
};
