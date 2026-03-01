const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levelNames = [
    "Level 1: Alphabet Adventures",
    "Level 2: Basic Phonics and Sounds",
    "Level 3: Two-Letter Blends",
    "Level 4: Fun Sight Words",
    "Level 5: Rhyming Words",
    "Level 6: Short Vowels",
    "Level 7: Building CVC Words",
    "Level 8: More Sight Words",
    "Level 9: Simple Sentences",
    "Level 10: Story Time!"
];

const levelContentMap = {
    1: {
        lesson: "Let's meet the big and strong uppercase letters from A to Z!",
        q1: "Which is the letter 'D'?", a1: "D",
        q2: "What is this letter: M?", a2: "M"
    },
    2: {
        lesson: "Let's learn the sounds that letters make. B says 'buh', C says 'kuh'!",
        q1: "What letter makes the 'buh' sound?", a1: "B",
        q2: "What letter makes the 'sss' sound?", a2: "S"
    },
    3: {
        lesson: "When we put two letters together, they make a new sound! Like 'sh' or 'ch'.",
        q1: "What letters make the 'sh' in ship?", a1: "sh",
        q2: "What letters make the 'ch' in chair?", a2: "ch"
    },
    4: {
        lesson: "Sight words are words we see all the time. Let's learn 'the', 'and', 'to', 'a'.",
        q1: "Which of these is a sight word?", a1: "the",
        q2: "Fill in the blank: I go ___ the park.", a2: "to"
    },
    5: {
        lesson: "Rhyming words sound the same at the end. Like Cat, Hat, Bat!",
        q1: "What rhymes with Cat?", a1: "Hat",
        q2: "What rhymes with Dog?", a2: "Log"
    },
    6: {
        lesson: "Vowels are A, E, I, O, U. Today we learn their short sounds!",
        q1: "What is the middle sound in 'Cat'?", a1: "a",
        q2: "What is the middle sound in 'Pig'?", a2: "i"
    },
    7: {
        lesson: "Let's build words! C-A-T makes Cat. D-O-G makes Dog.",
        q1: "What does B-A-T spell?", a1: "Bat",
        q2: "What does S-U-N spell?", a2: "Sun"
    },
    8: {
        lesson: "More sight words! Let's learn 'is', 'it', 'in', 'on'.",
        q1: "The cat is ___ the mat.", a1: "on",
        q2: "Look! ___ is raining.", a2: "It"
    },
    9: {
        lesson: "Let's string words together to make sentences. Remember a capital letter and a period!",
        q1: "Which sentence is correct?", a1: "The dog runs.",
        q2: "What goes at the end of a sentence?", a2: "."
    },
    10: {
        lesson: "Now you can read! Let's read a short story about a red fox.",
        q1: "Who is the story about?", a1: "A red fox",
        q2: "Did you enjoy reading?", a2: "Yes!"
    }
};

const optionsFor = (answer) => {
    const dummyOptions = ["A", "B", "C", "D", "E", "S", "M", "Hat", "Bat", "Cat", "Log", "Dog", "a", "e", "i", "o", "the", "and", "to", "on", "It", "Is", "sh", "ch", "th", "The dog runs.", "the dog runs", ".", "?", "A red fox", "A blue bird", "Yes!", "No"];
    let shuffled = dummyOptions.filter(o => o.toLowerCase() !== answer.toLowerCase()).sort(() => 0.5 - Math.random()).slice(0, 2);
    shuffled.push(answer);
    return shuffled.sort(() => 0.5 - Math.random());
};

const newLevels = [];

for (let i = 1; i <= 10; i++) {
    const content = levelContentMap[i];

    const tasks = [
        {
            "taskId": `english-1-level-${i}-lesson-1`,
            "taskName": `Lesson: ${levelNames[i - 1].split(': ')[1]}`,
            "type": "lesson",
            "content": content.lesson,
            "questions": []
        },
        {
            "taskId": `english-1-level-${i}-quiz-1`,
            "taskName": "Practice Quiz",
            "type": "quiz",
            "timeLimit": 120,
            "content": "Let's practice what we just learned!",
            "questions": [
                {
                    "questionId": `eng1-l${i}-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `eng1-l${i}-q2`,
                    "questionText": content.q2,
                    "options": optionsFor(content.a2),
                    "correctAnswer": content.a2,
                    "type": "multiple-choice"
                }
            ]
        },
        {
            "taskId": `english-1-level-${i}-exam-1`,
            "taskName": "Level Challenge!",
            "type": "exam",
            "timeLimit": 240,
            "content": "Time to show your amazing skills!",
            "questions": [
                {
                    "questionId": `eng1-l${i}-ex-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `eng1-l${i}-ex-q2`,
                    "questionText": `Type the answer: ${content.q2}`,
                    "correctAnswer": content.a2,
                    "type": "identification"
                }
            ]
        }
    ];

    newLevels.push({
        "levelId": `english-1-level-${i}`,
        "levelName": levelNames[i - 1],
        "isLocked": false,
        "tasks": tasks
    });
}

const grade1 = dbData.grades.find(g => g.gradeId === "grade-1");
const english1 = grade1.subjects.find(s => s.subjectId === "english-1");
english1.levels = newLevels;

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
console.log("Successfully generated all 10 English levels for Grade 1!");
