const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Groups a subject's levels into named modules/chapters based on level order.
function moduleNameForIndex(index) {
    if (index <= 2) return 'Module 1: Getting Started';
    if (index <= 5) return 'Module 2: Core Concepts';
    if (index <= 8) return 'Module 3: Skill Building';
    return 'Module 4: Mastery Challenge';
}

let updatedLevels = 0;
let updatedSubjects = 0;

dbData.grades.forEach(gradeObj => {
    gradeObj.subjects.forEach(subjectObj => {
        if (!Array.isArray(subjectObj.levels) || subjectObj.levels.length === 0) return;

        subjectObj.levels.forEach((level, idx) => {
            level.moduleName = moduleNameForIndex(idx + 1);
            updatedLevels++;
        });
        updatedSubjects++;
    });
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`Assigned modules to ${updatedLevels} levels across ${updatedSubjects} subjects.`);
