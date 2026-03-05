// Achievement definitions — each has a unique id, name, description, emoji sticker,
// colour, and a condition function that receives the player's stats object.
export const ACHIEVEMENTS = [
    // ── Score-based ─────────────────────────────────────────────────────────────
    {
        id: "first_star",
        name: "First Star!",
        description: "Complete your very first task.",
        emoji: "⭐",
        color: "from-yellow-300 to-amber-400",
        border: "border-amber-300",
        condition: (stats) => stats.totalTasksCompleted >= 1,
    },
    {
        id: "perfect_score",
        name: "Perfect Score!",
        description: "Answer all questions correctly in one task.",
        emoji: "💯",
        color: "from-green-300 to-emerald-500",
        border: "border-emerald-300",
        condition: (stats) => stats.lastTaskPerfect === true,
    },
    {
        id: "speed_demon",
        name: "Speed Demon!",
        description: "Complete a timed quiz in under 60 seconds.",
        emoji: "⚡",
        color: "from-blue-300 to-indigo-500",
        border: "border-indigo-300",
        condition: (stats) => stats.fastestQuizTime > 0 && stats.fastestQuizTime <= 60,
    },
    {
        id: "hat_trick",
        name: "Hat Trick!",
        description: "Complete 3 tasks in a row.",
        emoji: "🎩",
        color: "from-cyan-300 to-cyan-600",
        border: "border-cyan-300",
        condition: (stats) => stats.totalTasksCompleted >= 3,
    },
    {
        id: "gold_medal",
        name: "Gold Medal",
        description: "Earn your very first gold medal by scoring 100%.",
        emoji: "🏆",
        color: "from-yellow-400 to-orange-400",
        border: "border-yellow-300",
        condition: (stats) => stats.goldMedals >= 1,
    },
    {
        id: "silver_medal",
        name: "Silver Medal",
        description: "Earn your first silver medal (75%+ score).",
        emoji: "🥈",
        color: "from-slate-300 to-slate-500",
        border: "border-slate-300",
        condition: (stats) => stats.silverMedals >= 1,
    },
    {
        id: "bronze_medal",
        name: "Bronze Medal",
        description: "Earn your first bronze medal (50%+ score).",
        emoji: "🥉",
        color: "from-orange-300 to-orange-500",
        border: "border-orange-300",
        condition: (stats) => stats.bronzeMedals >= 1,
    },
    // ── Level milestones ─────────────────────────────────────────────────────────
    {
        id: "level_5",
        name: "Level 5 Hero",
        description: "Complete 5 different levels.",
        emoji: "🦸",
        color: "from-teal-300 to-rose-500",
        border: "border-rose-300",
        condition: (stats) => stats.uniqueLevelsCompleted >= 5,
    },
    {
        id: "level_10",
        name: "Level 10 Legend",
        description: "Complete all 10 levels in any subject!",
        emoji: "🌟",
        color: "from-cyan-300 to-sky-500",
        border: "border-sky-300",
        condition: (stats) => stats.uniqueLevelsCompleted >= 10,
    },
    {
        id: "multi_subject",
        name: "Explorer",
        description: "Try tasks in 2 different subjects.",
        emoji: "🗺️",
        color: "from-teal-300 to-teal-600",
        border: "border-teal-300",
        condition: (stats) => stats.subjectsExplored >= 2,
    },
    // ── Perseverance ─────────────────────────────────────────────────────────────
    {
        id: "never_give_up",
        name: "Never Give Up!",
        description: "Retry a task after getting a wrong answer.",
        emoji: "💪",
        color: "from-red-300 to-red-500",
        border: "border-red-300",
        condition: (stats) => stats.retries >= 1,
    },
    {
        id: "bookworm",
        name: "Bookworm",
        description: "Complete 5 lesson tasks.",
        emoji: "📚",
        color: "from-lime-300 to-lime-500",
        border: "border-lime-300",
        condition: (stats) => stats.lessonsCompleted >= 5,
    },
    {
        id: "quiz_master",
        name: "Quiz Master",
        description: "Complete 5 quiz tasks.",
        emoji: "🧠",
        color: "from-blue-300 to-blue-600",
        border: "border-blue-300",
        condition: (stats) => stats.quizzesCompleted >= 5,
    },
    {
        id: "daily_streak",
        name: "Daily Streak 🔥",
        description: "Learn on 3 different days.",
        emoji: "🔥",
        color: "from-orange-400 to-red-500",
        border: "border-orange-300",
        condition: (stats) => stats.uniqueDays >= 3,
    },
    {
        id: "top_scorer",
        name: "Top Scorer!",
        description: "Accumulate a total score of 500 points.",
        emoji: "🎯",
        color: "from-fuchsia-300 to-fuchsia-600",
        border: "border-fuchsia-300",
        condition: (stats) => stats.totalScore >= 500,
    },
];

