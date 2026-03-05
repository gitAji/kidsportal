const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
});

const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKeyRaw = env.FIREBASE_ADMIN_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
    privateKeyRaw = privateKeyRaw.substring(1, privateKeyRaw.length - 1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

// ─── Helper: shuffle array ────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Helper: create options from correct answer + distractors ─────
function makeOptions(correct, distractors) {
    const pool = distractors.filter(d => d !== correct);
    const picked = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...picked]);
}

// ══════════════════════════════════════════════════════════════════
//  FULL CURRICULUM DATA — Grades 1-8, Levels 1-10
//  Each level has: lesson content, quiz questions (5), exam questions (5)
// ══════════════════════════════════════════════════════════════════

const curriculum = {
    // ──────────────────── GRADE 1 ────────────────────
    1: {
        levels: [
            {
                name: "Alphabet Adventures",
                lesson: "The English alphabet has 26 letters. Each letter has a BIG form (uppercase) like A, B, C and a small form (lowercase) like a, b, c. Let's learn to recognize them all! Uppercase letters are used at the start of sentences and for names. Lowercase letters are used everywhere else.",
                quiz: [
                    { q: "How many letters are in the English alphabet?", a: "26", d: ["24", "28", "30"] },
                    { q: "Which is the uppercase form of 'b'?", a: "B", d: ["D", "P", "G"] },
                    { q: "Which letter comes after 'C' in the alphabet?", a: "D", d: ["E", "B", "F"] },
                    { q: "Which of these is a lowercase letter?", a: "m", d: ["M", "N", "P"] },
                    { q: "What is the first letter of the alphabet?", a: "A", d: ["B", "Z", "C"] }
                ],
                exam: [
                    { q: "Which letter comes between 'F' and 'H'?", a: "G", d: ["I", "E", "J"] },
                    { q: "What is the last letter of the English alphabet?", a: "Z", d: ["Y", "X", "W"] },
                    { q: "Which is the lowercase of 'R'?", a: "r", d: ["p", "q", "s"], type: "identification" },
                    { q: "How many vowels are in the English alphabet?", a: "5", d: ["4", "6", "3"] },
                    { q: "Which letter comes before 'E'?", a: "D", d: ["F", "C", "B"] }
                ]
            },
            {
                name: "Phonics Basics",
                lesson: "Every letter makes a sound! The letter B says 'buh', C can say 'kuh' or 'sss', D says 'duh'. When we know what sound each letter makes, we can start reading words! The sounds letters make are called phonics.",
                quiz: [
                    { q: "What sound does the letter 'S' make?", a: "sss", d: ["buh", "tuh", "puh"] },
                    { q: "Which letter makes the 'mmmm' sound?", a: "M", d: ["N", "B", "P"] },
                    { q: "What letter makes the 'duh' sound?", a: "D", d: ["B", "T", "G"] },
                    { q: "Which letter says 'fff'?", a: "F", d: ["V", "P", "H"] },
                    { q: "The word 'ball' starts with which sound?", a: "buh", d: ["duh", "puh", "guh"] }
                ],
                exam: [
                    { q: "What is the first sound in the word 'cat'?", a: "kuh", d: ["sss", "tuh", "aah"] },
                    { q: "Which letter makes the 'nnn' sound?", a: "N", d: ["M", "L", "R"] },
                    { q: "Type the letter that makes the 'puh' sound.", a: "P", type: "identification" },
                    { q: "What sound does 'T' make?", a: "tuh", d: ["duh", "kuh", "puh"] },
                    { q: "The word 'go' starts with which sound?", a: "guh", d: ["juh", "kuh", "duh"] }
                ]
            },
            {
                name: "Short Vowels",
                lesson: "Vowels are special letters: A, E, I, O, U. They each have a short sound. Short A sounds like 'aah' (as in 'cat'). Short E sounds like 'eh' (as in 'bed'). Short I sounds like 'ih' (as in 'pig'). Short O sounds like 'oh' (as in 'dog'). Short U sounds like 'uh' (as in 'sun').",
                quiz: [
                    { q: "Which are the 5 vowels?", a: "A, E, I, O, U", d: ["A, B, C, D, E", "B, C, D, F, G", "A, E, I, O, Y"] },
                    { q: "What is the short vowel sound in 'cat'?", a: "a", d: ["e", "i", "o"] },
                    { q: "What vowel sound do you hear in 'bed'?", a: "e", d: ["a", "i", "u"] },
                    { q: "Which word has a short 'i' sound?", a: "pig", d: ["pie", "pea", "paw"] },
                    { q: "What vowel sound is in 'sun'?", a: "u", d: ["a", "o", "i"] }
                ],
                exam: [
                    { q: "Which word has a short 'o' sound?", a: "dog", d: ["door", "dome", "doe"] },
                    { q: "The word 'cup' has which short vowel?", a: "u", d: ["a", "o", "e"] },
                    { q: "Type the vowel you hear in the word 'hen'.", a: "e", type: "identification" },
                    { q: "Which word has a short 'a' sound?", a: "hat", d: ["hate", "hay", "haze"] },
                    { q: "How many vowels are there?", a: "5", d: ["4", "6", "7"] }
                ]
            },
            {
                name: "CVC Words",
                lesson: "CVC stands for Consonant-Vowel-Consonant. These are simple 3-letter words like CAT (C-A-T), DOG (D-O-G), and SUN (S-U-N). To read a CVC word, say each letter's sound, then blend them together quickly: c-a-t → cat!",
                quiz: [
                    { q: "What does B-A-T spell?", a: "Bat", d: ["Bit", "But", "Bot"] },
                    { q: "What does P-I-N spell?", a: "Pin", d: ["Pan", "Pen", "Pun"] },
                    { q: "Which word is a CVC word?", a: "cup", d: ["shoe", "play", "tree"] },
                    { q: "What does H-O-T spell?", a: "Hot", d: ["Hat", "Hit", "Hut"] },
                    { q: "What does M-A-P spell?", a: "Map", d: ["Mop", "Mip", "Mup"] }
                ],
                exam: [
                    { q: "What does R-U-G spell?", a: "Rug", d: ["Rig", "Rag", "Reg"] },
                    { q: "Type what D-I-G spells.", a: "Dig", type: "identification" },
                    { q: "Which is NOT a CVC word?", a: "play", d: ["cat", "dog", "sun"] },
                    { q: "What does J-A-M spell?", a: "Jam", d: ["Jim", "Jum", "Jem"] },
                    { q: "What does L-E-G spell?", a: "Leg", d: ["Log", "Lag", "Lig"] }
                ]
            },
            {
                name: "Sight Words Intro",
                lesson: "Sight words are words we see all the time in books. We learn to read them quickly just by looking! Some important sight words are: the, and, is, to, it, in, on, a, I, my. These words don't always follow phonics rules, so we memorize them.",
                quiz: [
                    { q: "Which of these is a sight word?", a: "the", d: ["cat", "dog", "run"] },
                    { q: "Fill in: I go ___ the park.", a: "to", d: ["in", "at", "by"] },
                    { q: "Which sight word means 'me'?", a: "I", d: ["My", "It", "Is"] },
                    { q: "Fill in: The cat is ___ the mat.", a: "on", d: ["up", "by", "at"] },
                    { q: "Which is a sight word?", a: "and", d: ["bed", "cup", "hat"] }
                ],
                exam: [
                    { q: "Fill in: ___ is a sunny day.", a: "It", d: ["At", "On", "Is"] },
                    { q: "Fill in: I see ___ big dog.", a: "a", d: ["is", "on", "it"] },
                    { q: "Type the sight word that joins two things (like 'cats ___ dogs').", a: "and", type: "identification" },
                    { q: "Which word completes: 'She ___ happy'?", a: "is", d: ["in", "it", "on"] },
                    { q: "Fill in: The bird is ___ the tree.", a: "in", d: ["is", "it", "at"] }
                ]
            },
            {
                name: "Rhyming Fun",
                lesson: "Words that rhyme sound the same at the END. Cat and Hat rhyme because they both end in '-at'. Sun and Bun rhyme because they end in '-un'. Rhyming helps us learn new words and is used in songs and poems!",
                quiz: [
                    { q: "Which word rhymes with 'cat'?", a: "hat", d: ["car", "cup", "cow"] },
                    { q: "Which word rhymes with 'dog'?", a: "log", d: ["dig", "dug", "den"] },
                    { q: "Which word rhymes with 'sun'?", a: "bun", d: ["sat", "sip", "sit"] },
                    { q: "Do 'bed' and 'red' rhyme?", a: "Yes", d: ["No", "Maybe", "Sometimes"] },
                    { q: "Which word rhymes with 'pig'?", a: "big", d: ["peg", "pin", "pit"] }
                ],
                exam: [
                    { q: "Which word does NOT rhyme with 'pan'?", a: "pin", d: ["can", "man", "fan"] },
                    { q: "Type a word that rhymes with 'hop'.", a: "top", type: "identification" },
                    { q: "Which pair of words rhyme?", a: "cake / lake", d: ["cake / car", "lake / lip", "make / mud"] },
                    { q: "Which word rhymes with 'king'?", a: "ring", d: ["kite", "kit", "kid"] },
                    { q: "Which word rhymes with 'blue'?", a: "shoe", d: ["blow", "black", "blot"] }
                ]
            },
            {
                name: "Beginning Blends",
                lesson: "A blend is when two consonants are put together and you can hear BOTH sounds. 'bl' as in blue, 'st' as in stop, 'gr' as in green, 'tr' as in tree. Unlike digraphs, in a blend you hear each letter's sound!",
                quiz: [
                    { q: "What blend do you hear at the start of 'blue'?", a: "bl", d: ["br", "fl", "cl"] },
                    { q: "What blend starts the word 'stop'?", a: "st", d: ["sp", "sl", "sk"] },
                    { q: "Which word starts with the blend 'gr'?", a: "green", d: ["keen", "bean", "mean"] },
                    { q: "What blend starts 'train'?", a: "tr", d: ["dr", "fr", "cr"] },
                    { q: "Which word starts with 'fl'?", a: "flag", d: ["frog", "crab", "slam"] }
                ],
                exam: [
                    { q: "What blend starts the word 'black'?", a: "bl", d: ["br", "fl", "pl"] },
                    { q: "Type the blend at the start of 'drum'.", a: "dr", type: "identification" },
                    { q: "Which word starts with 'cr'?", a: "crab", d: ["grab", "trap", "brat"] },
                    { q: "What two letters blend at the start of 'slip'?", a: "sl", d: ["sp", "sk", "sn"] },
                    { q: "Which word begins with a blend?", a: "frog", d: ["fish", "fan", "fork"] }
                ]
            },
            {
                name: "Nouns (Naming Words)",
                lesson: "A noun is a word that names a person, place, or thing. People: boy, girl, teacher. Places: school, park, home. Things: ball, book, cat. Everything around you has a name — that name is a noun!",
                quiz: [
                    { q: "Which word is a noun?", a: "dog", d: ["run", "big", "fast"] },
                    { q: "Is 'school' a person, place, or thing?", a: "Place", d: ["Person", "Thing", "Action"] },
                    { q: "Which is a noun for a person?", a: "teacher", d: ["teach", "tall", "think"] },
                    { q: "Which word names a thing?", a: "book", d: ["read", "happy", "quickly"] },
                    { q: "Is 'park' a noun?", a: "Yes", d: ["No", "Maybe", "Sometimes"] }
                ],
                exam: [
                    { q: "Which is NOT a noun?", a: "run", d: ["cat", "tree", "house"] },
                    { q: "Type a noun for a place where you learn.", a: "school", type: "identification" },
                    { q: "How many nouns are in: 'The girl eats cake'?", a: "2", d: ["1", "3", "0"] },
                    { q: "'Ball' is what kind of noun?", a: "Thing", d: ["Person", "Place", "Action"] },
                    { q: "Which is a noun?", a: "chair", d: ["sit", "tall", "very"] }
                ]
            },
            {
                name: "Action Words (Verbs)",
                lesson: "A verb is an action word — it tells us what someone DOES. Run, jump, eat, play, read, sing — these are all verbs! Every sentence needs a verb. 'The dog runs.' Here, 'runs' is the verb because it tells us what the dog does.",
                quiz: [
                    { q: "Which word is a verb?", a: "jump", d: ["ball", "big", "house"] },
                    { q: "What is the verb in 'The cat sleeps'?", a: "sleeps", d: ["The", "cat", "the"] },
                    { q: "Which is an action word?", a: "run", d: ["tree", "happy", "red"] },
                    { q: "What does a verb tell us?", a: "What someone does", d: ["A name", "A place", "A color"] },
                    { q: "Which is a verb?", a: "sing", d: ["song", "singer", "singing stage"] }
                ],
                exam: [
                    { q: "What is the verb in 'She reads a book'?", a: "reads", d: ["She", "a", "book"] },
                    { q: "Type a verb that means to move fast.", a: "run", type: "identification" },
                    { q: "Which sentence has the verb 'eats'?", a: "The boy eats lunch.", d: ["The big lunch.", "A nice boy.", "Lunch time now."] },
                    { q: "Which is NOT a verb?", a: "chair", d: ["walk", "talk", "swim"] },
                    { q: "Every sentence needs a ___.", a: "verb", d: ["number", "color", "picture"] }
                ]
            },
            {
                name: "Simple Sentences",
                lesson: "A sentence is a group of words that tells a complete thought. Every sentence starts with a CAPITAL LETTER and ends with a PERIOD (.). Example: 'The dog runs.' It has a noun (dog) and a verb (runs). That makes it a complete sentence!",
                quiz: [
                    { q: "What goes at the START of a sentence?", a: "A capital letter", d: ["A period", "A comma", "A small letter"] },
                    { q: "What goes at the END of a sentence?", a: "A period (.)", d: ["A capital letter", "A comma", "Nothing"] },
                    { q: "Which is a correct sentence?", a: "The cat sits.", d: ["the cat sits", "The cat sits", "cat sits the"] },
                    { q: "What two things does every sentence need?", a: "A noun and a verb", d: ["Two nouns", "Two verbs", "A color and a number"] },
                    { q: "Is 'Runs fast' a complete sentence?", a: "No", d: ["Yes", "Maybe", "Sometimes"] }
                ],
                exam: [
                    { q: "Fix this sentence: 'the bird flies'", a: "The bird flies.", d: ["the Bird flies.", "The bird flies", "the bird Flies."] },
                    { q: "Type the punctuation mark that ends a sentence.", a: ".", type: "identification" },
                    { q: "Which is a complete sentence?", a: "I like apples.", d: ["Like apples.", "I apples.", "Apples like."] },
                    { q: "What is wrong with: 'she is happy'?", a: "Missing capital letter", d: ["Missing verb", "Too long", "Missing noun"] },
                    { q: "How many sentences: 'I run. She jumps.'?", a: "2", d: ["1", "3", "0"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 2 ────────────────────
    2: {
        levels: [
            {
                name: "Long Vowels (Silent E)",
                lesson: "When a word ends with the letter 'E', the vowel in the middle often says its NAME instead of its sound. This is called the Magic E or Silent E! Compare: 'cap' → 'cape', 'kit' → 'kite', 'hop' → 'hope'. The E is silent but changes the vowel.",
                quiz: [
                    { q: "What happens when you add 'e' to 'cap'?", a: "It becomes 'cape'", d: ["It becomes 'cop'", "It becomes 'cup'", "Nothing changes"] },
                    { q: "In 'kite', the 'i' makes what sound?", a: "Long i (eye)", d: ["Short i (ih)", "Long e (ee)", "Short a (ah)"] },
                    { q: "Which word has a silent E?", a: "make", d: ["mat", "map", "man"] },
                    { q: "Adding 'e' to 'hop' makes it ___.", a: "hope", d: ["hoop", "hap", "hip"] },
                    { q: "The 'e' at the end of 'cake' is ___.", a: "silent", d: ["loud", "short", "missing"] }
                ],
                exam: [
                    { q: "Add silent E to 'pin'. What word do you get?", a: "pine", d: ["pane", "pone", "pune"] },
                    { q: "Type the word 'tub' with a magic E added.", a: "tube", type: "identification" },
                    { q: "Which pair shows the silent E rule?", a: "hat → hate", d: ["hat → hit", "hat → hot", "hat → hut"] },
                    { q: "In 'rose', what sound does 'o' make?", a: "Long o", d: ["Short o", "Long a", "Short e"] },
                    { q: "Which word does NOT have a silent E?", a: "dog", d: ["bone", "lake", "pine"] }
                ]
            },
            {
                name: "Consonant Digraphs",
                lesson: "A digraph is when two letters come together to make ONE new sound. 'sh' makes the sound in 'ship'. 'ch' makes the sound in 'chair'. 'th' makes the sound in 'thin'. 'wh' makes the sound in 'whale'. You can't hear the individual letters anymore!",
                quiz: [
                    { q: "What digraph is in the word 'ship'?", a: "sh", d: ["ch", "th", "wh"] },
                    { q: "Which word starts with 'ch'?", a: "chair", d: ["share", "there", "where"] },
                    { q: "What digraph starts the word 'whale'?", a: "wh", d: ["sh", "ch", "th"] },
                    { q: "'Thin' starts with which digraph?", a: "th", d: ["sh", "ch", "wh"] },
                    { q: "How many letters make up a digraph?", a: "2", d: ["1", "3", "4"] }
                ],
                exam: [
                    { q: "Which word has the 'sh' digraph?", a: "fish", d: ["fill", "fist", "fix"] },
                    { q: "Type the digraph you hear in 'church'.", a: "ch", type: "identification" },
                    { q: "Which word ends with 'th'?", a: "math", d: ["mash", "much", "march"] },
                    { q: "A digraph makes ___ sound(s).", a: "1", d: ["2", "3", "0"] },
                    { q: "Which has a digraph?", a: "shop", d: ["stop", "spot", "spin"] }
                ]
            },
            {
                name: "Vowel Teams",
                lesson: "When two vowels are together, the FIRST vowel usually says its name and the second is silent. 'ai' in rain — you hear long A. 'oa' in boat — you hear long O. 'ea' in team — you hear long E. Remember: 'When two vowels go walking, the first one does the talking!'",
                quiz: [
                    { q: "In 'rain', which vowel sound do you hear?", a: "Long a", d: ["Short a", "Long i", "Short i"] },
                    { q: "What vowel team is in 'boat'?", a: "oa", d: ["ai", "ea", "ee"] },
                    { q: "In 'team', you hear the long ___.", a: "e", d: ["a", "i", "o"] },
                    { q: "'When two vowels go walking, the ___ does the talking.'", a: "first one", d: ["second one", "last one", "middle one"] },
                    { q: "Which word has a vowel team?", a: "coat", d: ["cat", "cut", "cot"] }
                ],
                exam: [
                    { q: "What vowel team is in 'bead'?", a: "ea", d: ["ai", "oa", "ee"] },
                    { q: "Type the vowel team in the word 'tail'.", a: "ai", type: "identification" },
                    { q: "Which does NOT have a vowel team?", a: "bed", d: ["read", "boat", "sail"] },
                    { q: "In 'road', which vowel is silent?", a: "a", d: ["o", "r", "d"] },
                    { q: "Which word has the 'ee' vowel team?", a: "tree", d: ["try", "true", "tray"] }
                ]
            },
            {
                name: "Pronouns",
                lesson: "Pronouns are words that take the place of nouns so we don't have to repeat names. Instead of saying 'Maria runs. Maria is fast.' we say 'Maria runs. She is fast.' Common pronouns: I, you, he, she, it, we, they, me, him, her, us, them.",
                quiz: [
                    { q: "Which word is a pronoun?", a: "she", d: ["cat", "run", "big"] },
                    { q: "'Tom is playing. ___ likes soccer.' Which pronoun fits?", a: "He", d: ["She", "It", "They"] },
                    { q: "Which pronoun replaces 'the dogs'?", a: "They", d: ["He", "She", "It"] },
                    { q: "'I gave the book to ___.' (Anna)", a: "her", d: ["she", "he", "it"] },
                    { q: "Which is NOT a pronoun?", a: "table", d: ["he", "we", "it"] }
                ],
                exam: [
                    { q: "'The lamp is broken. ___ needs fixing.' Fill in.", a: "It", d: ["He", "She", "They"] },
                    { q: "Type the pronoun that means 'the person speaking'.", a: "I", type: "identification" },
                    { q: "Which pronoun means more than one person including yourself?", a: "We", d: ["They", "You", "I"] },
                    { q: "Replace 'Sarah and I': ___  went to the store.", a: "We", d: ["They", "Us", "She"] },
                    { q: "Which sentence uses a pronoun?", a: "She is kind.", d: ["The girl is kind.", "My dog is kind.", "A bird is kind."] }
                ]
            },
            {
                name: "Adjectives (Describing Words)",
                lesson: "Adjectives are words that DESCRIBE nouns. They tell us what something looks like, feels like, or how many there are. 'The BIG dog' — big is an adjective. 'A RED ball' — red is an adjective. 'THREE cats' — three is an adjective!",
                quiz: [
                    { q: "Which word is an adjective?", a: "tall", d: ["run", "dog", "school"] },
                    { q: "In 'the blue sky', which word is the adjective?", a: "blue", d: ["the", "sky", "in"] },
                    { q: "An adjective describes a ___.", a: "noun", d: ["verb", "sentence", "period"] },
                    { q: "Which is an adjective: 'The happy child'?", a: "happy", d: ["The", "child", "the"] },
                    { q: "Which sentence has an adjective?", a: "The soft pillow.", d: ["She runs.", "I go.", "We play."] }
                ],
                exam: [
                    { q: "Find the adjective: 'A small kitten plays.'", a: "small", d: ["kitten", "plays", "A"] },
                    { q: "Type an adjective that describes temperature when it's warm.", a: "hot", type: "identification" },
                    { q: "How many adjectives in 'The big, red ball'?", a: "2", d: ["1", "3", "0"] },
                    { q: "Which is NOT an adjective?", a: "jump", d: ["cold", "tiny", "round"] },
                    { q: "Add an adjective: 'The ___ flower is pretty.'", a: "yellow", d: ["runs", "quickly", "under"] }
                ]
            },
            {
                name: "Plural Nouns",
                lesson: "When there is MORE than one of something, we make the noun plural. Usually we add 's': cat → cats, dog → dogs. For words ending in s, x, z, ch, or sh, we add 'es': box → boxes, bus → buses, wish → wishes.",
                quiz: [
                    { q: "What is the plural of 'cat'?", a: "cats", d: ["cates", "caties", "catis"] },
                    { q: "What is the plural of 'box'?", a: "boxes", d: ["boxs", "boxies", "boxen"] },
                    { q: "How do you make most nouns plural?", a: "Add 's'", d: ["Add 'es'", "Add 'ing'", "Add 'ed'"] },
                    { q: "What is the plural of 'bus'?", a: "buses", d: ["buss", "buse", "bus's"] },
                    { q: "Which is the correct plural: wish → ___?", a: "wishes", d: ["wishs", "wishies", "wishen"] }
                ],
                exam: [
                    { q: "What is the plural of 'church'?", a: "churches", d: ["churchs", "churchies", "churchen"] },
                    { q: "Type the plural of 'dog'.", a: "dogs", type: "identification" },
                    { q: "When do we add 'es' instead of 's'?", a: "After s, x, z, ch, sh", d: ["After all letters", "After vowels", "Never"] },
                    { q: "Which plural is WRONG?", a: "foxs", d: ["cups", "beds", "pens"] },
                    { q: "What is the plural of 'glass'?", a: "glasses", d: ["glasss", "glasies", "glassen"] }
                ]
            },
            {
                name: "Punctuation Marks",
                lesson: "Punctuation marks are symbols that help us read correctly. A PERIOD (.) ends a statement: 'I like cake.' A QUESTION MARK (?) ends a question: 'Do you like cake?' An EXCLAMATION MARK (!) shows excitement or strong feeling: 'I love cake!'",
                quiz: [
                    { q: "What ends a question?", a: "?", d: [".", "!", ","] },
                    { q: "What ends a regular sentence?", a: ".", d: ["?", "!", ":"] },
                    { q: "Which shows excitement?", a: "!", d: [".", "?", ","] },
                    { q: "'How are you' needs a ___ at the end.", a: "?", d: [".", "!", ","] },
                    { q: "'I went to school' needs a ___ at the end.", a: ".", d: ["?", "!", ":"] }
                ],
                exam: [
                    { q: "'Wow that is amazing' needs a ___ at the end.", a: "!", d: [".", "?", ","] },
                    { q: "Type the punctuation mark that ends a question.", a: "?", type: "identification" },
                    { q: "Which sentence is punctuated correctly?", a: "Is it raining?", d: ["Is it raining.", "Is it raining!", "Is it raining,"] },
                    { q: "How many types of ending punctuation did we learn?", a: "3", d: ["2", "4", "1"] },
                    { q: "Which is correct?", a: "I love pizza!", d: ["I love pizza.", "I love pizza?", "I love pizza,"] }
                ]
            },
            {
                name: "Contractions",
                lesson: "A contraction puts two words together and uses an apostrophe (') where letters are removed. 'do not' becomes 'don't'. 'can not' becomes 'can't'. 'I am' becomes 'I'm'. 'she is' becomes 'she's'. The apostrophe shows where the missing letters go!",
                quiz: [
                    { q: "What is the contraction of 'do not'?", a: "don't", d: ["dont", "do'nt", "donot"] },
                    { q: "What is the contraction of 'I am'?", a: "I'm", d: ["Im", "Iam", "I'am"] },
                    { q: "What two words make 'can't'?", a: "can not", d: ["could not", "will not", "shall not"] },
                    { q: "An apostrophe takes the place of ___.", a: "missing letters", d: ["missing words", "missing sentences", "missing periods"] },
                    { q: "'She is' becomes ___.", a: "she's", d: ["shes", "she'is", "sh'es"] }
                ],
                exam: [
                    { q: "What is the contraction of 'will not'?", a: "won't", d: ["willn't", "will'nt", "wont"] },
                    { q: "Type the contraction for 'it is'.", a: "it's", type: "identification" },
                    { q: "What two words make 'we're'?", a: "we are", d: ["we were", "we will", "we have"] },
                    { q: "Which is a contraction?", a: "they're", d: ["their", "there", "them"] },
                    { q: "'He is happy' with a contraction is ___.", a: "He's happy", d: ["Hes happy", "He'is happy", "His happy"] }
                ]
            },
            {
                name: "Reading Comprehension 1",
                lesson: "When we read, we need to UNDERSTAND what the story is about. After reading, ask yourself: WHO is the story about? WHAT happened? WHERE did it happen? Let's read: 'Tom has a red ball. He plays in the park with his friend Sam.' Who? Tom and Sam. What? They play. Where? The park.",
                quiz: [
                    { q: "Read: 'Mia has a cat. The cat is black.' What color is the cat?", a: "Black", d: ["White", "Brown", "Orange"] },
                    { q: "Read: 'Ben went to the shop. He bought milk.' Where did Ben go?", a: "The shop", d: ["School", "Home", "The park"] },
                    { q: "Read: 'The dog ran in the garden.' WHO ran?", a: "The dog", d: ["The cat", "The boy", "The bird"] },
                    { q: "Read: 'Sara ate an apple.' WHAT did Sara eat?", a: "An apple", d: ["A banana", "A cake", "A cookie"] },
                    { q: "Read: 'It rained. The children went inside.' Why did they go inside?", a: "Because it rained", d: ["They were hungry", "It was bedtime", "School started"] }
                ],
                exam: [
                    { q: "Read: 'Kim and Lee went swimming. Kim swam fast. Lee swam slowly.' Who swam faster?", a: "Kim", d: ["Lee", "Both", "Neither"] },
                    { q: "Type the answer: 'The boy ate ice cream.' What did the boy eat?", a: "ice cream", type: "identification" },
                    { q: "Read: 'Dad made pancakes. We ate them for breakfast.' When did they eat pancakes?", a: "Breakfast", d: ["Lunch", "Dinner", "Snack time"] },
                    { q: "Read: 'The cat sat on the mat. It was soft.' What was soft?", a: "The mat", d: ["The cat", "The floor", "The chair"] },
                    { q: "Read: 'Ali is sad because he lost his toy.' Why is Ali sad?", a: "He lost his toy", d: ["He is tired", "He is hungry", "He fell down"] }
                ]
            },
            {
                name: "Story Sequence",
                lesson: "Every story has a BEGINNING, MIDDLE, and END. The beginning tells us who and where. The middle tells us what happens (the problem). The end tells us how it was solved. Example: Beginning: A fox was hungry. Middle: He found some grapes but couldn't reach them. End: He walked away and said they were probably sour anyway.",
                quiz: [
                    { q: "What comes first in a story?", a: "Beginning", d: ["Middle", "End", "Title"] },
                    { q: "What happens in the middle of a story?", a: "The problem or main events", d: ["The characters are introduced", "The story ends", "Nothing"] },
                    { q: "What does the end of a story tell us?", a: "How the problem was solved", d: ["Who the characters are", "Where it happens", "The title"] },
                    { q: "Put in order: Middle, End, Beginning", a: "Beginning, Middle, End", d: ["Middle, Beginning, End", "End, Middle, Beginning", "Beginning, End, Middle"] },
                    { q: "Another word for the beginning of a story is ___.", a: "introduction", d: ["conclusion", "problem", "conflict"] }
                ],
                exam: [
                    { q: "Read: '1) Tom found a puppy. 2) He fed it. 3) They became best friends.' Which is the middle?", a: "He fed it", d: ["Tom found a puppy", "They became best friends", "None"] },
                    { q: "Type which part of a story introduces the characters.", a: "beginning", type: "identification" },
                    { q: "What is usually in the end of a story?", a: "The solution or conclusion", d: ["New characters", "A new problem", "The setting"] },
                    { q: "A story has how many main parts?", a: "3", d: ["2", "4", "5"] },
                    { q: "The setting is usually introduced in the ___.", a: "beginning", d: ["middle", "end", "title"] }
                ]
            }
        ]
    }
};

// We'll add grades 3-8 from a separate data file to keep this manageable
// Load additional grades if available
try {
    const additionalGrades = require('./curriculum_grades_3_to_8.js');
    Object.assign(curriculum, additionalGrades);
    console.log("✅ Loaded grades 3-8 curriculum data.");
} catch (e) {
    console.log("⚠️  Grades 3-8 data not found. Only seeding grades 1-2.");
}

// ══════════════════════════════════════════════════════════════════
//  SEED TO FIRESTORE
// ══════════════════════════════════════════════════════════════════
async function seedToFirestore() {
    console.log("\n🎓 Beginning full English curriculum upload to Firebase...\n");
    let uploadCount = 0;
    const batchSize = 100;
    let batch = db.batch();
    let currentBatchCount = 0;

    const gradeNums = Object.keys(curriculum).map(Number).sort((a, b) => a - b);

    for (const gradeNum of gradeNums) {
        const gradeId = `grade-${gradeNum}`;
        const subjectId = `english-${gradeNum}`;
        const levels = curriculum[gradeNum].levels;

        console.log(`📚 Grade ${gradeNum}: ${levels.length} levels`);

        for (let levelNum = 1; levelNum <= levels.length; levelNum++) {
            const lvl = levels[levelNum - 1];
            const levelId = `${subjectId}-level-${levelNum}`;
            const docId = `${gradeId}_${subjectId}_${levelId}`;

            const tasks = [
                {
                    taskId: `${levelId}-lesson-1`,
                    taskName: `Learn: ${lvl.name}`,
                    type: "lesson",
                    content: lvl.lesson,
                    questions: []
                },
                {
                    taskId: `${levelId}-quiz-1`,
                    taskName: "Practice Quiz",
                    type: "quiz",
                    timeLimit: 180,
                    content: `Let's practice what we learned about ${lvl.name}!`,
                    questions: lvl.quiz.map((item, idx) => {
                        const qType = item.type || "multiple-choice";
                        const qObj = {
                            questionId: `q${idx + 1}-${levelId}`,
                            questionText: item.q,
                            correctAnswer: item.a,
                            type: qType
                        };
                        if (qType !== "identification") {
                            qObj.options = makeOptions(item.a, item.d || []);
                        }
                        return qObj;
                    })
                },
                {
                    taskId: `${levelId}-exam-1`,
                    taskName: "Level Challenge!",
                    type: "exam",
                    timeLimit: 300,
                    content: `Show what you know about ${lvl.name}!`,
                    questions: lvl.exam.map((item, idx) => {
                        const qType = item.type || "multiple-choice";
                        const qObj = {
                            questionId: `ex${idx + 1}-${levelId}`,
                            questionText: item.q,
                            correctAnswer: item.a,
                            type: qType
                        };
                        if (qType !== "identification") {
                            qObj.options = makeOptions(item.a, item.d || []);
                        }
                        return qObj;
                    })
                }
            ];

            const docData = {
                gradeId,
                subjectId,
                levelId,
                levelName: `Level ${levelNum}: ${lvl.name}`,
                isLocked: levelNum > 1,
                tasks,
                updatedAt: FieldValue.serverTimestamp()
            };

            const docRef = db.collection('levels').doc(docId);
            batch.set(docRef, docData, { merge: true });
            currentBatchCount++;
            uploadCount++;

            if (currentBatchCount >= batchSize) {
                await batch.commit();
                console.log(`   ✅ Committed batch of ${batchSize}`);
                batch = db.batch();
                currentBatchCount = 0;
            }
        }
    }

    if (currentBatchCount > 0) {
        await batch.commit();
    }

    console.log(`\n🎉 Upload complete! Pushed ${uploadCount} level modules to Firestore.\n`);
}

seedToFirestore().catch(console.error);
