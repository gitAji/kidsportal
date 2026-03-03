import db from '../data/db.json';

/**
 * Fetches subjects from db.json based on the child's grade,
 * filtered by the parent's chosen learning subjects.
 *
 * @param {string} gradeString - The grade string (e.g., "grade-1").
 * @param {string[]} [learningSubjects] - The parent's selected subjects (e.g., ["English", "Tamil", "Math", "Science"]).
 * @returns {Array} An array of subjects for the given grade.
 */
export function getSubjectsByGrade(gradeString, learningSubjects) {
  if (!gradeString) {
    return [];
  }

  const gradeIdToMatch = gradeString;
  const gradeData = db.grades.find(g => g.gradeId === gradeIdToMatch);

  if (!gradeData) {
    return [];
  }

  // Deduplicate by subjectName — keeps the first occurrence only
  const seen = new Set();
  let subjects = gradeData.subjects.filter(s => {
    if (seen.has(s.subjectName)) return false;
    seen.add(s.subjectName);
    return true;
  });

  // Filter by parent's selected subjects if provided
  if (learningSubjects && Array.isArray(learningSubjects) && learningSubjects.length > 0) {
    subjects = subjects.filter(s => learningSubjects.includes(s.subjectName));
  }

  return subjects;
}
