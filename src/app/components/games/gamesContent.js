// Grade-1 pilot content for the Games section, hand-crafted to reinforce
// exactly what that lesson teaches, not a generic "letters/numbers"
// placeholder:
//   - math-1-level-1            "Place Value to 100"          -> tap-match on tens & ones
//   - english-1-level-1         "Phonics & Spelling"          -> memory pairs on suffixes
//   - tamil-1-level-1           "Tamil Alphabet: Vowels"      -> timed reflex on uyir ezhuthukkal
//   - science-1-level-1         "Living Things & Habitats"    -> timed reflex on living vs not
//   - computerscience-1-level-1 "What is a Computer?"         -> tap-match on parts & uses
//   - tamil-1-level-2           "Tamil Alphabet: Consonants"  -> tap-match, real quiz/exam bank
// Coding already has its own dedicated Build Lab (maze/pattern/free-build);
// the Games hub links out to it rather than duplicating it.
//
// Grades 2-10 are generated from each subject's real Level 1 quiz/exam
// question bank (see gamesContentGenerated.js) rather than hand-authored,
// so every grade gets accurate, curriculum-tested coverage without
// bespoke content for 45 more subject/grade combinations. Tamil additionally
// gets a second game per grade (this session), sourced the same way from
// each grade's Level 2 Tamil quiz/exam bank, so kids get more than one
// quiz's worth of Tamil practice instead of a single game per grade.
//
// A handful of grades also get a hand-crafted `label-diagram` game (drag
// each label onto the matching part of a diagram), each one grounded in
// that grade's real Science lesson content rather than an invented topic:
//   - grade-1 "Parts of a Flower"                 (Plants)
//   - grade-3 "The Water Cycle"                   (The Water Cycle)
//   - grade-4 "Simple Machines"                   (Mechanisms: levers/pulleys/gears)
//   - grade-5 "The Circulatory System"            (The Circulatory System)
//   - grade-6 "Parts of a Plant Cell"              (Cells & Organisation)
//   - grade-7 "Parts of an Ecosystem"              (Ecosystems & Interdependence)
import { GENERATED_GAMES_BY_GRADE } from './gamesContentGenerated';

