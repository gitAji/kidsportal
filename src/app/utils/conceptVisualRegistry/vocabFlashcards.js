import VocabFlashcards from '@/app/components/ui/concept-visuals/VocabFlashcards';

// Vocabulary pulled directly from each level's own quiz content in
// db.json, so every card matches what the child is actually tested on
// — not a fresh (and possibly inconsistent) translation.
const TA = 'ta-IN';

const GREETINGS = [
  { emoji: '🙏', word: 'வணக்கம்', meaning: 'Hello' },
  { emoji: '🙏', word: 'நன்றி', meaning: 'Thank you' },
  { emoji: '🤔', word: 'எப்படி இருக்கீங்க?', meaning: 'How are you?' },
  { emoji: '😅', word: 'மன்னிக்கவும்', meaning: 'Sorry / excuse me' },
];

const NUMBERS_1_10 = [
  { emoji: '1️⃣', word: 'ஒன்று', meaning: 'One' },
  { emoji: '2️⃣', word: 'இரண்டு', meaning: 'Two' },
  { emoji: '3️⃣', word: 'மூன்று', meaning: 'Three' },
  { emoji: '4️⃣', word: 'நான்கு', meaning: 'Four' },
  { emoji: '5️⃣', word: 'ஐந்து', meaning: 'Five' },
  { emoji: '🔟', word: 'பத்து', meaning: 'Ten' },
];

const COLOURS_SHAPES = [
  { emoji: '🔴', word: 'சிவப்பு', meaning: 'Red' },
  { emoji: '🟡', word: 'மஞ்சள்', meaning: 'Yellow' },
  { emoji: '🔵', word: 'நீலம்', meaning: 'Blue' },
  { emoji: '🟢', word: 'பச்சை', meaning: 'Green' },
  { emoji: '⚪', word: 'வட்டம்', meaning: 'Circle' },
  { emoji: '🔺', word: 'முக்கோணம்', meaning: 'Triangle' },
];

const FAMILY_1 = [
  { emoji: '👩', word: 'அம்மா', meaning: 'Mother' },
  { emoji: '👨', word: 'அப்பா', meaning: 'Father' },
  { emoji: '👦', word: 'அண்ணன்', meaning: 'Older brother' },
  { emoji: '👧', word: 'அக்கா', meaning: 'Older sister' },
  { emoji: '👦', word: 'தம்பி', meaning: 'Younger brother' },
  { emoji: '👧', word: 'தங்கை', meaning: 'Younger sister' },
];

const ANIMALS = [
  { emoji: '🐶', word: 'நாய்', meaning: 'Dog' },
  { emoji: '🐱', word: 'பூனை', meaning: 'Cat' },
  { emoji: '🐘', word: 'யானை', meaning: 'Elephant' },
  { emoji: '🐴', word: 'குதிரை', meaning: 'Horse' },
  { emoji: '🐄', word: 'மாடு', meaning: 'Cow' },
];

const FRUITS_FOOD = [
  { emoji: '🥭', word: 'மாம்பழம்', meaning: 'Mango' },
  { emoji: '🍌', word: 'வாழைப்பழம்', meaning: 'Banana' },
  { emoji: '🍚', word: 'அரிசி', meaning: 'Rice' },
  { emoji: '🥛', word: 'பால்', meaning: 'Milk' },
];

const DAYS_OF_WEEK = [
  { emoji: '📅', word: 'திங்கள்', meaning: 'Monday' },
  { emoji: '📅', word: 'செவ்வாய்', meaning: 'Tuesday' },
  { emoji: '📅', word: 'புதன்', meaning: 'Wednesday' },
  { emoji: '📅', word: 'வியாழன்', meaning: 'Thursday' },
  { emoji: '📅', word: 'வெள்ளி', meaning: 'Friday' },
  { emoji: '📅', word: 'சனி', meaning: 'Saturday' },
  { emoji: '📅', word: 'ஞாயிறு', meaning: 'Sunday' },
];

const SCHOOL_OBJECTS = [
  { emoji: '📖', word: 'புத்தகம்', meaning: 'Book' },
  { emoji: '🧑‍🏫', word: 'ஆசிரியர்', meaning: 'Teacher' },
  { emoji: '🖊️', word: 'பேனா', meaning: 'Pen' },
  { emoji: '🏫', word: 'பள்ளி', meaning: 'School' },
];

const WEATHER = [
  { emoji: '🌧️', word: 'மழை', meaning: 'Rain' },
  { emoji: '💨', word: 'காற்று', meaning: 'Wind' },
  { emoji: '☀️', word: 'வெயில்', meaning: 'Sunshine' },
  { emoji: '❄️', word: 'குளிர்', meaning: 'Cold' },
];

