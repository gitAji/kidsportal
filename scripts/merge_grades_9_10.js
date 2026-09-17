const fs = require('fs');
const path = require('path');

const dbPath = path.join('/home/user/kidsportal', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const scratchDir = '/tmp/claude-0/-home-user-kidsportal/d8701608-4d4a-5b8b-b3a6-164292397e98/scratchpad/g9-10';

const subjectMeta = {
  english: { subjectPrefix: 'english', subjectName: 'English' },
  math: { subjectPrefix: 'math', subjectName: 'Math' },
  science: { subjectPrefix: 'science', subjectName: 'Science' },
  tamil: { subjectPrefix: 'tamil', subjectName: 'Tamil' },
};

function loadContent(subjectKey) {
  return JSON.parse(fs.readFileSync(path.join(scratchDir, `output-${subjectKey}.json`), 'utf8'));
}

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
          content: "Let's practice what we just learned!",
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

const content = {};
Object.keys(subjectMeta).forEach(key => {
  content[key] = loadContent(key);
});

let createdGrades = 0;
let createdLevels = 0;

[9, 10].forEach(gradeNum => {
  const gradeId = `grade-${gradeNum}`;
  const gradeKey = `grade-${gradeNum}`;

  if (dbData.grades.some(g => g.gradeId === gradeId)) {
    throw new Error(`${gradeId} already exists in db.json — refusing to overwrite`);
  }

  const subjects = Object.entries(subjectMeta).map(([key, meta]) => {
    const subjectId = `${meta.subjectPrefix}-${gradeNum}`;
    const gradeLevels = content[key][gradeKey];
    if (!gradeLevels) throw new Error(`Missing ${gradeKey} content for subject ${key}`);
    if (gradeLevels.length !== 10) throw new Error(`${key} ${gradeKey} has ${gradeLevels.length} levels, expected 10`);

    const levels = buildLevels(subjectId, gradeLevels);
    levels.forEach((level, idx) => {
      level.moduleName = moduleNameForIndex(idx + 1);
    });
    createdLevels += levels.length;

    return {
      subjectId,
      subjectName: meta.subjectName,
      levels,
    };
  });

  dbData.grades.push({
    gradeId,
    gradeName: `Grade ${gradeNum}`,
    subjects,
  });
  createdGrades++;
  console.log(`Added ${gradeId} with ${subjects.length} subjects (${subjects.reduce((n, s) => n + s.levels.length, 0)} levels)`);
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`\nAdded ${createdGrades} grades, ${createdLevels} total levels.`);
