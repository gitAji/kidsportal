import SortingBins from '@/app/components/ui/concept-visuals/SortingBins';

// Reuse SortingBins for the Life Skills "Recycling & Reducing Waste" lesson
// — the lesson text gives "turning a jar into a pencil holder" as its own
// example of reuse, which round 1's Glass Jar item directly matches.
const WASTE_SORTING = [
  {
    prompt: 'Where does each piece of rubbish belong?',
    bins: [
      { label: 'Recycle Plastic', emoji: '♻️' },
      { label: 'Food Waste', emoji: '🍂' },
      { label: 'Reuse It', emoji: '🔄' },
    ],
    items: [
      { label: 'Plastic Bottle', emoji: '🧴', binIndex: 0 },
      { label: 'Banana Peel', emoji: '🍌', binIndex: 1 },
      { label: 'Glass Jar', emoji: '🫙', binIndex: 2 },
      { label: 'Plastic Bag', emoji: '🛍️', binIndex: 0 },
      { label: 'Apple Core', emoji: '🍎', binIndex: 1 },
      { label: 'Cardboard Box', emoji: '📦', binIndex: 2 },
    ],
  },
  {
    prompt: 'Sort these too — where do they belong?',
    bins: [
      { label: 'Recycle Plastic', emoji: '♻️' },
      { label: 'Food Waste', emoji: '🍂' },
      { label: 'Reuse It', emoji: '🔄' },
    ],
    items: [
      { label: 'Plastic Straw', emoji: '🥤', binIndex: 0 },
      { label: 'Eggshells', emoji: '🥚', binIndex: 1 },
      { label: 'Old T-Shirt', emoji: '👕', binIndex: 2 },
      { label: 'Plastic Container', emoji: '🥡', binIndex: 0 },
      { label: 'Vegetable Scraps', emoji: '🥬', binIndex: 1 },
      { label: 'Tin Can', emoji: '🥫', binIndex: 2 },
    ],
  },
];

export default {
  'lifeskills-3-level-6-lesson': { Component: SortingBins, props: { rounds: WASTE_SORTING } },
};
