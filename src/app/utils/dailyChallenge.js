// Daily Challenge / Practice Arena — a short, mixed-subject quiz that
// refreshes once per day and tracks a streak. Deliberately separate from
// achievements.js/gameStats.js's curriculum and game stats so playing the
// Daily Challenge never affects a child's subject/level analytics.
import db from '../data/db.json';

const STATS_KEY = "kidsportal_daily_challenge";
export const QUESTIONS_PER_CHALLENGE = 6;

export function getTodayDateString(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Deterministic PRNG seeded from a string, so every child in the same grade
// gets the same challenge on the same day, and it's a different mix the
// next day — without needing to generate/store challenges anywhere.
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return function next() {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

function shuffle(arr, rand) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Every quiz/exam question for a grade, tagged with its subject, pulled
// from the same db.json shape used everywhere else (grades -> subjects ->
// levels -> tasks -> questions). "writing" questions are skipped — they
// need a drawing canvas, not a quick multiple-choice/typed answer.
function collectQuestionPool(gradeId) {
  const grade = db.grades.find((g) => g.gradeId === gradeId);
  if (!grade) return [];
  const pool = [];
  grade.subjects.forEach((subject) => {
    subject.levels.forEach((level) => {
      if (level.isLocked) return;
      (level.tasks || []).forEach((task) => {
        if (task.type !== 'quiz' && task.type !== 'exam') return;
        (task.questions || []).forEach((q) => {
          if (q.type === 'writing' || !q.correctAnswer) return;
          pool.push({
            ...q,
            subjectId: subject.subjectId,
            subjectName: subject.subjectName,
          });
        });
      });
    });
  });
  return pool;
}

export function getDailyChallengeQuestions(gradeId, date = new Date()) {
  const pool = collectQuestionPool(gradeId);
  if (pool.length === 0) return [];
  const seed = `${gradeId}_${getTodayDateString(date)}`;
  const rand = seededRandom(seed);
  const shuffled = shuffle(pool, rand);
  return shuffled.slice(0, Math.min(QUESTIONS_PER_CHALLENGE, shuffled.length));
}

function loadChallengeStats(childId) {
  if (typeof window === "undefined" || !childId) return {};
  try {
    const raw = localStorage.getItem(`${STATS_KEY}_${childId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChallengeStats(childId, stats) {
  if (typeof window === "undefined" || !childId) return;
  localStorage.setItem(`${STATS_KEY}_${childId}`, JSON.stringify(stats));
}

function isYesterday(dateStr, todayStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const t = new Date(todayStr + 'T00:00:00Z');
  return Math.round((t - d) / 86400000) === 1;
}

export function getDailyChallengeStats(childId) {
  const stats = loadChallengeStats(childId);
  return {
    streak: stats.streak || 0,
    bestStreak: stats.bestStreak || 0,
    lastCompletedDate: stats.lastCompletedDate || null,
    history: stats.history || [],
  };
}

export function hasCompletedToday(childId, date = new Date()) {
  const stats = loadChallengeStats(childId);
  return stats.lastCompletedDate === getTodayDateString(date);
}

// Is the streak still "alive" (completed today or yesterday), so the UI can
// show a lit vs. unlit flame instead of a stale streak number.
export function isStreakActive(stats, date = new Date()) {
  if (!stats?.lastCompletedDate) return false;
  const today = getTodayDateString(date);
  return stats.lastCompletedDate === today || isYesterday(stats.lastCompletedDate, today);
}

export function recordDailyChallengeCompletion(childId, correctCount, totalCount, date = new Date()) {
  if (!childId) return getDailyChallengeStats(childId);
  const today = getTodayDateString(date);
  const stats = loadChallengeStats(childId);

  // Already recorded today — replaying for practice shouldn't double-count
  // the streak or add a second history entry for the same day.
  if (stats.lastCompletedDate === today) {
    return getDailyChallengeStats(childId);
  }

  const continuesStreak = stats.lastCompletedDate && isYesterday(stats.lastCompletedDate, today);
  stats.streak = continuesStreak ? (stats.streak || 0) + 1 : 1;
  stats.bestStreak = Math.max(stats.bestStreak || 0, stats.streak);
  stats.lastCompletedDate = today;
  stats.history = [...(stats.history || []), { date: today, correct: correctCount, total: totalCount }].slice(-30);

  saveChallengeStats(childId, stats);
  return getDailyChallengeStats(childId);
}
