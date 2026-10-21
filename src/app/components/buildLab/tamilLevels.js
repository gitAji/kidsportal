// src/app/components/buildLab/tamilLevels.js
// Levels for the Tamil Sentence Builder. Simple, standard subject-object-verb
// Tamil sentences — the clue is given in English, the tiles and answer are
// in Tamil script, reinforcing that Tamil word order differs from English.

function shuffled(words) {
    const arr = [...words];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function sameOrder(tiles, words) {
    return tiles.length === words.length && tiles.every((t, i) => t === words[i]);
}

function orderCheck(solutions) {
    return (tiles) => solutions.some((sol) => sameOrder(tiles, sol));
}

const RAW_LEVELS = [
    {
        id: 'tl-1',
        name: 'Level 1',
        clue: 'Say: "I am going to school."',
        words: ['நான்', 'பள்ளிக்கு', 'செல்கிறேன்', '.'],
        decoys: ['வீட்டிற்கு', 'வருகிறேன்'],
        hint: 'Tamil sentences end with the verb — "செல்கிறேன்" (going) comes last.',
    },
    {
        id: 'tl-2',
        name: 'Level 2',
        clue: 'Say: "She reads a book."',
        words: ['அவள்', 'புத்தகம்', 'படிக்கிறாள்', '.'],
        decoys: ['பேனா', 'எழுதுகிறாள்'],
        hint: 'Who, then what, then the action word last.',
    },
    {
        id: 'tl-3',
        name: 'Level 3',
        clue: 'Say: "The dog runs fast."',
        words: ['நாய்', 'வேகமாக', 'ஓடுகிறது', '.'],
        decoys: ['பூனை', 'மெதுவாக'],
        hint: '"வேகமாக" means fast — it comes before the action.',
    },
    {
        id: 'tl-4',
        name: 'Level 4',
        clue: 'Say: "I like mangoes."',
        words: ['எனக்கு', 'மாம்பழம்', 'பிடிக்கும்', '.'],
        decoys: ['வாழைப்பழம்', 'பிடிக்காது'],
        hint: '"எனக்கு" (to me) starts this kind of sentence.',
    },
    {
        id: 'tl-5',
        name: 'Level 5',
        clue: 'Say: "Children play in the park."',
        words: ['குழந்தைகள்', 'பூங்காவில்', 'விளையாடுகின்றனர்', '.'],
        decoys: ['வீட்டில்', 'படிக்கின்றனர்'],
        hint: 'Who, then where, then the action last.',
    },
];

const tamilLevels = RAW_LEVELS.map((lvl) => ({
    id: lvl.id,
    name: lvl.name,
    prompt: lvl.clue,
    bank: shuffled([...lvl.words, ...lvl.decoys]),
    hint: lvl.hint,
    check: orderCheck([lvl.words]),
}));

export default tamilLevels;
