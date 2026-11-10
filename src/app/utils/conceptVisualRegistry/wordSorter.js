import WordSorter from '@/app/components/ui/concept-visuals/WordSorter';

// Rounds built from each level's own lesson/quiz examples in db.json,
// so the words a child sorts are exactly the ones they're taught and
// tested on.
const NOUNS_VERBS_ADJECTIVES = [
  { prompt: 'Sort each word: is it a Noun, a Verb, or an Adjective?', bins: [
    { label: 'Noun' }, { label: 'Verb' }, { label: 'Adjective' },
  ], items: [
    { text: 'girl', binIndex: 0 },
    { text: 'dog', binIndex: 0 },
    { text: 'barks', binIndex: 1 },
    { text: 'runs', binIndex: 1 },
    { text: 'tiny', binIndex: 2 },
    { text: 'shiny', binIndex: 2 },
  ] },
];

const CONNECTIVES = [
  { prompt: 'Sort each connective: does it show Time, Cause, or Place?', bins: [
    { label: 'Time' }, { label: 'Cause' }, { label: 'Place' },
  ], items: [
    { text: 'meanwhile', binIndex: 0 },
    { text: 'afterwards', binIndex: 0 },
    { text: 'so', binIndex: 1 },
    { text: 'because', binIndex: 1 },
    { text: 'nearby', binIndex: 2 },
    { text: 'beyond', binIndex: 2 },
  ] },
];

const PREFIXES = [
  { prompt: "Sort each word by its prefix: un-, re-, or dis-", bins: [
    { label: 'un-' }, { label: 're-' }, { label: 'dis-' },
  ], items: [
    { text: 'unhappy', binIndex: 0 },
    { text: 'unkind', binIndex: 0 },
    { text: 'redo', binIndex: 1 },
    { text: 'rewrite', binIndex: 1 },
    { text: 'disagree', binIndex: 2 },
    { text: 'dislike', binIndex: 2 },
  ] },
];

const SUFFIXES = [
  { prompt: 'Sort each word by its suffix: -ful, -less, or -ly', bins: [
    { label: '-ful' }, { label: '-less' }, { label: '-ly' },
  ], items: [
    { text: 'careful', binIndex: 0 },
    { text: 'helpful', binIndex: 0 },
    { text: 'careless', binIndex: 1 },
    { text: 'hopeless', binIndex: 1 },
    { text: 'quickly', binIndex: 2 },
    { text: 'slowly', binIndex: 2 },
  ] },
];

const entry = (rounds) => ({ Component: WordSorter, props: { rounds } });

export default {
  'english-1-level-4-lesson': entry(NOUNS_VERBS_ADJECTIVES),
  'english-2-level-4-lesson': entry(CONNECTIVES),
  'english-2-level-17-lesson': entry(PREFIXES),
  'english-2-level-20-lesson': entry(SUFFIXES),
};
