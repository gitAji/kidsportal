const fs = require('fs');
const path = require('path');

const dbPath = path.join('/home/user/kidsportal', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const scratchDir = '/tmp/claude-0/-home-user-kidsportal/d8701608-4d4a-5b8b-b3a6-164292397e98/scratchpad/coding';

function loadContent() {
  const lo = JSON.parse(fs.readFileSync(path.join(scratchDir, 'output-coding-g1-4.json'), 'utf8'));
  const mid = JSON.parse(fs.readFileSync(path.join(scratchDir, 'output-coding-g5-8.json'), 'utf8'));
  const hi = JSON.parse(fs.readFileSync(path.join(scratchDir, 'output-coding-g9-10.json'), 'utf8'));
  return { ...lo, ...mid, ...hi };
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

// Themed module names per grade band, grounded in the real level topics for
// that band (same convention as scripts/rename_modules.js).
const moduleSets = {
  '1-4': ['Coding Foundations', 'Loops, Logic & Control', 'Block Coding with Scratch', 'Creative Coding Projects'],
  '5-8': ['Expanding Your Coding Toolkit', 'Logic, Loops & Control Flow', 'Functions, Data & Debugging', 'Coding Projects & Review'],
  '9-10': ['Python Techniques & Error Handling', 'Algorithms & Data Structures', 'Object-Oriented & Software Practices', 'Capstone Projects & Exam Prep'],
};

function bandFor(gradeNum) {
  if (gradeNum <= 4) return '1-4';
  if (gradeNum <= 8) return '5-8';
  return '9-10';
}

function moduleNameForIndex(index, band) {
  const names = moduleSets[band];
  if (index <= 2) return `Module 1: ${names[0]}`;
  if (index <= 5) return `Module 2: ${names[1]}`;
  if (index <= 8) return `Module 3: ${names[2]}`;
  return `Module 4: ${names[3]}`;
}

const content = loadContent();
let addedLevels = 0;

for (let gradeNum = 1; gradeNum <= 10; gradeNum++) {
  const gradeId = `grade-${gradeNum}`;
  const gradeKey = `grade-${gradeNum}`;
  const grade = dbData.grades.find(g => g.gradeId === gradeId);
  if (!grade) throw new Error(`Grade not found: ${gradeId}`);

  const subjectId = `coding-${gradeNum}`;
  if (grade.subjects.some(s => s.subjectId === subjectId)) {
    throw new Error(`${subjectId} already exists — refusing to overwrite`);
  }

  const gradeLevels = content[gradeKey];
  if (!gradeLevels) throw new Error(`Missing ${gradeKey} content for Coding`);
  if (gradeLevels.length !== 10) throw new Error(`${gradeKey} has ${gradeLevels.length} levels, expected 10`);

  const band = bandFor(gradeNum);
  const levels = buildLevels(subjectId, gradeLevels);
  levels.forEach((level, idx) => {
    level.moduleName = moduleNameForIndex(idx + 1, band);
  });
  addedLevels += levels.length;

  grade.subjects.push({
    subjectId,
    subjectName: 'Coding',
    levels,
  });
  console.log(`Added ${subjectId} to ${gradeId} (${levels.length} levels)`);
}

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`\nAdded Coding subject to 10 grades, ${addedLevels} total levels.`);
