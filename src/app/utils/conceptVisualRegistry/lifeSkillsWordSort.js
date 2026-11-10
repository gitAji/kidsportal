import WordSorter from '@/app/components/ui/concept-visuals/WordSorter';

// Tap-the-word-into-a-category rounds for Life Skills lessons about
// telling a good habit/action from a less helpful one, reusing the
// existing WordSorter component. Own file for the same
// conflict-avoidance reason as the other conceptVisualRegistry/*
// files.
const entry = (rounds) => ({ Component: WordSorter, props: { rounds } });

export default {
  'lifeskills-1-level-5-lesson': entry([
    { prompt: 'Sort each action: Good Manners or Not So Good?', bins: [
      { label: 'Good Manners' }, { label: 'Not So Good' },
    ], items: [
      { text: 'Saying please', binIndex: 0 },
      { text: 'Saying thank you', binIndex: 0 },
      { text: 'Sharing toys', binIndex: 0 },
      { text: 'Interrupting', binIndex: 1 },
      { text: 'Grabbing toys', binIndex: 1 },
    ] },
  ]),
  'lifeskills-2-level-2-lesson': entry([
    { prompt: 'Sort each job: Chore at Home or Not a Chore?', bins: [
      { label: 'Chore at Home' }, { label: 'Not a Chore' },
    ], items: [
      { text: 'Setting the table', binIndex: 0 },
      { text: 'Feeding a pet', binIndex: 0 },
      { text: 'Watching TV', binIndex: 1 },
      { text: 'Eating a snack', binIndex: 1 },
    ] },
  ]),
};
