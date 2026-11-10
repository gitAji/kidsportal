import SentenceBuilder from '@/app/components/ui/concept-visuals/SentenceBuilder';

// Sentences drawn from each level's own lesson examples in db.json.
const JOINING_IDEAS = [
  { prompt: 'Tap the words in order to build the sentence', words: ['I', 'like', 'cats', 'and', 'dogs'] },
  { prompt: 'Tap the words in order to build the sentence', words: ['I', 'like', 'cats', 'but', 'not', 'spiders'] },
];

const REVIEW_BUILDING = [
  { prompt: 'Tap the words in order to build the sentence', words: ['My', 'dog', 'is', 'called', 'Max'] },
];

const QUESTION_WORDS = [
  { prompt: 'Tap the words in order to build the question', words: ['Where', 'is', 'the', 'cat'] },
  { prompt: 'Tap the words in order to build the question', words: ['Who', 'is', 'your', 'teacher'] },
];

const EXPANDED_NOUN_PHRASES_1 = [
  { prompt: 'Tap the words in order to build the noun phrase', words: ['the', 'big,', 'fluffy', 'dog'] },
];

const EXPANDED_NOUN_PHRASES_2 = [
  { prompt: 'Tap the words in order to build the noun phrase', words: ['the', 'tall,', 'ancient', 'oak', 'tree'] },
];

const COMPOUND_SENTENCES = [
  { prompt: 'Tap the words in order to build the compound sentence', words: ['The', 'dog', 'barked,', 'and', 'the', 'cat', 'ran', 'away'] },
];

const entry = (rounds) => ({ Component: SentenceBuilder, props: { rounds } });

export default {
  'english-1-level-5-lesson': entry(JOINING_IDEAS),
  'english-1-level-10-lesson': entry(REVIEW_BUILDING),
  'english-1-level-14-lesson': entry(QUESTION_WORDS),
  'english-3-level-2-lesson': entry(EXPANDED_NOUN_PHRASES_1),
  'english-3-level-14-lesson': entry(EXPANDED_NOUN_PHRASES_2),
  'english-3-level-20-lesson': entry(COMPOUND_SENTENCES),
};
