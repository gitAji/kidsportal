// Lightweight, self-contained stats for the Games section — separate from
// curriculum task completion (achievements.js) so playing a game never
// affects a child's subject/level analytics that parents see.
const GAME_STATS_KEY = "kidsportal_game_stats";

export function loadGameStats(childId) {
  if (typeof window === "undefined" || !childId) return {};
  try {
    const raw = localStorage.getItem(`${GAME_STATS_KEY}_${childId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGameStats(childId, stats) {
  if (typeof window === "undefined" || !childId) return;
  localStorage.setItem(`${GAME_STATS_KEY}_${childId}`, JSON.stringify(stats));
}

/**
 * Record a finished play of a game. Keeps the best (highest) star result
 * per game and a running total of plays/stars for a simple "Games" summary.
 */
export function recordGamePlay(childId, gameId, stars) {
  if (!childId || !gameId) return {};
  const stats = loadGameStats(childId);
  if (!stats.bestStars) stats.bestStars = {};
  stats.bestStars[gameId] = Math.max(stats.bestStars[gameId] || 0, stars);
  stats.totalPlays = (stats.totalPlays || 0) + 1;
  stats.totalStarsEarned = (stats.totalStarsEarned || 0) + stars;
  saveGameStats(childId, stats);
  return stats;
}

/**
 * Has this child completed at least one lesson task in the given subject?
 * Reads the existing curriculum completion list (achievements.js) so a
 * game only unlocks after the related subject's lesson has been finished —
 * this never writes to that list, only reads it.
 */
export function hasCompletedLessonInSubject(completedTasksList, dbData, gradeId, subjectId) {
  if (!completedTasksList || !dbData) return false;
  const grade = dbData.grades.find(g => g.gradeId === gradeId);
  const subject = grade?.subjects?.find(s => s.subjectId === subjectId);
  if (!subject) return false;
  const lessonTaskIds = subject.levels.flatMap(level =>
    (level.tasks || []).filter(t => t.type === 'lesson').map(t => t.taskId)
  );
  return lessonTaskIds.some(id => completedTasksList.includes(id));
}