const HAND_CRAFTED_GAMES_BY_GRADE = {
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
    {
      id: 'tamil-1-level2-quickcheck',
      subjectId: 'tamil-1',
      subjectLabel: 'Tamil',
      title: 'Tamil Alphabet: Consonants',
      description: "Quick-fire questions from this level's Tamil lesson!",
      engine: 'tap-match',
      icon: '📖',
      color: 'from-rose-400 to-pink-500',
      data: {
        instruction: 'Tap the correct answer for each question!',
        rounds: [
          { prompt: 'What is the Tamil term for consonant letters?', options: ['எண்ணெழுத்து', 'உயிர்மெய் எழுத்து', 'மெய் எழுத்து', 'உயிர் எழுத்து'], correctIndex: 2 },
          { prompt: "Which letter makes the 'm' sound?", options: ['ம', 'ன', 'ல', 'ந'], correctIndex: 0 },
          { prompt: 'How many basic consonants are there in the Tamil alphabet?', options: ['24', '18', '12', '16'], correctIndex: 1 },
          { prompt: 'The small dot placed above a consonant (like க்) is called a:', options: ['kural', 'vetrumai', 'pulli', 'kural mei'], correctIndex: 2 },
          { prompt: "Which letter makes the 'ch' sound?", options: ['ஞ', 'ச', 'த', 'ட'], correctIndex: 1 },
        ],
      },
    },
    {
      id: 'living-things-tap',
      subjectId: 'science-1',
      subjectLabel: 'Science',
      title: 'Living or Not?',
      description: 'Tap every living thing before time runs out!',
      engine: 'timed-reflex',
      icon: '🌱',
      color: 'from-lime-400 to-green-500',
      data: {
        instruction: 'Tap only the LIVING things — they grow, move, and need food and water!',
        timeLimit: 25,
        items: [
          { value: '🐶', isTarget: true }, { value: '🪨', isTarget: false }, { value: '🌼', isTarget: true },
          { value: '🚗', isTarget: false }, { value: '🐟', isTarget: true }, { value: '🪑', isTarget: false },
          { value: '🌳', isTarget: true }, { value: '🍂', isTarget: false }, { value: '🦋', isTarget: true },
          { value: '📱', isTarget: false }, { value: '🐱', isTarget: true }, { value: '🥄', isTarget: false },
          { value: '🌱', isTarget: true }, { value: '🧸', isTarget: false }, { value: '🐦', isTarget: true },
          { value: '⚽', isTarget: false },
        ],
      },
    },
    {
      id: 'computer-parts-match',
      subjectId: 'computerscience-1',
      subjectLabel: 'Computer Science',
      title: 'Parts & Uses',
      description: 'Match each computer part to what it does!',
      engine: 'tap-match',
      icon: '💻',
      color: 'from-sky-400 to-blue-600',
      data: {
        instruction: 'Tap what each part of a computer is for!',
        rounds: [
          { prompt: 'Screen (Monitor)', options: ['Shows us pictures and words', 'Lets us type letters and numbers', 'Follows instructions very quickly'], correctIndex: 0 },
          { prompt: 'Keyboard', options: ['Lets us point, click and move things', 'Lets us type letters and numbers', 'Shows us pictures and words'], correctIndex: 1 },
          { prompt: 'Mouse / Touchpad', options: ['Follows instructions very quickly', 'Lets us type letters and numbers', 'Lets us point, click and move things'], correctIndex: 2 },
          { prompt: "The part that does the 'thinking'", options: ['Follows our instructions very quickly', 'Shows us pictures and words', 'Lets us point and click'], correctIndex: 0 },
          { prompt: 'A computer', options: ['A toy that only plays games', 'A machine that stores info and follows instructions', 'A machine that never turns on'], correctIndex: 1 },
        ],
      },
    },
    {
      id: 'flower-parts-label',
      subjectId: 'science-1',
      subjectLabel: 'Science',
      title: 'Parts of a Flower',
      description: 'Drag each label onto the correct part of the flower!',
      engine: 'label-diagram',
      icon: '🌸',
      color: 'from-pink-400 to-rose-500',
      data: {
        instruction: 'Drag each label onto the matching part of the flower!',
        viewBox: '0 0 100 100',
        background: 'linear-gradient(180deg, #e0f2fe 0%, #e0f2fe 55%, #d6b58a 55%, #d6b58a 100%)',
        shapes: [
          { kind: 'svg', tag: 'ellipse', props: { cx: 50, cy: 16, rx: 8, ry: 14, fill: '#f472b6', transform: 'rotate(0 50 16)' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 63, cy: 24, rx: 8, ry: 14, fill: '#f472b6', transform: 'rotate(72 63 24)' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 59, cy: 40, rx: 8, ry: 14, fill: '#f472b6', transform: 'rotate(144 59 40)' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 41, cy: 40, rx: 8, ry: 14, fill: '#f472b6', transform: 'rotate(216 41 40)' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 37, cy: 24, rx: 8, ry: 14, fill: '#f472b6', transform: 'rotate(288 37 24)' } },
          { kind: 'svg', tag: 'circle', props: { cx: 50, cy: 30, r: 9, fill: '#fbbf24' } },
          { kind: 'svg', tag: 'rect', props: { x: 47, y: 38, width: 6, height: 48, rx: 2, fill: '#16a34a' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 30, cy: 64, rx: 14, ry: 7, fill: '#22c55e', transform: 'rotate(-25 30 64)' } },
          { kind: 'svg', tag: 'path', props: { d: 'M50,86 L38,98 M50,86 L50,99 M50,86 L62,98', stroke: '#92400e', strokeWidth: 3, fill: 'none', strokeLinecap: 'round' } },
        ],
        zones: [
          { id: 'petal', x: 50, y: 18, label: 'Petal' },
          { id: 'leaf', x: 30, y: 64, label: 'Leaf' },
          { id: 'stem', x: 50, y: 62, label: 'Stem' },
          { id: 'root', x: 50, y: 95, label: 'Root' },
        ],
      },
    },
  ],
  'grade-7': [
    {
      id: 'ecosystem-parts-label',
      subjectId: 'science-7',
      subjectLabel: 'Science',
      title: 'Parts of an Ecosystem',
      description: 'Drag each label onto the matching part of the food chain!',
      engine: 'label-diagram',
      icon: '🌳',
      color: 'from-emerald-400 to-green-600',
      data: {
        instruction: 'Drag each label onto the matching part of this ecosystem!',
        background: 'linear-gradient(180deg, #bae6fd 0%, #bae6fd 30%, #bbf7d0 30%, #bbf7d0 82%, #92702f 82%, #92702f 100%)',
        shapes: [
          { kind: 'emoji', x: 15, y: 12, size: 46, value: '☀️' },
          { kind: 'emoji', x: 30, y: 45, size: 54, value: '🌳' },
          { kind: 'emoji', x: 55, y: 68, size: 40, value: '🐇' },
          { kind: 'emoji', x: 78, y: 55, size: 42, value: '🦊' },
          { kind: 'emoji', x: 45, y: 88, size: 34, value: '🍄' },
        ],
        zones: [
          { id: 'energy', x: 15, y: 12, label: 'Sunlight (Energy Source)' },
          { id: 'producer', x: 30, y: 45, label: 'Producer' },
          { id: 'herbivore', x: 55, y: 68, label: 'Consumer (Herbivore)' },
          { id: 'predator', x: 78, y: 55, label: 'Consumer (Predator)' },
          { id: 'decomposer', x: 45, y: 88, label: 'Decomposer' },
        ],
      },
    },
  ],
  'grade-3': [
    {
      id: 'water-cycle-label',
      subjectId: 'science-3',
      subjectLabel: 'Science',
      title: 'The Water Cycle',
      description: 'Drag each label onto the matching stage of the water cycle!',
      engine: 'label-diagram',
      icon: '💧',
      color: 'from-sky-400 to-blue-500',
      data: {
        instruction: 'Drag each label onto the matching stage of the water cycle!',
        background: 'linear-gradient(180deg, #dbeafe 0%, #dbeafe 55%, #0ea5e9 55%, #0ea5e9 100%)',
        shapes: [
          { kind: 'emoji', x: 18, y: 12, size: 40, value: '☀️' },
          { kind: 'emoji', x: 55, y: 15, size: 48, value: '☁️' },
          { kind: 'emoji', x: 78, y: 38, size: 40, value: '🌧️' },
          { kind: 'emoji', x: 50, y: 85, size: 52, value: '🌊' },
          { kind: 'svg', tag: 'path', props: { d: 'M30,80 C28,65 35,50 30,32', stroke: '#38bdf8', strokeWidth: 2.5, fill: 'none', strokeDasharray: '4 3', strokeLinecap: 'round' } },
        ],
        zones: [
          { id: 'evaporation', x: 30, y: 55, label: 'Evaporation' },
          { id: 'condensation', x: 55, y: 15, label: 'Condensation' },
          { id: 'precipitation', x: 78, y: 38, label: 'Precipitation' },
          { id: 'collection', x: 50, y: 85, label: 'Collection' },
        ],
      },
    },
  ],
  'grade-4': [
    {
      id: 'simple-machines-label',
      subjectId: 'science-4',
      subjectLabel: 'Science',
      title: 'Simple Machines: Levers, Pulleys & Gears',
      description: 'Drag each label onto the matching part of these mechanisms!',
      engine: 'label-diagram',
      icon: '⚙️',
      color: 'from-amber-400 to-orange-500',
      data: {
        instruction: 'Drag each label onto the matching part of these mechanisms!',
        background: 'linear-gradient(180deg, #f1f5f9 0%, #f1f5f9 100%)',
        shapes: [
          { kind: 'svg', tag: 'polygon', props: { points: '15,72 22,58 29,72', fill: '#78716c' } },
          { kind: 'svg', tag: 'rect', props: { x: 2, y: 54, width: 40, height: 5, fill: '#a16207', transform: 'rotate(-15 22 58)' } },
          { kind: 'svg', tag: 'rect', props: { x: 2, y: 42, width: 10, height: 10, fill: '#3b82f6' } },
          { kind: 'svg', tag: 'rect', props: { x: 48, y: 20, width: 3, height: 42, fill: '#57534e' } },
          { kind: 'svg', tag: 'circle', props: { cx: 52, cy: 20, r: 5, fill: 'none', stroke: '#78716c', strokeWidth: 2.5 } },
          { kind: 'svg', tag: 'path', props: { d: 'M49,22 L44,58 M55,22 L60,58', stroke: '#78350f', strokeWidth: 1.5, fill: 'none' } },
          { kind: 'svg', tag: 'rect', props: { x: 40, y: 55, width: 10, height: 7, fill: '#dc2626' } },
          { kind: 'emoji', x: 78, y: 45, size: 44, value: '⚙️' },
          { kind: 'emoji', x: 91, y: 45, size: 28, value: '⚙️' },
        ],
        zones: [
          { id: 'fulcrum', x: 22, y: 66, label: 'Fulcrum' },
          { id: 'load-lever', x: 7, y: 47, label: 'Load (Lever)' },
          { id: 'pulley-wheel', x: 52, y: 20, label: 'Pulley Wheel' },
          { id: 'load-pulley', x: 44, y: 58, label: 'Load (Pulley)' },
          { id: 'gear', x: 78, y: 45, label: 'Gear' },
        ],
      },
    },
  ],
  'grade-5': [
    {
      id: 'circulatory-system-label',
      subjectId: 'science-5',
      subjectLabel: 'Science',
      title: 'The Circulatory System',
      description: 'Drag each label onto the matching part of the circulatory system!',
      engine: 'label-diagram',
      icon: '❤️',
      color: 'from-rose-400 to-red-500',
      data: {
        instruction: 'Drag each label onto the matching part of the circulatory system!',
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        shapes: [
          { kind: 'emoji', x: 35, y: 40, size: 56, value: '❤️' },
          { kind: 'svg', tag: 'path', props: { d: 'M55,35 C75,25 85,20 92,15', stroke: '#dc2626', strokeWidth: 3, fill: 'none', strokeLinecap: 'round' } },
          { kind: 'svg', tag: 'path', props: { d: 'M92,30 C80,45 65,50 55,45', stroke: '#1d4ed8', strokeWidth: 3, fill: 'none', strokeLinecap: 'round' } },
          { kind: 'svg', tag: 'circle', props: { cx: 94, cy: 22, r: 7, fill: '#fca5a5', opacity: 0.6 } },
          { kind: 'svg', tag: 'path', props: { d: 'M90,18 L97,15 M90,18 L97,20 M90,26 L97,24 M90,26 L97,29', stroke: '#f87171', strokeWidth: 1.2, fill: 'none', strokeLinecap: 'round' } },
        ],
        zones: [
          { id: 'heart', x: 35, y: 40, label: 'Heart' },
          { id: 'artery', x: 75, y: 24, label: 'Artery' },
          { id: 'vein', x: 75, y: 42, label: 'Vein' },
          { id: 'capillary', x: 94, y: 22, label: 'Capillary' },
        ],
      },
    },
  ],
  'grade-6': [
    {
      id: 'plant-cell-label',
      subjectId: 'science-6',
      subjectLabel: 'Science',
      title: 'Parts of a Plant Cell',
      description: 'Drag each label onto the matching part of the plant cell!',
      engine: 'label-diagram',
      icon: '🔬',
      color: 'from-green-400 to-emerald-500',
      data: {
        instruction: 'Drag each label onto the matching part of the plant cell!',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #f0fdf4 100%)',
        shapes: [
          { kind: 'svg', tag: 'rect', props: { x: 8, y: 15, width: 84, height: 70, rx: 14, fill: '#bbf7d0', stroke: '#166534', strokeWidth: 3 } },
          { kind: 'svg', tag: 'rect', props: { x: 13, y: 19, width: 74, height: 62, rx: 11, fill: 'none', stroke: '#4ade80', strokeWidth: 2, strokeDasharray: '4 2' } },
          { kind: 'svg', tag: 'circle', props: { cx: 68, cy: 55, r: 18, fill: '#e0f2fe', stroke: '#0284c7', strokeWidth: 2, opacity: 0.85 } },
          { kind: 'svg', tag: 'circle', props: { cx: 38, cy: 48, r: 14, fill: '#93c5fd', stroke: '#1d4ed8', strokeWidth: 2 } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 25, cy: 70, rx: 6, ry: 3.5, fill: '#16a34a', transform: 'rotate(20 25 70)' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 55, cy: 25, rx: 6, ry: 3.5, fill: '#16a34a', transform: 'rotate(-15 55 25)' } },
          { kind: 'svg', tag: 'ellipse', props: { cx: 80, cy: 30, rx: 6, ry: 3.5, fill: '#16a34a', transform: 'rotate(30 80 30)' } },
        ],
        zones: [
          { id: 'cell-wall', x: 50, y: 17, label: 'Cell Wall' },
          { id: 'cell-membrane', x: 13, y: 50, label: 'Cell Membrane' },
          { id: 'nucleus', x: 38, y: 48, label: 'Nucleus' },
          { id: 'vacuole', x: 68, y: 55, label: 'Vacuole' },
          { id: 'chloroplast', x: 55, y: 25, label: 'Chloroplast' },
        ],
      },
    },
  ],
};

// Grade 1 has no generated games at all, so its hand-crafted array is used
// as-is. Every other grade already has 5 generated tap-match games (see
// gamesContentGenerated.js) — a hand-crafted entry for one of those grades
// (like grade-7's label-diagram game below) is appended to that grade's
// list rather than replacing it, so new bespoke games and the generated
// ones coexist instead of one silently clobbering the other.
function mergeGamesByGrade(...sources) {
  const merged = {};
  for (const source of sources) {
    for (const [gradeId, games] of Object.entries(source)) {
      merged[gradeId] = [...(merged[gradeId] || []), ...games];
    }
  }
  return merged;
}

export const GAMES_BY_GRADE = mergeGamesByGrade(GENERATED_GAMES_BY_GRADE, HAND_CRAFTED_GAMES_BY_GRADE);

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
