const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levelNames = [
    "Level 1: Living or Non-living?",
    "Level 2: Amazing Body Parts",
    "Level 3: The Five Senses",
    "Level 4: Animal Homes",
    "Level 5: Plant Power!",
    "Level 6: Sunny or Rainy?",
    "Level 7: The Big Blue Sky",
    "Level 8: Rocks and Soil",
    "Level 9: Water is Life!",
    "Level 10: Keeping Healthy"
];

const levelContentMap = {
    1: {
        lesson: "Living things grow, breathe, and eat. Non-living things stay the same!",
        q1: "Which is a living thing: A Teddy Bear or a Puppy?", a1: "Puppy",
        q2: "Does a rock eat food?", a2: "No"
    },
    2: {
        lesson: "From head to toes, your body is special! Let's name the parts.",
        q1: "What do we use to see things?", a1: "Eyes",
        q2: "What is at the end of your arm?", a2: "Hand"
    },
    3: {
        lesson: "We have five senses: Sight, Hearing, Smell, Taste, and Touch!",
        q1: "Which sense uses your ears?", a1: "Hearing",
        q2: "Which sense do you use to eat ice cream?", a2: "Taste"
    },
    4: {
        lesson: "Birds live in nests. Bees live in hives. Where do you live?",
        q1: "A spider builds which home?", a1: "Web",
        q2: "A fish lives in the ___?", a2: "Water"
    },
    5: {
        lesson: "Plants need sun, water, and soil to grow. They give us flowers!",
        q1: "What part of a plant grows under the soil?", a1: "Roots",
        q2: "What do bees like from flowers?", a2: "Nectar"
    },
    6: {
        lesson: "The weather changes. Wear a coat when it's cold!",
        q1: "What do you carry when it's raining?", a1: "Umbrella",
        q2: "Where does snow come from?", a2: "Clouds"
    },
    7: {
        lesson: "By day we see the sun. By night we see the moon and stars.",
        q1: "What color is the sky on a sunny day?", a1: "Blue",
        q2: "What is the biggest star we see in the day?", a2: "Sun"
    },
    8: {
        lesson: "The earth is made of rocks and soil. Plants grow in dirt!",
        q1: "What is a very hard material from the ground?", a1: "Rock",
        q2: "What do we call the dirt we plant seeds in?", a2: "Soil"
    },
    9: {
        lesson: "Clean water is important for drinking, washing, and swimming.",
        q1: "Should you drink dirty water?", a1: "No",
        q2: "Where does rain come from?", a2: "Clouds"
    },
    10: {
        lesson: "Eat apples, wash your hands, and sleep well to stay strong!",
        q1: "What should you do before eating?", a1: "Wash hands",
        q2: "Is an apple healthy?", a2: "Yes"
    }
};

const optionsFor = (answer) => {
    const dummyOptions = ["Puppy", "Teddy Bear", "Eyes", "Hand", "Eyes", "Hearing", "Taste", "Web", "Water", "Roots", "Nectar", "Umbrella", "Clouds", "Blue", "Sun", "Rock", "Soil", "Wash hands", "Yes", "No", "Dirt", "Tree", "Leaf", "Stars", "Moon"];
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
            "taskId": `science-1-level-${i}-lesson-1`,
            "taskName": `Lesson: ${levelNames[i - 1].split(': ')[1]}`,
            "type": "lesson",
            "content": content.lesson,
            "questions": []
        },
        {
            "taskId": `science-1-level-${i}-quiz-1`,
            "taskName": "Practice Quiz",
            "type": "quiz",
            "timeLimit": 120,
            "content": "Let's explore the world of science!",
            "questions": [
                {
                    "questionId": `sci1-l${i}-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `sci1-l${i}-q2`,
                    "questionText": content.q2,
                    "options": optionsFor(content.a2),
                    "correctAnswer": content.a2,
                    "type": "multiple-choice"
                }
            ]
        },
        {
            "taskId": `science-1-level-${i}-exam-1`,
            "taskName": "Science Challenge!",
            "type": "exam",
            "timeLimit": 240,
            "content": "Ready for the big science discovery mission?",
            "questions": [
                {
                    "questionId": `sci1-l${i}-ex-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `sci1-l${i}-ex-q2`,
                    "questionText": `Identify or describe: ${content.q2}`,
                    "correctAnswer": content.a2,
                    "type": "identification"
                }
            ]
        }
    ];

    newLevels.push({
        "levelId": `science-1-level-${i}`,
        "levelName": levelNames[i - 1],
        "isLocked": false,
        "tasks": tasks
    });
}

const grade1 = dbData.grades.find(g => g.gradeId === "grade-1");
const science1 = grade1.subjects.find(s => s.subjectId === "science-1");
science1.levels = newLevels;

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
console.log("Successfully generated all 10 Science levels for Grade 1!");