const STORAGE_KEY = "kidsportal_achievements";
const STATS_KEY = "kidsportal_stats";

// ── Stats helpers ────────────────────────────────────────────────────────────

export function loadStats(childId) {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(`${STATS_KEY}_${childId}`);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveStats(childId, stats) {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${STATS_KEY}_${childId}`, JSON.stringify(stats));
}

/**
 * Call after a task is completed.
 * taskResult = { type, score, totalQuestions, correct, timeTaken, levelId, subjectId, retried }
 */
export function recordTaskCompletion(childId, taskResult) {
    const stats = loadStats(childId);
    const pct = taskResult.correct / taskResult.totalQuestions;

    // Basic counters
    stats.totalTasksCompleted = (stats.totalTasksCompleted || 0) + 1;
    stats.totalScore = (stats.totalScore || 0) + (taskResult.score || 0);
    stats.totalTimeTaken = (stats.totalTimeTaken || 0) + (taskResult.timeTaken || 0);
    stats.lastTaskPerfect = pct === 1;

    // Medal tracking (exams and quizzes)
    if (taskResult.type === "exam" || taskResult.type === "quiz") {
        if (pct === 1) stats.goldMedals = (stats.goldMedals || 0) + 1;
        else if (pct >= 0.75) stats.silverMedals = (stats.silverMedals || 0) + 1;
        else if (pct >= 0.5) stats.bronzeMedals = (stats.bronzeMedals || 0) + 1;
    }

    // Lesson / quiz counters
    if (taskResult.type === "lesson") stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1;
    if (taskResult.type === "quiz") stats.quizzesCompleted = (stats.quizzesCompleted || 0) + 1;

    // Fastest quiz time
    if (taskResult.type === "quiz" && taskResult.timeTaken > 0) {
        if (!stats.fastestQuizTime || taskResult.timeTaken < stats.fastestQuizTime) {
            stats.fastestQuizTime = taskResult.timeTaken;
        }
    }

    // Unique levels
    const levelsSet = new Set(stats.levelsCompleted || []);
    levelsSet.add(taskResult.levelId);
    stats.levelsCompleted = [...levelsSet];
    stats.uniqueLevelsCompleted = levelsSet.size;

    // Subjects explored
    const subjectsSet = new Set(stats.subjectsExplored_list || []);
    subjectsSet.add(taskResult.subjectId);
    stats.subjectsExplored_list = [...subjectsSet];
    stats.subjectsExplored = subjectsSet.size;

    // Retries
    if (taskResult.retried) stats.retries = (stats.retries || 0) + 1;

    // Completed specific tasks
    if (taskResult.taskId) {
        const tasksSet = new Set(stats.completedTasks_list || []);
        tasksSet.add(taskResult.taskId);
        stats.completedTasks_list = [...tasksSet];
    }

    // Daily streak — track dates
    const today = new Date().toDateString();
    const daysSet = new Set(stats.uniqueDays_list || []);
    daysSet.add(today);
    stats.uniqueDays_list = [...daysSet];
    stats.uniqueDays = daysSet.size;

    saveStats(childId, stats);
    return stats;
}

// ── Achievement helpers ──────────────────────────────────────────────────────

export function loadUnlockedAchievements(childId) {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY}_${childId}`);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveUnlockedAchievements(childId, unlocked) {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${STORAGE_KEY}_${childId}`, JSON.stringify(unlocked));
}

/**
 * Check all achievements against current stats.
 * Returns array of NEWLY unlocked achievement objects.
 */
export function checkAchievements(childId, stats) {
    const already = new Set(loadUnlockedAchievements(childId));
    const newlyUnlocked = [];

    for (const ach of ACHIEVEMENTS) {
        if (!already.has(ach.id) && ach.condition(stats)) {
            already.add(ach.id);
            newlyUnlocked.push(ach);
        }
    }

    if (newlyUnlocked.length > 0) {
        saveUnlockedAchievements(childId, [...already]);
    }

    return newlyUnlocked;
}
