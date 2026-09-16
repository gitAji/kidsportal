const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Grades 6, 7, and 8 were seeded by cloning grade 5's subjects, but kept
// grade 5's subjectId ("english-5", "math-5", ...) instead of getting their
// own. That collides subjectId/levelId/taskId/questionId across grades,
// which can conflate progress tracking between different grades' students
// on the same task/question IDs. Re-key every ID under these subjects to
// the grade they actually belong to.
const gradesToFix = ['grade-6', 'grade-7', 'grade-8'];

function rekey(str, oldPrefix, newPrefix) {
    return str.split(oldPrefix).join(newPrefix);
}

let fixedSubjects = 0;

dbData.grades.forEach(gradeObj => {
    if (!gradesToFix.includes(gradeObj.gradeId)) return;

    const gradeNum = gradeObj.gradeId.split('-')[1];

    gradeObj.subjects.forEach(subjectObj => {
        const oldSubjectId = subjectObj.subjectId; // e.g. "math-5"
        const base = oldSubjectId.replace(/-\d+$/, ''); // e.g. "math"
        const newSubjectId = `${base}-${gradeNum}`; // e.g. "math-6"

        if (oldSubjectId === newSubjectId) return;

        // questionId uses a capitalized form of the subject ("q-Math-5-l1-1")
        // rather than the literal subjectId, so rekey both forms.
        const oldCapPrefix = `${base.charAt(0).toUpperCase()}${base.slice(1)}-${oldSubjectId.match(/-(\d+)$/)[1]}`;
        const newCapPrefix = `${base.charAt(0).toUpperCase()}${base.slice(1)}-${gradeNum}`;

        subjectObj.subjectId = newSubjectId;

        (subjectObj.levels || []).forEach(level => {
            level.levelId = rekey(level.levelId, oldSubjectId, newSubjectId);
            (level.tasks || []).forEach(task => {
                task.taskId = rekey(task.taskId, oldSubjectId, newSubjectId);
                (task.questions || []).forEach(q => {
                    q.questionId = rekey(rekey(q.questionId, oldSubjectId, newSubjectId), oldCapPrefix, newCapPrefix);
                });
            });
        });

        fixedSubjects++;
    });
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`Re-keyed ${fixedSubjects} subjects across grades 6-8 to their own subjectIds.`);
