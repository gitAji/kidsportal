import PunctuationPicker from '@/app/components/ui/concept-visuals/PunctuationPicker';

// Sentences and options drawn from each level's own lesson/quiz
// examples in db.json.
const SENTENCE_TYPES = [
  { prompt: 'Pick the mark that finishes this statement', sentence: 'The cat is sleeping___', options: ['.', '?', '!'], correctIndex: 0 },
  { prompt: 'Pick the mark that finishes this question', sentence: 'Is the cat sleeping___', options: ['.', '?', '!'], correctIndex: 1 },
  { prompt: 'Pick the mark that finishes this exclamation', sentence: 'The cat is huge___', options: ['.', '?', '!'], correctIndex: 2 },
];

const PUNCTUATION_BASICS = [
  { prompt: 'Pick the mark that finishes this statement', sentence: 'My friend Sam lives in London___', options: ['.', '?', '!'], correctIndex: 0 },
  { prompt: 'Pick the mark that finishes this question', sentence: 'What is your name___', options: ['.', '?', '!'], correctIndex: 1 },
];

const TYPES_OF_SENTENCES = [
  { prompt: 'Pick the mark that finishes this statement', sentence: 'The dog is running___', options: ['.', '?', '!'], correctIndex: 0 },
  { prompt: 'Pick the mark that finishes this question', sentence: 'Where is my hat___', options: ['.', '?', '!'], correctIndex: 1 },
  { prompt: 'Pick the mark that finishes this exclamation', sentence: 'What a day___', options: ['.', '?', '!'], correctIndex: 2 },
];

const APOSTROPHES_POSSESSION = [
  { prompt: "Pick how to show one cat's toy belongs to it", sentence: 'the cat___ toy', options: ["'s", "s'", "'"], correctIndex: 0 },
  { prompt: 'Pick how to show several dogs own the toys', sentence: 'the dogs___ toys', options: ["'s", "s'", "'"], correctIndex: 1 },
];

const COMMAS_IN_LISTS = [
  { prompt: 'Pick the mark that separates these list items', sentence: 'I like cats___ dogs, and rabbits', options: [',', '.', '!'], correctIndex: 0 },
  { prompt: 'Pick the mark that separates these list items', sentence: 'She bought pens___ pencils, and erasers', options: [',', '.', '!'], correctIndex: 0 },
];

const FRONTED_ADVERBIALS = [
  { prompt: 'Pick the mark that follows this fronted adverbial', sentence: 'Suddenly___ the lights went out', options: [',', '.', '!'], correctIndex: 0 },
  { prompt: 'Pick the mark that follows this fronted adverbial', sentence: 'Later that day___ we went to the beach', options: [',', '.', '!'], correctIndex: 0 },
];

const POSSESSIVE_PRONOUNS = [
  { prompt: "Pick the correct possessive — no apostrophe needed", sentence: 'The dog wagged ___ tail', options: ['its', "it's", "its'"], correctIndex: 0 },
  { prompt: 'Pick the correct possessive pronoun', sentence: 'Is this pencil ___?', options: ['yours', "your's", "yours'"], correctIndex: 0 },
];

const entry = (rounds) => ({ Component: PunctuationPicker, props: { rounds } });

export default {
  'english-1-level-3-lesson': entry(SENTENCE_TYPES),
  'english-1-level-6-lesson': entry(PUNCTUATION_BASICS),
  'english-1-level-20-lesson': entry(TYPES_OF_SENTENCES),
  'english-2-level-8-lesson': entry(APOSTROPHES_POSSESSION),
  'english-2-level-15-lesson': entry(COMMAS_IN_LISTS),
  'english-3-level-3-lesson': entry(FRONTED_ADVERBIALS),
  'english-3-level-8-lesson': entry(POSSESSIVE_PRONOUNS),
};
