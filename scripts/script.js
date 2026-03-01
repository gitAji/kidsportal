const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
let dbData = {};

try {
    dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (error) {
    console.error("Could not read db.json, generating a robust foundation...");
    dbData = { grades: [] };
}

// Ensure the dbData has grades 1-5
const gradesInit = ["grade-1", "grade-2", "grade-3", "grade-4", "grade-5"];
const subjectsInit = ["english", "math", "science", "tamil"];

gradesInit.forEach((gId, i) => {
    let gradeObj = dbData.grades.find(g => g.gradeId === gId);
    if (!gradeObj) {
        gradeObj = { gradeId: gId, gradeName: `Grade ${i + 1}`, subjects: [] };
        dbData.grades.push(gradeObj);
    }

    subjectsInit.forEach(sId => {
        const fullId = `${sId}-${i + 1}`;
        let subjectObj = gradeObj.subjects.find(s => s.subjectId === fullId);
        if (!subjectObj) {
            subjectObj = {
                subjectId: fullId,
                subjectName: sId.charAt(0).toUpperCase() + sId.slice(1),
                levels: []
            };
            gradeObj.subjects.push(subjectObj);
        }
    });
});

// A multi-modal question generator helper to ensure UI handles various structures (Checking answers, final whistles, multiple choices, text input)
const generateDynamicQuestions = (level, grade, subject) => {
    const questions = [];

    // 1. Multiple Choice (Standard Text)
    questions.push({
        questionId: `q-${subject}-${grade}-l${level}-1`,
        questionText: `Which of these relates to ${subject} Level ${level}?`,
        options: ["Alpha", "Beta", "Correct Pick", "Delta"],
        correctAnswer: "Correct Pick",
        type: "multiple-choice"
    });

    // 2. Identification (Text Input for typing)
    questions.push({
        questionId: `q-${subject}-${grade}-l${level}-2`,
        questionText: `Type the exact word for this concept: 'Growth'`,
        correctAnswer: "Growth",
        type: "identification"
    });

    // 3. True/False (Binary choice)
    questions.push({
        questionId: `q-${subject}-${grade}-l${level}-3`,
        questionText: `Is it true that Level ${level} is fun?`,
        options: ["True", "False"],
        correctAnswer: "True",
        type: "multiple-choice"
    });

    // 4. Fill in the blank (Typing)
    questions.push({
        questionId: `q-${subject}-${grade}-l${level}-4`,
        questionText: `Fill in the blank: The sun is very ___.`,
        correctAnswer: "hot",
        type: "identification"
    });

    return questions;
};

// Populate the Database Levels and Tasks
dbData.grades.forEach((gradeObj, gIndex) => {
    const gradeNum = gIndex + 1;

    gradeObj.subjects.forEach(subjectObj => {
        const newLevels = [];
        const subName = subjectObj.subjectName;

        // We keep levels 1 to 10 for every subject
        for (let i = 1; i <= 10; i++) {

            const tasks = [
                {
                    "taskId": `${subjectObj.subjectId}-level-${i}-lesson`,
                    "taskName": `Interactive Lesson ${i}`,
                    "type": "lesson",
                    "content": `Welcome to ${subName} Level ${i}! Prepare to learn some amazing new things today. This lesson prepares you for the varied interactive questions ahead!`,
                    "questions": []
                },
                {
                    "taskId": `${subjectObj.subjectId}-level-${i}-quiz`,
                    "taskName": "Practice Module",
                    "type": "quiz",
                    "timeLimit": 180, // 3 Minutes to trigger countdowns
                    "content": "A perfect environment to practice typing and clicking. You'll get instant feedback (green/red background flashes).",
                    "questions": generateDynamicQuestions(i, gradeNum, subName).slice(0, 2) // Just 2 practice questions
                },
                {
                    "taskId": `${subjectObj.subjectId}-level-${i}-exam`,
                    "taskName": "Final Challenge (Whistles!)",
                    "type": "exam",
                    "timeLimit": 300, // 5 Minutes
                    "content": "Complete this varied exam to earn your final whistle confetti and medals. Make sure to spell correctly on text inputs!",
                    "questions": generateDynamicQuestions(i, gradeNum, subName) // Includes all 4 question types to truly test the system
                }
            ];

            newLevels.push({
                "levelId": `${subjectObj.subjectId}-level-${i}`,
                "levelName": `Level ${i} Mastery`,
                "isLocked": false, // Keep completely unlocked as requested earlier
                "tasks": tasks
            });
        }

        subjectObj.levels = newLevels;
    });
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
console.log(`✅ Loaded extensive Database successfully!`);
console.log(`✅ Applied 1-10 levels for EVERY Subject across ALL grades.`);
console.log(`✅ Every level contains multi-modal interactive quizzes & timed exams to trigger the final whistles & feedback UI.`);
