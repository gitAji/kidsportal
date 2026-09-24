// src/app/components/buildLab/scienceLevels.js
// Levels for the Science Habitat Builder — sort creatures into their real habitat.

const scienceLevels = [
    {
        id: 'sl-1',
        name: 'Level 1',
        hint: 'Forest animals live among trees. Ocean animals live underwater.',
        zones: [
            { id: 'forest', label: 'Forest', emoji: '🌲' },
            { id: 'ocean', label: 'Ocean', emoji: '🌊' },
        ],
        items: [
            { id: 'bear', label: 'Bear', emoji: '🐻', correctZone: 'forest' },
            { id: 'fish', label: 'Fish', emoji: '🐟', correctZone: 'ocean' },
            { id: 'owl', label: 'Owl', emoji: '🦉', correctZone: 'forest' },
            { id: 'octopus', label: 'Octopus', emoji: '🐙', correctZone: 'ocean' },
        ],
    },
    {
        id: 'sl-2',
        name: 'Level 2',
        hint: 'Desert animals handle heat and no water. Arctic animals handle ice and snow.',
        zones: [
            { id: 'desert', label: 'Desert', emoji: '🏜️' },
            { id: 'arctic', label: 'Arctic', emoji: '❄️' },
        ],
        items: [
            { id: 'camel', label: 'Camel', emoji: '🐫', correctZone: 'desert' },
            { id: 'polarbear', label: 'Polar Bear', emoji: '🐻‍❄️', correctZone: 'arctic' },
            { id: 'scorpion', label: 'Scorpion', emoji: '🦂', correctZone: 'desert' },
            { id: 'penguin', label: 'Penguin', emoji: '🐧', correctZone: 'arctic' },
        ],
    },
    {
        id: 'sl-3',
        name: 'Level 3',
        hint: 'Three habitats now — think about where each animal actually lives.',
        zones: [
            { id: 'forest', label: 'Forest', emoji: '🌲' },
            { id: 'ocean', label: 'Ocean', emoji: '🌊' },
            { id: 'desert', label: 'Desert', emoji: '🏜️' },
        ],
        items: [
            { id: 'deer', label: 'Deer', emoji: '🦌', correctZone: 'forest' },
            { id: 'shark', label: 'Shark', emoji: '🦈', correctZone: 'ocean' },
            { id: 'lizard', label: 'Lizard', emoji: '🦎', correctZone: 'desert' },
            { id: 'squirrel', label: 'Squirrel', emoji: '🐿️', correctZone: 'forest' },
            { id: 'crab', label: 'Crab', emoji: '🦀', correctZone: 'ocean' },
            { id: 'snake', label: 'Snake', emoji: '🐍', correctZone: 'desert' },
        ],
    },
    {
        id: 'sl-4',
        name: 'Level 4',
        hint: 'Four habitats — every creature has exactly one true home here.',
        zones: [
            { id: 'forest', label: 'Forest', emoji: '🌲' },
            { id: 'ocean', label: 'Ocean', emoji: '🌊' },
            { id: 'desert', label: 'Desert', emoji: '🏜️' },
            { id: 'arctic', label: 'Arctic', emoji: '❄️' },
        ],
        items: [
            { id: 'fox', label: 'Fox', emoji: '🦊', correctZone: 'forest' },
            { id: 'whale', label: 'Whale', emoji: '🐳', correctZone: 'ocean' },
            { id: 'camel2', label: 'Camel', emoji: '🐫', correctZone: 'desert' },
            { id: 'seal', label: 'Seal', emoji: '🦭', correctZone: 'arctic' },
            { id: 'monkey', label: 'Monkey', emoji: '🐒', correctZone: 'forest' },
            { id: 'turtle', label: 'Turtle', emoji: '🐢', correctZone: 'ocean' },
            { id: 'scorpion2', label: 'Scorpion', emoji: '🦂', correctZone: 'desert' },
            { id: 'reindeer4', label: 'Reindeer', emoji: '🦌', correctZone: 'arctic' },
        ],
    },
    {
        id: 'sl-5',
        name: 'Level 5',
        hint: 'Trickier creatures this time — think about how each one really survives.',
        zones: [
            { id: 'forest', label: 'Forest', emoji: '🌲' },
            { id: 'ocean', label: 'Ocean', emoji: '🌊' },
            { id: 'desert', label: 'Desert', emoji: '🏜️' },
            { id: 'arctic', label: 'Arctic', emoji: '❄️' },
        ],
        items: [
            { id: 'bat', label: 'Bat', emoji: '🦇', correctZone: 'forest' },
            { id: 'jellyfish', label: 'Jellyfish', emoji: '🪼', correctZone: 'ocean' },
            { id: 'fennecfox', label: 'Fennec Fox', emoji: '🦊', correctZone: 'desert' },
            { id: 'arcticfox', label: 'Arctic Fox', emoji: '🐺', correctZone: 'arctic' },
            { id: 'woodpecker', label: 'Woodpecker', emoji: '🐦', correctZone: 'forest' },
            { id: 'seahorse', label: 'Seahorse', emoji: '🐠', correctZone: 'ocean' },
            { id: 'roadrunner', label: 'Roadrunner', emoji: '🦤', correctZone: 'desert' },
            { id: 'reindeer', label: 'Reindeer', emoji: '🦌', correctZone: 'arctic' },
        ],
    },
];

export default scienceLevels;
