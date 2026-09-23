// Grade-1 pilot content for the Games section. Each game is tied to a real
// subject/level from db.json (grade-1) so it reinforces what that lesson
// actually teaches, not just a generic "letters/numbers" placeholder:
//   - math-1-level-1   "Place Value to 100"      -> tap-match on tens & ones
//   - english-1-level-1 "Phonics & Spelling"      -> memory pairs on suffixes
//   - tamil-1-level-1  "Tamil Alphabet: Vowels"   -> timed reflex on uyir ezhuthukkal
// Coding already has its own dedicated Build Lab (maze/pattern/free-build);
// the Games hub links out to it rather than duplicating it.

export const GAMES_BY_GRADE = {
  'grade-1': [
    {
      id: 'number-breakdown-match',
      subjectId: 'math-1',
      subjectLabel: 'Math',
      title: 'Number Breakdown',
      description: 'Split two-digit numbers into tens and ones!',
      engine: 'tap-match',
      icon: '🔢',
      color: 'from-blue-400 to-indigo-500',
      data: {
        instruction: 'Tap the correct tens & ones for each number!',
        rounds: [
          { prompt: '47', options: ['4 tens + 7 ones (40 + 7)', '7 tens + 4 ones (70 + 4)', '4 tens + 0 ones (40)'], correctIndex: 0 },
          { prompt: '58', options: ['8 tens + 5 ones (80 + 5)', '5 tens + 8 ones (50 + 8)', '5 tens + 0 ones (50)'], correctIndex: 1 },
          { prompt: '63', options: ['6 tens + 3 ones (60 + 3)', '3 tens + 6 ones (30 + 6)', '6 tens + 0 ones (60)'], correctIndex: 0 },
          { prompt: '29', options: ['9 tens + 2 ones (90 + 2)', '2 tens + 0 ones (20)', '2 tens + 9 ones (20 + 9)'], correctIndex: 2 },
          { prompt: '81', options: ['8 tens + 1 one (80 + 1)', '1 ten + 8 ones (10 + 8)', '8 tens + 0 ones (80)'], correctIndex: 0 },
        ],
      },
    },
    {
      id: 'suffix-pairs',
      subjectId: 'english-1',
      subjectLabel: 'English',
      title: 'Suffix Pairs',
      description: 'Match each word to its -ed, -ing, -er or -est ending!',
      engine: 'memory-pairs',
      icon: '🔤',
      color: 'from-emerald-400 to-teal-500',
      data: {
        instruction: 'Flip two cards to find a word and its matching ending!',
        pairs: [
          { id: 'jump', front: 'jump', match: 'jumped' },
          { id: 'walk', front: 'walk', match: 'walking' },
          { id: 'fast', front: 'fast', match: 'faster' },
          { id: 'small', front: 'small', match: 'smallest' },
          { id: 'help', front: 'help', match: 'helped' },
          { id: 'look', front: 'look', match: 'looking' },
        ],
      },
    },
    {
      id: 'vowel-tap',
      subjectId: 'tamil-1',
      subjectLabel: 'Tamil',
      title: 'உயிர் எழுத்து தேடு (Find the Vowels)',
      description: 'Tap every uyir ezhuthu (vowel) before time runs out!',
      engine: 'timed-reflex',
      icon: '✍️',
      color: 'from-orange-400 to-rose-500',
      data: {
        instruction: 'Tap all 12 vowels (உயிர் எழுத்துக்கள்) — avoid the others!',
        timeLimit: 30,
        items: [
          { value: 'அ', isTarget: true }, { value: 'க', isTarget: false }, { value: 'ஆ', isTarget: true },
          { value: 'ங', isTarget: false }, { value: 'இ', isTarget: true }, { value: 'ச', isTarget: false },
          { value: 'ஈ', isTarget: true }, { value: 'ஞ', isTarget: false }, { value: 'உ', isTarget: true },
          { value: 'ட', isTarget: false }, { value: 'ஊ', isTarget: true }, { value: 'ண', isTarget: false },
          { value: 'எ', isTarget: true }, { value: 'த', isTarget: false }, { value: 'ஏ', isTarget: true },
          { value: 'ந', isTarget: false }, { value: 'ஐ', isTarget: true }, { value: 'ப', isTarget: false },
          { value: 'ஒ', isTarget: true }, { value: 'ம', isTarget: false }, { value: 'ஓ', isTarget: true },
          { value: 'ய', isTarget: false }, { value: 'ஔ', isTarget: true }, { value: 'ர', isTarget: false },
        ],
      },
    },
  ],
};

// A link-out entry shown alongside the grade's games: reuses the existing
// Coding Build Lab (Blockly maze/pattern/free-build) instead of duplicating
// it, and — unlike the other games here — stays open the way it already
// was before the Games section existed.
export const CODING_GAME_LINK = {
  id: 'coding-build-lab',
  subjectId: 'coding-1',
  subjectLabel: 'Coding',
  title: 'Build Lab',
  description: 'Solve mazes and match patterns with code blocks!',
  icon: '🤖',
  color: 'from-violet-400 to-purple-500',
  href: '/learning-zone/coding-lab',
};

export function getGamesForGrade(gradeId) {
  return GAMES_BY_GRADE[gradeId] || [];
}

export function getGameById(gradeId, gameId) {
  return getGamesForGrade(gradeId).find(g => g.id === gameId) || null;
}
