// src/app/components/buildLab/englishLevels.js
// Levels for the English Sentence Builder. Each level shows a clue (never the
// literal target sentence — that would just be copying) and the tile bank
// holds the sentence's words shuffled, plus a couple of decoy words.

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
        id: 'el-1',
        name: 'Level 1',
        clue: 'Describe a cat that feels good.',
        words: ['The', 'cat', 'is', 'happy', '.'],
        decoys: ['dog', 'sad'],
        hint: 'Start with "The" and end with a full stop.',
    },
    {
        id: 'el-2',
        name: 'Level 2',
        clue: 'Say what she enjoys doing.',
        words: ['She', 'likes', 'to', 'read', 'books', '.'],
        decoys: ['write', 'songs'],
        hint: '"She" comes first.',
    },
    {
        id: 'el-3',
        name: 'Level 3',
        clue: 'Say what your brother does, and how often.',
        words: ['My', 'brother', 'plays', 'football', 'every', 'day', '.'],
        decoys: ['sister', 'cricket'],
        hint: 'Who plays? Start with the person.',
    },
    {
        id: 'el-4',
        name: 'Level 4',
        clue: 'Two things happened, even though it rained.',
        words: ['Although', 'it', 'rained', ',', 'we', 'went', 'outside', '.'],
        decoys: ['snowed', 'stayed'],
        hint: '"Although" always starts this kind of sentence.',
    },
    {
        id: 'el-5',
        name: 'Level 5',
        clue: 'A smart fox leaps over a tired dog.',
        words: ['The', 'clever', 'fox', 'jumped', 'over', 'the', 'lazy', 'dog', '.'],
        decoys: ['sleepy', 'ran'],
        hint: 'Two animals — which one jumps, and which one is lazy?',
    },
];

const englishLevels = RAW_LEVELS.map((lvl) => ({
    id: lvl.id,
    name: lvl.name,
    prompt: lvl.clue,
    bank: shuffled([...lvl.words, ...lvl.decoys]),
    hint: lvl.hint,
    check: orderCheck([lvl.words]),
}));

export default englishLevels;
