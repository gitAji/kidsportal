const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const subjects = [
  {
    id: "math",
    name: "Math",
    grades: [
      {
        grade: 1,
        levels: [
          {
            level: 1,
            name: "Counting",
            description: "Learn to count from 1 to 10.",
            premium: false, // A level can contain multiple lessons
            lessons: [
              {
                id: 1,
                name: "Counting to 5",
                questions: [
                  {
                    type: "multiple-choice",
                    question: "What is 1 + 1?",
                    options: ["1", "2", "3", "4"],
                    answer: "2",
                  },
                ],
              },
              {
                id: 2,
                name: "Counting to 10",
                questions: [
                  {
                    type: "multiple-choice",
                    question: "What is 2 + 2?",
                    options: ["2", "3", "4", "5"],
                    answer: "4",
                  },
                ],
              },
            ],
          },
          {
            level: 2,
            name: "Addition",
            description: "Learn basic addition.",
            premium: false,
            lessons: [
              {
                id: 1,
                name: "Simple Addition",
                questions: [
                  {
                    type: "multiple-choice",
                    question: "What is 3 + 2?",
                    options: ["3", "4", "5", "6"],
                    answer: "5",
                  },
                  {
                    type: "multiple-choice",
                    question: "What is 5 + 3?",
                    options: ["7", "8", "9", "10"],
                    answer: "8",
                  },
                ],
              },
            ],
          },
          {
            level: 3,
            name: "Subtraction",
            description: "Learn basic subtraction.",
            premium: true, // This level is premium
            lessons: [
              {
                id: 1,
                name: "Simple Subtraction",
                questions: [
                  {
                    type: "multiple-choice",
                    question: "What is 5 - 2?",
                    options: ["1", "2", "3", "4"],
                    answer: "3",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "english",
    name: "English",
    grades: [
      {
        grade: 1,
        levels: [
          {
            level: 1,
            name: "Alphabet",
            description: "Learn the letters A-Z.",
            premium: false,
            lessons: [
              {
                id: 1,
                name: "Letters A-E",
                questions: [
                  {
                    type: "multiple-choice",
                    question: "Which letter comes after A?",
                    options: ["B", "C", "D", "E"],
                    answer: "B",
                  },
                ],
              },
            ],
          },
          {
            level: 2,
            name: "Phonics",
            description: "Learn basic letter sounds.",
            premium: true,
            lessons: [
              {
                id: 1,
                name: "Short Vowel Sounds",
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const users = [
  {
    uid: "parent1",
    email: "parent1@example.com",
    role: "parent",
    name: "John Doe",
    children: ["child1", "child2"],
    subscription: {
      plan: "free",
      status: "active",
      startDate: null,
      endDate: null,
    },
    paymentInfo: null,
    notifications: [
      {
        id: "notification1",
        type: "child_progress",
        message: "Jane has completed the Math level 1.",
        read: false,
        timestamp: new Date(),
      },
    ],
  },
];

const children = [
  {
    uid: "child1",
    name: "Jane Doe",
    age: 6,
    grade: 1,
    progress: {
      overall: 50,
      subjects: {
        math: {
          grade: 1,
          level: 2,
          score: 90,
        },
        english: {
          grade: 1,
          level: 1,
          score: 85,
        },
      },
    },
    assignedTasks: [
      {
        id: "task1",
        subjectId: "math",
        levelId: 2,
        lessonId: 1,
        status: "in-progress",
        assignedDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        id: "task2",
        subjectId: "english",
        levelId: 1,
        lessonId: 1,
        status: "completed",
        assignedDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    ],
    rewards: [
      {
        id: "reward1",
        name: "Math Whiz",
        type: "badge",
        image: "/images/math_trophy.png",
        dateEarned: new Date(),
      },
    ],
  },
  {
    uid: "child2",
    name: "Jack Doe",
    age: 7,
    grade: 2,
    progress: {
      overall: 20,
      subjects: {
        math: {
          grade: 1,
          level: 1,
          score: 70,
        },
      },
    },
    assignedTasks: [
      {
        id: "task3",
        subjectId: "math",
        levelId: 1,
        lessonId: 1,
        status: "not-started",
        assignedDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    ],
    rewards: [],
  },
];

const seedDatabase = async () => {
  try {
    // Seed subjects
    for (const subject of subjects) {
      await db.collection("subjects").doc(subject.id).set(subject);
      console.log(`Seeded subject: ${subject.name}`);
    }

    // Seed users
    for (const user of users) {
      await db.collection("users").doc(user.uid).set(user);
      console.log(`Seeded user: ${user.email}`);

      // Seed children as a subcollection
      for (const child of children) {
        if (user.children.includes(child.uid)) {
          await db
            .collection("users")
            .doc(user.uid)
            .collection("children")
            .doc(child.uid)
            .set(child);
          console.log(`Seeded child: ${child.name} for parent: ${user.email}`);
        }
      }
    }

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
