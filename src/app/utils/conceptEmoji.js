// Keyword -> emoji lookup for early-grade (K-3) lesson flashcards, so a
// short fact gets a picture to anchor it instead of relying on reading
// alone. Keyword matches (more specific) are checked before the
// subject-wide fallback.
const KEYWORD_EMOJI = [
    [/\bsun\b/i, '☀️'],
    [/\bmoon\b/i, '🌙'],
    [/\bstars?\b/i, '⭐'],
    [/\bwater\b/i, '💧'],
    [/\brain/i, '🌧️'],
    [/\btrees?\b/i, '🌳'],
    [/\bflowers?\b/i, '🌸'],
    [/\bplants?\b/i, '🌱'],
    [/\banimals?\b/i, '🐾'],
    [/\bdogs?\b/i, '🐶'],
    [/\bcats?\b/i, '🐱'],
    [/\bfish\b/i, '🐟'],
    [/\bbirds?\b/i, '🐦'],
    [/\bapples?\b/i, '🍎'],
    [/\bfruit/i, '🍎'],
    [/\bfood\b/i, '🍽️'],
    [/\bbooks?\b/i, '📖'],
    [/\bletters?\b/i, '🔤'],
    [/\bwords?\b/i, '📝'],
    [/\bnumbers?\b/i, '🔢'],
    [/\bcount(ing)?\b/i, '🔢'],
    [/\baddition\b|\badd(ing)?\b/i, '➕'],
    [/\bsubtract(ion|ing)?\b/i, '➖'],
    [/\bshapes?\b/i, '🔺'],
    [/\bcircles?\b/i, '⭕'],
    [/\bsquares?\b/i, '🟦'],
    [/\btriangles?\b/i, '🔺'],
    [/\bcolors?\b/i, '🎨'],
    [/\bred\b/i, '🔴'],
    [/\bblue\b/i, '🔵'],
    [/\bgreen\b/i, '🟢'],
    [/\byellow\b/i, '🟡'],
    [/\bcomputers?\b/i, '💻'],
    [/\brobots?\b/i, '🤖'],
    [/\bcode\b|\bcoding\b/i, '💻'],
    [/\bhappy\b/i, '😀'],
    [/\bhome\b|\bhouse\b/i, '🏠'],
    [/\bfamily\b/i, '👨‍👩‍👧'],
    [/\bschool\b/i, '🏫'],
    [/\bfriends?\b/i, '🧑‍🤝‍🧑'],
    [/\bmusic\b/i, '🎵'],
    [/\bweather\b/i, '⛅'],
    [/\bearth\b/i, '🌍'],
    [/\bspace\b/i, '🚀'],
];

const SUBJECT_DEFAULT_EMOJI = [
    [/math/i, '🔢'],
    [/science/i, '🔬'],
    [/computer.?science/i, '💻'],
    [/coding/i, '💻'],
    [/tamil/i, '🔤'],
    [/english/i, '📖'],
];

export function getConceptEmoji(text, subjectId) {
    const keywordMatch = KEYWORD_EMOJI.find(([re]) => re.test(text || ''));
    if (keywordMatch) return keywordMatch[1];

    const subjectMatch = SUBJECT_DEFAULT_EMOJI.find(([re]) => re.test(subjectId || ''));
    if (subjectMatch) return subjectMatch[1];

    return '✨';
}