const VEHICLES_PLACES = [
  { emoji: '🚗', word: 'கார்', meaning: 'Car' },
  { emoji: '🏥', word: 'மருத்துவமனை', meaning: 'Hospital' },
  { emoji: '🚌', word: 'பேருந்து', meaning: 'Bus' },
  { emoji: '🚆', word: 'ரயில்', meaning: 'Train' },
];

const FAMILY_TREE = [
  { emoji: '👨', word: 'தந்தை', meaning: 'Father' },
  { emoji: '👩', word: 'தாய்', meaning: 'Mother' },
  { emoji: '👦', word: 'மூத்தவன்', meaning: 'Older brother' },
  { emoji: '👧', word: 'மூத்தவள்', meaning: 'Older sister' },
  { emoji: '👦', word: 'இளையவன்', meaning: 'Younger brother' },
];

const SCHOOL_VOCAB = [
  { emoji: '🏫', word: 'பள்ளிக்கூடம்', meaning: 'School' },
  { emoji: '🧑‍🏫', word: 'ஆசிரியர்', meaning: 'Teacher' },
  { emoji: '📖', word: 'புத்தகம்', meaning: 'Book' },
  { emoji: '👦', word: 'மாணவன்', meaning: 'Boy student' },
  { emoji: '👧', word: 'மாணவி', meaning: 'Girl student' },
];

const SHAPE_WORDS = [
  { emoji: '⚪', word: 'வட்டம்', meaning: 'Circle' },
  { emoji: '⬜', word: 'சதுரம்', meaning: 'Square' },
  { emoji: '🔺', word: 'முக்கோணம்', meaning: 'Triangle' },
];

const CLOTHES = [
  { emoji: '👕', word: 'சட்டை', meaning: 'Shirt' },
  { emoji: '👗', word: 'பாவாடை', meaning: 'Skirt' },
  { emoji: '🧵', word: 'வேட்டி', meaning: "Veshti (men's traditional wear)" },
];

const FESTIVALS = [
  { emoji: '🌾', word: 'பொங்கல்', meaning: 'Pongal — harvest festival' },
  { emoji: '🪔', word: 'தீபாவளி', meaning: 'Deepavali — festival of lights' },
];

const PROFESSIONS = [
  { emoji: '🩺', word: 'டாக்டர்', meaning: 'Doctor' },
  { emoji: '🌾', word: 'விவசாயி', meaning: 'Farmer' },
  { emoji: '👮', word: 'காவலர்', meaning: 'Police officer' },
  { emoji: '🧑‍🏫', word: 'ஆசிரியர்', meaning: 'Teacher' },
];

const DIRECTIONS = [
  { emoji: '⬅️', word: 'இடது', meaning: 'Left' },
  { emoji: '➡️', word: 'வலது', meaning: 'Right' },
  { emoji: '⬆️', word: 'நேராக', meaning: 'Straight ahead' },
];

const NUMBERS_LARGE = [
  { emoji: '1️⃣', word: 'ஒன்று', meaning: 'One (ondru)' },
  { emoji: '5️⃣', word: 'ஐந்து', meaning: 'Five (ainthu)' },
  { emoji: '🔟', word: 'பத்து', meaning: 'Ten (paththu)' },
  { emoji: '2️⃣0️⃣', word: 'இருபது', meaning: 'Twenty (irupadhu)' },
  { emoji: '💯', word: 'நூறு', meaning: 'Hundred (nooru)' },
];

const entry = (cards) => ({ Component: VocabFlashcards, props: { cards, lang: TA } });

export default {
  // Grade 1
  'tamil-1-level-3-lesson': entry(GREETINGS),
  'tamil-1-level-4-lesson': entry(NUMBERS_1_10),
  'tamil-1-level-5-lesson': entry(COLOURS_SHAPES),
  'tamil-1-level-6-lesson': entry(FAMILY_1),
  'tamil-1-level-7-lesson': entry(ANIMALS),
  'tamil-1-level-8-lesson': entry(FRUITS_FOOD),
  // Grade 2
  'tamil-2-level-2-lesson': entry(DAYS_OF_WEEK),
  'tamil-2-level-3-lesson': entry(SCHOOL_OBJECTS),
  'tamil-2-level-5-lesson': entry(WEATHER),
  'tamil-2-level-9-lesson': entry(VEHICLES_PLACES),
  'tamil-2-level-15-lesson': entry(FAMILY_TREE),
  'tamil-2-level-18-lesson': entry(SCHOOL_VOCAB),
  'tamil-2-level-21-lesson': entry(SHAPE_WORDS),
  'tamil-2-level-22-lesson': entry(CLOTHES),
  // Grade 3
  'tamil-3-level-4-lesson': entry(FESTIVALS),
  'tamil-3-level-5-lesson': entry(PROFESSIONS),
  'tamil-3-level-7-lesson': entry(DIRECTIONS),
  'tamil-3-level-13-lesson': entry(NUMBERS_LARGE),
};
