import db from '../data/db.json';

/**
 * Fetches subjects from db.json based on the child's grade.
 * @param {string} gradeString - The grade string from Firebase (e.g., "Grade 1").
 * @returns {Array} An array of subjects for the given grade.
 */
export function getSubjectsByGrade(gradeString) {
  console.log("getSubjectsByGrade: received gradeString", gradeString);
  if (!gradeString) {
    console.warn("getSubjectsByGrade: gradeString is undefined or null.");
    return [];
  }

  // gradeString is already in "grade-X" format from ChildProvider
  const gradeIdToMatch = gradeString;
  console.log("learningData: gradeIdToMatch", gradeIdToMatch);

  const gradeData = db.grades.find(g => g.gradeId === gradeIdToMatch);

  if (gradeData) {
    console.log("learningData: Found grade data:", gradeData);
    return gradeData.subjects;
  } else {
    console.log("learningData: No grade data found for gradeId:", gradeIdToMatch);
    return [];
  }
}
