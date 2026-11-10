import VocabFlashcards from '@/app/components/ui/concept-visuals/VocabFlashcards';

// Tap-to-flip word cards for Life Skills lessons about naming things
// (feelings, community helpers), reusing the existing VocabFlashcards
// component built for Tamil vocabulary — it works for English content
// just as well via its `lang` prop (defaults to en-GB). Own file for
// the same conflict-avoidance reason as the other
// conceptVisualRegistry/* files.
const entry = (cards) => ({ Component: VocabFlashcards, props: { cards } });

export default {
  'lifeskills-1-level-4-lesson': entry([
    { emoji: '😊', word: 'Happy', meaning: 'Feeling good and cheerful' },
    { emoji: '😢', word: 'Sad', meaning: 'Feeling unhappy' },
    { emoji: '😠', word: 'Angry', meaning: 'Feeling cross or mad' },
    { emoji: '😨', word: 'Scared', meaning: 'Feeling afraid' },
  ]),
  'lifeskills-3-level-8-lesson': entry([
    { emoji: '👩‍⚕️', word: 'Doctor', meaning: 'Keeps people healthy' },
    { emoji: '👨‍🚒', word: 'Firefighter', meaning: 'Keeps people safe from fires' },
    { emoji: '👩‍🏫', word: 'Teacher', meaning: 'Helps you learn' },
    { emoji: '🚌', word: 'Bus Driver', meaning: 'Drives people safely to places' },
  ]),
};
