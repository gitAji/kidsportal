const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const levelNames = [
    "Level 1: Counting to 10",
    "Level 2: Circles, Squares, and Fun!",
    "Level 3: Adding Up to 10",
    "Level 4: Taking Away (Subtraction)",
    "Level 5: Big and Small",
    "Level 6: Pretty Patterns",
    "Level 7: Morning, Noon, and Night",
    "Level 8: Skip Counting (2s and 5s)",
    "Level 9: Long and Short",
    "Level 10: Corners and Sides"
];

const levelContentMap = {
    1: {
        lesson: "Let's count our fingers! 1, 2, 3, 4, 5... all the way to 10!",
        q1: "How many apples are here: 🍎🍎🍎?", a1: "3",
        q2: "What number comes after 5?", a2: "6"
    },
    2: {
        lesson: "Look around! The sun is a circle. A box is a square. Shapes are everywhere!",
        q1: "Which shape has 3 sides?", a1: "Triangle",
        q2: "The moon looks like which shape?", a2: "Circle"
    },
    3: {
        lesson: "1 apple + 1 apple = 2 apples. Adding makes things bigger!",
        q1: "What is 2 + 3?", a1: "5",
        q2: "What is 4 + 4?", a2: "8"
    },
    4: {
        lesson: "If you have 5 cookies and eat 2, how many are left? That's taking away!",
        q1: "What is 5 - 2?", a1: "3",
        q2: "What is 10 - 5?", a2: "5"
    },
    5: {
        lesson: "An elephant is big. A mouse is small. Let's compare!",
        q1: "Which is bigger: An Airplane or a Bicycle?", a1: "Airplane",
        q2: "Which is smaller: A Leaf or a Tree?", a2: "Leaf"
    },
    6: {
        lesson: "Red, Blue, Red, Blue... What comes next? It's a pattern!",
        q1: "What follows 🔵, 🔴, 🔵?", a1: "🔴",
        q2: "Circle, Square, Circle, ___?", a2: "Square"
    },
    7: {
        lesson: "We wake up in the morning. We sleep at night. Time flies!",
        q1: "When do we see the stars?", a1: "Night",
        q2: "When do we eat breakfast?", a2: "Morning"
    },
    8: {
        lesson: "Let's jump! 2, 4, 6, 8, 10! Counting by 2s is fast.",
        q1: "What comes after 2, 4, ___?", a1: "6",
        q2: "Count by 5s: 5, 10, ___?", a2: "15"
    },
    9: {
        lesson: "A giraffe has a long neck. A rabbit has a short tail.",
        q1: "Which is longer: A Ruler or a Pencil?", a1: "Ruler",
        q2: "Which is shorter: A Crayon or a Baseball Bat?", a2: "Crayon"
    },
    10: {
        lesson: "A square has 4 corners. A triangle has 3. Let's count them!",
        q1: "How many corners does a square have?", a1: "4",
        q2: "How many sides does a triangle have?", a2: "3"
    }
};

const optionsFor = (answer) => {
    const dummyOptions = ["1", "2", "3", "4", "5", "6", "8", "10", "15", "Triangle", "Circle", "Square", "Rectangle", "Airplane", "Bicycle", "Leaf", "Tree", "🔴", "🔵", "Morning", "Night", "Ruler", "Pencil", "Crayon", "Bat"];
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
            "taskId": `math-1-level-${i}-lesson-1`,
            "taskName": `Lesson: ${levelNames[i - 1].split(': ')[1]}`,
            "type": "lesson",
            "content": content.lesson,
            "questions": []
        },
        {
            "taskId": `math-1-level-${i}-quiz-1`,
            "taskName": "Practice Quiz",
            "type": "quiz",
            "timeLimit": 120,
            "content": "Let's practice our math skills!",
            "questions": [
                {
                    "questionId": `mat1-l${i}-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `mat1-l${i}-q2`,
                    "questionText": content.q2,
                    "options": optionsFor(content.a2),
                    "correctAnswer": content.a2,
                    "type": "multiple-choice"
                }
            ]
        },
        {
            "taskId": `math-1-level-${i}-exam-1`,
            "taskName": "Math Challenge!",
            "type": "exam",
            "timeLimit": 240,
            "content": "Ready for the big math challenge?",
            "questions": [
                {
                    "questionId": `mat1-l${i}-ex-q1`,
                    "questionText": content.q1,
                    "options": optionsFor(content.a1),
                    "correctAnswer": content.a1,
                    "type": "multiple-choice"
                },
                {
                    "questionId": `mat1-l${i}-ex-q2`,
                    "questionText": `Calculate or identify: ${content.q2}`,
                    "correctAnswer": content.a2,
                    "type": "identification"
                }
            ]
        }
    ];

    newLevels.push({
        "levelId": `math-1-level-${i}`,
        "levelName": levelNames[i - 1],
        "isLocked": false,
        "tasks": tasks
    });
}

const grade1 = dbData.grades.find(g => g.gradeId === "grade-1");
const math1 = grade1.subjects.find(s => s.subjectId === "math-1");
math1.levels = newLevels;

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
console.log("Successfully generated all 10 Math levels for Grade 1!");
