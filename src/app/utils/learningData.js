import db from '../data/db.json';

/**
 * Fetches subjects from db.json based on the child's grade.
 * @param {string} gradeString - The grade string from Firebase (e.g., "Grade 1").
 * @returns {Array} An array of subjects for the given grade.
 */
export function getSubjectsByGrade(gradeString) {
  if (!gradeString) {
    return [];
  }

  // gradeString is already in "grade-X" format from ChildProvider
  const gradeIdToMatch = gradeString;

  const gradeData = db.grades.find(g => g.gradeId === gradeIdToMatch);

  if (gradeData) {
    // Deduplicate by subjectName — keeps the first occurrence only
    const seen = new Set();
    return gradeData.subjects.filter(s => {
      if (seen.has(s.subjectName)) return false;
      seen.add(s.subjectName);
      return true;
    });
  } else {
    return [];
  }
}

