// Grade 1-3 kids are still learning to read fluently, so any longer block
// of instructional text (a game's "how to play" line, a lesson intro, etc.)
// should offer a read-aloud option instead of assuming they can read it
// themselves. gradeId is always "grade-N" (see gamesContent.js's
// GAMES_BY_GRADE keys and db.json's gradeId field) — this just extracts N.
export function gradeNumber(gradeId) {
  return parseInt(String(gradeId || '').replace(/\D/g, ''), 10) || 0;
}

export function isEarlyGrade(gradeId) {
  // Preschool is "grade-0" and belongs here too, so this can't just check
  // gradeNumber() > 0 — that's also what a missing/invalid gradeId parses
  // to, so an empty gradeId is ruled out explicitly instead.
  if (!gradeId) return false;
  return gradeNumber(gradeId) <= 3;
}
