const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levelNames = [
    "Level 1: Uyir Ezuthukal (Vowels)",
    "Level 2: Mei Ezuthukal (Consonants)",
    "Level 3: Meet Your Family (Amma, Appa)",
    "Level 4: Animal Friends",
    "Level 5: Yummy Fruits",
    "Level 6: Bright Colors",
    "Level 7: Counting in Tamil",
    "Level 8: Happy Greetings",
    "Level 9: Body Parts",
    "Level 10: Beautiful Nature"
];

const levelContentMap = {
    1: {
        lesson: "Let's learn the soul of Tamil: அ, ஆ, இ, ஈ... these are the Vowels!",
        q1: "Which is the first letter in Tamil?", a1: "அ",
        q2: "Fill: அ, ஆ, இ, ___?", a2: "ஈ"
    },
    2: {
        lesson: "Consonants make the sounds strong! க், ங், ச்...",
        q1: "Does க் have a dot on top?", a1: "Yes",
        q2: "How many dots does க் have?", a2: "1"
    },
    3: {
        lesson: "Amma is Mother. Appa is Father. Thambi is Brother.",
        q1: "What do we call Mother in Tamil?", a1: "Amma",
        q2: "What is Father in Tamil?", a2: "Appa"
    },
    4: {
        lesson: "The Elephant is Yaanai. The Lion is Singam. Grrr!",
        q1: "Find the Lion in Tamil:", a1: "Singam",
        q2: "What is the Tamil name for Elephant?", a2: "Yaanai"
    },
    5: {
        lesson: "Apple, Banana, Mango! Pazham means fruit in Tamil.",
        q1: "What is Mango in Tamil?", a1: "Maampalam",
        q2: "Pazham means what in English?", a2: "Fruit"
    },
    6: {
        lesson: "Sivappu is Red. Neelam is Blue. Pachai is Green.",
        q1: "Which color is Pachai?", a1: "Green",
        q2: "What do we call Red in Tamil?", a2: "Sivappu"
    },
    7: {
        lesson: "Ondru, Irandu, Moondru... let's count to five in Tamil!",
        q1: "What is the number '1' in Tamil?", a1: "Ondru",
        q2: "What is the number '3' in Tamil?", a2: "Moondru"
    },
    8: {
        lesson: "Vanakkam! That's how we say hello. Let's learn to be polite.",
        q1: "How do you say Hello in Tamil?", a1: "Vanakkam",
        q2: "Thanks in Tamil is?", a2: "Nandri"
    },
    9: {
        lesson: "Kann (Eye), Mooku (Nose), Kaathu (Ear). Tap your head!",
        q1: "What is Mooku in English?", a1: "Nose",
        q2: "Kann is which body part?", a2: "Eye"
    },
    10: {
        lesson: "Maram (Tree), Mazhai (Rain), Sooriyan (Sun). The world is beautiful!",
        q1: "What is Maram?", a1: "Tree",
        q2: "Mazhai falls from the sky. What is it?", a2: "Rain"
    }
};

const optionsFor = (answer) => {
    const dummyOptions = ["அ", "ஆ", "இ", "ஈ", "Yes", "No", "Amma", "Appa", "Singam", "Yaanai", "Maampalam", "Pazham", "Pachai", "Sivappu", "Neelam", "Green", "Ondru", "Irandu", "Moondru", "Vanakkam", "Nandri", "Mooku", "Kann", "Maram", "Mazhai", "Rain", "Sun", "Tree", "Nose", "Eye"];
    let filtered = dummyOptions.filter(o => o.toLowerCase() !== answer.toLowerCase());
    let shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 2);
    shuffled.push(answer);
    return shuffled.sort(() => 0.5 - Math.random());
};

const newLevels = [];

for (let i = 1; i <= 10; i++) {
    const content = levelContentMap[i];

    const tasks = [
        {
            "taskId": `tamil-1-level-${i}-lesson-1`,
            "taskName": `Lesson: ${levelNames[i - 1].split(': ')[1]}`,
            "type": "lesson",
            "content": content.lesson,
            "questions": []
        },
        {
            "taskId": `tamil-1-level-${i}-quiz-1`,
            "taskName": "Practice Quiz",
            "type": "quiz",
            "timeLimit": 120,
            "content": "Let's learn our beautiful Tamil language!",
            "questions": [
                {
                    "questionId": `tam1-l${i}-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `tam1-l${i}-q2`,
                    "questionText": content.q2,
                    "options": optionsFor(content.a2),
                    "correctAnswer": content.a2,
                    "type": "multiple-choice"
                }
            ]
        },
        {
            "taskId": `tamil-1-level-${i}-exam-1`,
            "taskName": "Tamil Challenge!",
            "type": "exam",
            "timeLimit": 240,
            "content": "Show what you've learned in Tamil!",
            "questions": [
                {
                    "questionId": `tam1-l${i}-ex-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `tam1-l${i}-ex-q2`,
                    "questionText": `Translate or identify: ${content.q2}`,
                    "correctAnswer": content.a2,
                    "type": "identification"
                }
            ]
        }
    ];

    newLevels.push({
        "levelId": `tamil-1-level-${i}`,
        "levelName": levelNames[i - 1],
        "isLocked": false,
        "tasks": tasks
    });
}

const grade1 = dbData.grades.find(g => g.gradeId === "grade-1");
const tamil1 = grade1.subjects.find(s => s.subjectId === "tamil-1");
tamil1.levels = newLevels;

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
console.log("Successfully generated all 10 Tamil levels for Grade 1!");
