import DebugHunt from '@/app/components/ui/concept-visuals/DebugHunt';

const SCENARIOS = [
  {
    title: 'Making Toast',
    steps: ['Put bread in the toaster', 'Eat the toast', 'Press the toaster down', 'Wait for it to pop up'],
    bugIndex: 1,
    bugFix: '"Eat the toast" should come LAST — you can\'t eat it before it\'s even toasted!',
  },
  {
    title: 'Getting Dressed',
    steps: ['Put on your socks', 'Put on your shoes', 'Put on your trousers', 'Walk outside'],
    bugIndex: 1,
    bugFix: "Shoes go on AFTER your trousers, not before — otherwise you can't get your trousers on over your shoes!",
  },
  {
    title: 'Baking a Cake',
    steps: ['Mix the ingredients', 'Put the cake in the oven', 'Turn on the oven', "Take the cake out when it's baked"],
    bugIndex: 2,
    bugFix: "You need to turn the oven ON before you put the cake in — otherwise it won't bake!",
  },
  {
    title: 'Watering a Plant',
    steps: ['Fill a watering can', 'Pour water on the plant', 'Plant the seed in soil', 'Watch it grow'],
    bugIndex: 1,
    bugFix: "You need to plant the seed BEFORE you water it — there's nothing to water yet!",
  },
];

const entry = { Component: DebugHunt, props: { scenarios: SCENARIOS } };

export default {
  'computerscience-1-level-6-lesson': entry,
  'coding-1-level-5-lesson': entry,
  'coding-2-level-5-lesson': entry,
  'coding-3-level-8-lesson': entry,
  'computerscience-3-level-18-lesson': entry,
  'coding-4-level-8-lesson': entry,
  'computerscience-4-level-4-lesson': entry,
  'coding-5-level-8-lesson': entry,
  'coding-5-level-12-lesson': entry,
  'coding-8-level-8-lesson': entry,
};
