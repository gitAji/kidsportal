// Shared helpers for turning a child's raw completed-task list into real
// curriculum progress (levels/modules completed), so every parent-facing
// view (dashboard cards, analytics summary, full report) computes the same
// numbers from the same source of truth instead of duplicating the logic.
import { getSubjectsByGrade } from './learningData';

export function deriveGradeId(child) {
  if (!child?.grade) return child?.gradeId || null;
  const gradeNum = parseInt(String(child.grade).replace('Grade ', ''), 10);
  return !isNaN(gradeNum) ? `grade-${gradeNum}` : String(child.grade).toLowerCase().replace(' ', '-');
}

/**
 * Computes real level/module completion for a child from db.json's curriculum
 * structure, cross-referenced against the task IDs the child has actually
 * completed (stats.completedTasks_list, synced from Firestore on every task
 * completion).
 *
 * @param {object} child - child doc data (needs `grade`)
 * @param {string[]} learningSubjects - the parent's chosen subjects (display names)
 * @param {Set<string>} completedTaskIds - set of completed taskIds for this child
 */
export function computeLevelProgress(child, learningSubjects, completedTaskIds) {
  const gradeId = deriveGradeId(child);
  const subjects = gradeId ? getSubjectsByGrade(gradeId, learningSubjects) : [];

  const subjectReports = subjects.map((subject) => {
    const levels = (subject.levels || []).map((level) => {
      const tasks = level.tasks || [];
      const totalTasks = tasks.length;
      const completedCount = tasks.filter((t) => completedTaskIds.has(t.taskId)).length;
      const isCompleted = totalTasks > 0 && completedCount === totalTasks;
      return {
        levelId: level.levelId,
        levelName: level.levelName,
        moduleName: level.moduleName || 'Levels',
        totalTasks,
        completedCount,
        isCompleted,
      };
    });

    const totalLevels = levels.length;
    const completedLevels = levels.filter((l) => l.isCompleted).length;
    const pct = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

    return {
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      totalLevels,
      completedLevels,
      pct,
      levels,
    };
  });

  const totalLevels = subjectReports.reduce((n, s) => n + s.totalLevels, 0);
  const completedLevels = subjectReports.reduce((n, s) => n + s.completedLevels, 0);
  const pct = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  return { subjectReports, totalLevels, completedLevels, pct };
}
