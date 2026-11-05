// Scans a child's recent quiz/exam history for individual questions they're
// still getting wrong, and surfaces the most frequently missed ones as
// "weak spots" — the data behind the spaced-review prompt shown on the
// Learning Zone home screen. A question only counts as a weak spot if the
// child's MOST RECENT attempt at it was wrong — once they get it right, it
// drops off the list instead of nagging them about something they already
// fixed.
import { getChildTaskHistory } from './firestoreService';

export async function getWeakSpots(childId, { maxHistoryDocs = 60, maxItems = 6 } = {}) {
    if (!childId) return [];

    let historyDocs = [];
    try {
        // Newest first (orderBy('timestamp', 'desc')) — both across docs and,
        // since sessionHistory is built by prepending each answer, within a
        // single doc's history[] too. That ordering is what lets a single
        // pass below find each question's most recent attempt first.
        historyDocs = await getChildTaskHistory(childId, maxHistoryDocs);
    } catch {
        return [];
    }

    const latestByQuestion = new Map();
    const missCounts = new Map();

    for (const doc of historyDocs) {
        const items = doc.history || [];
        for (const item of items) {
            if (!item?.question) continue;
            const key = `${doc.subjectId}|${doc.levelId}|${item.question}`;

            if (item.isCorrect === false) {
                missCounts.set(key, (missCounts.get(key) || 0) + 1);
            }

            // First time we see a key is its most recent attempt, since both
            // docs and within-doc items are ordered newest-first.
            if (!latestByQuestion.has(key)) {
                latestByQuestion.set(key, {
                    key,
                    subjectId: doc.subjectId,
                    levelId: doc.levelId,
                    taskId: doc.taskId,
                    taskName: doc.taskName,
                    question: item.question,
                    correctAnswer: item.correctAnswer,
                    type: item.type,
                    mostRecentlyCorrect: item.isCorrect !== false,
                });
            }
        }
    }

    return [...latestByQuestion.values()]
        .filter(entry => !entry.mostRecentlyCorrect)
        .map(entry => ({ ...entry, missCount: missCounts.get(entry.key) || 1 }))
        .sort((a, b) => b.missCount - a.missCount)
        .slice(0, maxItems);
}
