import SortingBins from '@/app/components/ui/concept-visuals/SortingBins';

// Tap-to-sort-into-bins rounds for Life Skills lessons that are
// naturally a classification task (needs vs. wants, spend vs. save,
// recycle vs. bin...), reusing the existing SortingBins component
// built for Science lessons. Own file for the same conflict-avoidance
// reason as the other conceptVisualRegistry/* files.
const entry = (rounds) => ({ Component: SortingBins, props: { rounds } });

export default {
  'lifeskills-1-level-3-lesson': entry([
    { prompt: 'Sort each food: Healthy Everyday Food or Sometimes Treat?', bins: [
      { label: 'Healthy Everyday Food', emoji: '🥦' }, { label: 'Sometimes Treat', emoji: '🍬' },
    ], items: [
      { label: 'Apple', emoji: '🍎', binIndex: 0 },
      { label: 'Carrot', emoji: '🥕', binIndex: 0 },
      { label: 'Water', emoji: '💧', binIndex: 0 },
      { label: 'Sweets', emoji: '🍬', binIndex: 1 },
      { label: 'Crisps', emoji: '🍟', binIndex: 1 },
    ] },
  ]),
  'lifeskills-1-level-8-lesson': entry([
    { prompt: 'Sort each thing: Need or Want?', bins: [
      { label: 'Need', emoji: '🍽️' }, { label: 'Want', emoji: '🎁' },
    ], items: [
      { label: 'Food', emoji: '🍞', binIndex: 0 },
      { label: 'Water', emoji: '💧', binIndex: 0 },
      { label: 'Toy', emoji: '🧸', binIndex: 1 },
      { label: 'Sweets', emoji: '🍬', binIndex: 1 },
    ] },
  ]),
  'lifeskills-2-level-3-lesson': entry([
    { prompt: 'Sort each choice: Spend Now or Save for Later?', bins: [
      { label: 'Spend Now', emoji: '🛍️' }, { label: 'Save for Later', emoji: '🏦' },
    ], items: [
      { label: 'Buy a sweet today', emoji: '🍬', binIndex: 0 },
      { label: 'Keep coins in a money box', emoji: '🪙', binIndex: 1 },
      { label: 'Buy a comic today', emoji: '📖', binIndex: 0 },
      { label: 'Save for a big toy', emoji: '🧸', binIndex: 1 },
    ] },
  ]),
  'lifeskills-2-level-8-lesson': entry([
    { prompt: 'Sort each item: Recycle or Rubbish Bin?', bins: [
      { label: 'Recycle', emoji: '♻️' }, { label: 'Rubbish Bin', emoji: '🗑️' },
    ], items: [
      { label: 'Paper', emoji: '📄', binIndex: 0 },
      { label: 'Plastic bottle', emoji: '🧴', binIndex: 0 },
      { label: 'Glass jar', emoji: '🫙', binIndex: 0 },
      { label: 'Food scraps', emoji: '🍌', binIndex: 1 },
    ] },
  ]),
  'lifeskills-3-level-1-lesson': entry([
    { prompt: 'Sort your pocket money plan: Spending, Saving, or Sharing?', bins: [
      { label: 'Spending', emoji: '🛍️' }, { label: 'Saving', emoji: '🏦' }, { label: 'Sharing', emoji: '🎁' },
    ], items: [
      { label: 'Buy a comic today', emoji: '📖', binIndex: 0 },
      { label: 'Put coins in a money box', emoji: '🪙', binIndex: 1 },
      { label: 'Give some to a charity box', emoji: '❤️', binIndex: 2 },
      { label: 'Save for a big toy', emoji: '🧸', binIndex: 1 },
    ] },
  ]),
  'lifeskills-3-level-6-lesson': entry([
    { prompt: 'Sort each action: Reduce, Reuse, or Recycle?', bins: [
      { label: 'Reduce', emoji: '📉' }, { label: 'Reuse', emoji: '🔁' }, { label: 'Recycle', emoji: '♻️' },
    ], items: [
      { label: 'Bring a reusable water bottle', emoji: '🚰', binIndex: 0 },
      { label: 'Turn a jar into a pencil holder', emoji: '🖊️', binIndex: 1 },
      { label: 'Put a plastic bottle in the recycling', emoji: '🧴', binIndex: 2 },
      { label: 'Use a cloth bag instead of a new one', emoji: '🛍️', binIndex: 0 },
    ] },
  ]),
  'lifeskills-3-level-7-lesson': entry([
    { prompt: 'Sort each activity: Active Play or Screen Time?', bins: [
      { label: 'Active Play', emoji: '⚽' }, { label: 'Screen Time', emoji: '📱' },
    ], items: [
      { label: 'Riding a bike', emoji: '🚲', binIndex: 0 },
      { label: 'Dancing', emoji: '💃', binIndex: 0 },
      { label: 'Watching videos', emoji: '📺', binIndex: 1 },
      { label: 'Playing a video game', emoji: '🎮', binIndex: 1 },
    ] },
  ]),
};
