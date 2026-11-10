import WeightBalance from '@/app/components/ui/concept-visuals/WeightBalance';

export default {
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
};
