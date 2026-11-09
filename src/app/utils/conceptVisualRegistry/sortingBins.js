import SortingBins from '@/app/components/ui/concept-visuals/SortingBins';

const MATERIALS = [{
  prompt: 'What is each object made of?',
  bins: [
    { label: 'Wood', emoji: '🪵' }, { label: 'Plastic', emoji: '🧴' },
    { label: 'Metal', emoji: '🔧' }, { label: 'Fabric', emoji: '🧶' },
  ],
  items: [
    { label: 'Table', emoji: '🪑', binIndex: 0 },
    { label: 'Bottle', emoji: '🍼', binIndex: 1 },
    { label: 'Spoon', emoji: '🥄', binIndex: 2 },
    { label: 'Shirt', emoji: '👕', binIndex: 3 },
    { label: 'Pencil', emoji: '✏️', binIndex: 0 },
    { label: 'Key', emoji: '🔑', binIndex: 2 },
  ],
}];

const ANIMAL_GROUPS = [{
  prompt: 'Sort each animal into its group',
  bins: [
    { label: 'Mammals', emoji: '🐾' }, { label: 'Birds', emoji: '🪶' }, { label: 'Fish', emoji: '🐠' },
  ],
  items: [
    { label: 'Dog', emoji: '🐶', binIndex: 0 },
    { label: 'Eagle', emoji: '🦅', binIndex: 1 },
    { label: 'Shark', emoji: '🦈', binIndex: 2 },
    { label: 'Cat', emoji: '🐱', binIndex: 0 },
    { label: 'Parrot', emoji: '🦜', binIndex: 1 },
    { label: 'Goldfish', emoji: '🐟', binIndex: 2 },
  ],
}];

const HARD_SOFT = [{
  prompt: 'Is each material hard or soft?',
  bins: [
    { label: 'Hard', emoji: '🧱' }, { label: 'Soft', emoji: '🧸' },
  ],
  items: [
    { label: 'Rock', emoji: '🪨', binIndex: 0 },
    { label: 'Sponge', emoji: '🧽', binIndex: 1 },
    { label: 'Brick', emoji: '🧱', binIndex: 0 },
    { label: 'Pillow', emoji: '🛏️', binIndex: 1 },
    { label: 'Wood Block', emoji: '🪵', binIndex: 0 },
    { label: 'Cotton Wool', emoji: '☁️', binIndex: 1 },
  ],
}];

const FOOD_GROUPS = [{
  prompt: 'Sort each food into its food group',
  bins: [
    { label: 'Fruit & Veg', emoji: '🥕' }, { label: 'Protein', emoji: '🍗' },
    { label: 'Dairy', emoji: '🧀' }, { label: 'Grains', emoji: '🍞' },
  ],
  items: [
    { label: 'Apple', emoji: '🍎', binIndex: 0 },
    { label: 'Chicken', emoji: '🍗', binIndex: 1 },
    { label: 'Milk', emoji: '🥛', binIndex: 2 },
    { label: 'Bread', emoji: '🍞', binIndex: 3 },
    { label: 'Carrot', emoji: '🥕', binIndex: 0 },
    { label: 'Cheese', emoji: '🧀', binIndex: 2 },
  ],
}];

const MAGNETIC = [{
  prompt: 'Is each object magnetic or non-magnetic?',
  bins: [
    { label: 'Magnetic', emoji: '🧲' }, { label: 'Non-Magnetic', emoji: '🚫' },
  ],
  items: [
    { label: 'Iron Nail', emoji: '🔩', binIndex: 0 },
    { label: 'Plastic Ruler', emoji: '📏', binIndex: 1 },
    { label: 'Steel Spoon', emoji: '🥄', binIndex: 0 },
    { label: 'Wooden Spoon', emoji: '🥄', binIndex: 1 },
    { label: 'Paperclip', emoji: '📎', binIndex: 0 },
    { label: 'Rubber Ball', emoji: '⚽', binIndex: 1 },
  ],
}];

export default {
  'science-1-level-19-lesson': { Component: SortingBins, props: { rounds: MATERIALS } },
  'science-1-level-20-lesson': { Component: SortingBins, props: { rounds: ANIMAL_GROUPS } },
  'science-3-level-16-lesson': { Component: SortingBins, props: { rounds: HARD_SOFT } },
  'science-3-level-19-lesson': { Component: SortingBins, props: { rounds: FOOD_GROUPS } },
  'science-3-level-20-lesson': { Component: SortingBins, props: { rounds: MAGNETIC } },
};
