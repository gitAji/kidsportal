const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const scratchDir = '/tmp/claude-0/-home-user-kidsportal/d8701608-4d4a-5b8b-b3a6-164292397e98/scratchpad/ukcontent';

function loadMerged(subject) {
    const lo = JSON.parse(fs.readFileSync(path.join(scratchDir, `output-${subject}-g1-4.json`), 'utf8'));
    const hi = JSON.parse(fs.readFileSync(path.join(scratchDir, `output-${subject}-g5-8.json`), 'utf8'));
    return { ...lo, ...hi };
}

// Maps a subjectId's base (e.g. "math" from "math-3") to the UK content key.
const content = {
    english: loadMerged('english'),
    math: loadMerged('maths'),
    science: loadMerged('science'),
    tamil: loadMerged('tamil'),
};

function buildLevels(subjectId, gradeLevels) {
    return gradeLevels.map(level => {
        const i = level.levelIndex;
        const mkQuestions = (items, prefix) => items.map((q, idx) => {
            const base = {
                questionId: `${subjectId}-level-${i}-${prefix}-q${idx + 1}`,
                questionText: q.questionText,
                correctAnswer: q.correctAnswer,
                type: q.type,
            };
            if (q.type === 'multiple-choice') base.options = q.options;
            return base;
        });

        return {
            levelId: `${subjectId}-level-${i}`,
            levelName: level.levelName,
            isLocked: false,
            tasks: [
                {
                    taskId: `${subjectId}-level-${i}-lesson`,
                    taskName: `Lesson: ${level.levelName}`,
                    type: 'lesson',
                    content: level.lesson,
                    questions: [],
                },
                {
                    taskId: `${subjectId}-level-${i}-quiz`,
                    taskName: 'Practice Quiz',
                    type: 'quiz',
                    timeLimit: 180,
                    content: `Let's practice what we just learned!`,
                    questions: mkQuestions(level.quiz, 'quiz'),
                },
                {
                    taskId: `${subjectId}-level-${i}-exam`,
                    taskName: 'Level Challenge!',
                    type: 'exam',
                    timeLimit: 300,
                    content: 'Time to show what you know!',
                    questions: mkQuestions(level.exam, 'exam'),
                },
            ],
        };
    });
}

function moduleNameForIndex(index) {
    if (index <= 2) return 'Module 1: Getting Started';
    if (index <= 5) return 'Module 2: Core Concepts';
    if (index <= 8) return 'Module 3: Skill Building';
    return 'Module 4: Mastery Challenge';
}

let updatedSubjects = 0;
let updatedLevels = 0;

dbData.grades.forEach(gradeObj => {
    const gradeNum = gradeObj.gradeId.split('-')[1];

    gradeObj.subjects.forEach(subjectObj => {
        const subjectId = subjectObj.subjectId; // e.g. "math-3"
        const base = subjectId.replace(/-\d+$/, ''); // e.g. "math"

        // "ariviyal" is the Tamil-medium science track (grades 1-4 only) and
        // has no dedicated content team; it mirrors the "science" content.
        const contentKey = base === 'ariviyal' ? 'science' : base;
        const subjectContent = content[contentKey];
        if (!subjectContent) return;

        const gradeLevels = subjectContent[`grade-${gradeNum}`];
        if (!gradeLevels) return;

        const newLevels = buildLevels(subjectId, gradeLevels);
        newLevels.forEach((level, idx) => {
            level.moduleName = moduleNameForIndex(idx + 1);
        });

        subjectObj.levels = newLevels;
        updatedSubjects++;
        updatedLevels += newLevels.length;
    });
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`Merged UK-syllabus-aligned content into ${updatedSubjects} subjects (${updatedLevels} levels).`);
