const fs = require('fs');
const path = require('path');

const dbPath = path.join('/home/user/kidsportal', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Module names per subject family, grouped by grade band, replacing the
// generic "Module 1: Getting Started" etc. with names that reflect what's
// actually taught in that band of levels (grounded in the real level
// titles already in db.json).
const moduleSets = {
  english: {
    '1-4': ['Reading & Phonics Foundations', 'Grammar & Sentence Building', 'Writing in Different Forms', 'Poetry & Review'],
    '5-8': ['Reading & Critical Analysis', 'Grammar, Style & Sentence Craft', 'Creative & Persuasive Writing', 'Poetry, Spoken Language & Exam Skills'],
    '9-10': ['GCSE Reading: Non-Fiction & Fiction', 'GCSE Writing Skills', 'Literature: Prose & Shakespeare', 'Poetry & Exam Technique'],
  },
  math: {
    '1-4': ['Number & Place Value', 'Fractions, Money & Measurement', 'Shape, Time & Position', 'Data & Problem Solving'],
    '5-8': ['Number & Algebra Foundations', 'Fractions, Ratio & Proportion', 'Geometry, Data & Probability', 'Equations, Graphs & GCSE Foundations'],
    '9-10': ['Number & Algebra', 'Geometry & Trigonometry', 'Statistics & Probability', 'Functions, Vectors & Exam Practice'],
  },
  science: {
    '1-4': ['Living Things & Habitats', 'Materials & Scientific Enquiry', 'Seasons, Habitats & Change', 'Enquiry Project & Review'],
    '5-8': ['Biology Foundations', 'Chemistry: Matter & Reactions', 'Physics: Forces & Energy', 'Working Scientifically & GCSE Foundations'],
    '9-10': ['Biology: Cells & Systems', 'Chemistry: Structure & Reactions', 'Physics: Energy & Forces', 'Practical Skills & Exam Revision'],
  },
  // ariviyal (Tamil-medium science, grades 1-4 only) mirrors science content 1:1
  ariviyal: {
    '1-4': ['Living Things & Habitats', 'Materials & Scientific Enquiry', 'Seasons, Habitats & Change', 'Enquiry Project & Review'],
  },
  tamil: {
    '1-4': ['Tamil Alphabet & Greetings', 'Everyday Words & Family', 'Nature, Food & Rhymes', 'Foundations Review'],
    '5-8': ['Grammar & Language Skills', 'Classical Literature & History', 'Essay Writing & Debate', 'Literary Criticism & Capstone'],
    '9-10': ['Advanced Grammar & Classical Roots', 'Modern Tamil Literature & History', 'Writing, Translation & Oratory', 'Capstone Project & Exam Preparation'],
  },
  computerscience: {
    '1-4': ['Computer Basics & Online Safety', 'Algorithms & Coding Concepts', 'Data, Software & the Internet', 'Creative Projects & Review'],
    '5-8': ['Program Design & Networks', 'Python Programming', 'Data, Hardware & Systems', 'Cyber Security & GCSE Readiness'],
    '9-10': ['Algorithms & Programming', 'Data Representation & Systems', 'Networks & Cyber Security', 'Databases & Exam Revision'],
  },
};

function bandFor(gradeNum) {
  if (gradeNum <= 4) return '1-4';
  if (gradeNum <= 8) return '5-8';
  return '9-10';
}

// Same 2/3/3/2 level grouping used when these levels were first built.
function moduleIndexForLevel(levelIndex) {
  if (levelIndex <= 2) return 0;
  if (levelIndex <= 5) return 1;
  if (levelIndex <= 8) return 2;
  return 3;
}

let updatedLevels = 0;
let skippedSubjects = [];

dbData.grades.forEach(gradeObj => {
  const gradeNum = parseInt(gradeObj.gradeId.split('-')[1], 10);
  const band = bandFor(gradeNum);

  gradeObj.subjects.forEach(subjectObj => {
    const base = subjectObj.subjectId.replace(/-\d+$/, '');
    const familySets = moduleSets[base];
    const names = familySets && familySets[band];

    if (!names) {
      skippedSubjects.push(`${gradeObj.gradeId}/${subjectObj.subjectId}`);
      return;
    }

    subjectObj.levels.forEach((level, idx) => {
      const levelIndex = idx + 1;
      const mIdx = moduleIndexForLevel(levelIndex);
      const newName = `Module ${mIdx + 1}: ${names[mIdx]}`;
      if (level.moduleName !== newName) {
        level.moduleName = newName;
        updatedLevels++;
      }
    });
  });
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`Renamed modules on ${updatedLevels} levels.`);
if (skippedSubjects.length) {
  console.log(`Skipped (no module set defined) — ${skippedSubjects.length}:`, skippedSubjects.slice(0, 20));
} else {
  console.log('No subjects skipped — every subject/grade had a matching module set.');
}
