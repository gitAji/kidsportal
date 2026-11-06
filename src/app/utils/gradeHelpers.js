// Grade 1-3 kids are still learning to read fluently, so any longer block
// of instructional text (a game's "how to play" line, a lesson intro, etc.)
// should offer a read-aloud option instead of assuming they can read it
// themselves. gradeId is always "grade-N" (see gamesContent.js's
// GAMES_BY_GRADE keys and db.json's gradeId field) — this just extracts N.
export function gradeNumber(gradeId) {
  return parseInt(String(gradeId || '').replace(/\D/g, ''), 10) || 0;
}

export function isEarlyGrade(gradeId) {
  const n = gradeNumber(gradeId);
  return n > 0 && n <= 3;
}
