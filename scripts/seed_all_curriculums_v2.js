const { admin, db } = require('./_adminInit');


// Import curriculum data
const mathCurriculum = require('./curriculum_math_v3.js');
const scienceCurriculum = require('./curriculum_science_v3.js');
const tamilCurriculum = require('./generate_real_tamil_curriculum.js');
const englishCurriculum = require('./curriculum_english_v3.js');

async function seedSubject(subjectName, data) {
    console.log(`Seeding levels for ${subjectName}...`);
    const levelsRef = db.collection('levels');

    for (let gradeNum = 1; gradeNum <= 8; gradeNum++) {
        const batch = db.batch();
        const gradeId = `grade-${gradeNum}`;
        const subjectId = `${subjectName.toLowerCase()}-${gradeNum}`;
        const gradeLevels = data[gradeNum.toString()].levels;

        console.log(`  Grade ${gradeNum} (${subjectId}): ${gradeLevels.length} levels`);

        for (let i = 0; i < gradeLevels.length; i++) {
            const level = gradeLevels[i];
            const levelId = `${subjectId}-level-${i + 1}`;
            const docRef = levelsRef.doc(levelId);

            const tasks = [];

            // Lesson Task
            tasks.push({
                taskId: `${levelId}-lesson`,
                taskName: `Learning: ${level.name}`,
                type: 'lesson',
                content: level.lesson,
                xpReward: 20
            });

            // Quiz Task
            tasks.push({
                taskId: `${levelId}-quiz`,
                taskName: `Quiz: ${level.name}`,
                type: 'quiz',
                content: `Test your knowledge about ${level.name}.`,
                timeLimit: 120,
                xpReward: 30,
                questions: level.quiz.map((q, qIndex) => {
                    const options = [...q.d, q.a].sort(() => Math.random() - 0.5);
                    return {
                        questionId: `q-${levelId}-${qIndex}`,
                        questionText: q.q,
                        options: options,
                        correctAnswer: q.a,
                        type: 'multiple-choice'
                    };
                })
            });

            // Exam Task
            tasks.push({
                taskId: `${levelId}-exam`,
                taskName: `Exam: ${level.name}`,
                type: 'exam',
                content: `Final challenge for ${level.name}.`,
                timeLimit: 300,
                xpReward: 50,
                questions: level.exam.map((q, qIndex) => {
                    const options = [...q.d, q.a].sort(() => Math.random() - 0.5);
                    return {
                        questionId: `e-${levelId}-${qIndex}`,
                        questionText: q.q,
                        options: options,
                        correctAnswer: q.a,
                        type: 'multiple-choice'
                    };
                })
            });

            const levelDoc = {
                levelId,
                levelName: level.name,
                subjectId,
                subjectName,
                gradeId,
                grade: `Grade ${gradeNum}`,
                isLocked: false,
                xpReward: level.xpReward || 100,
                badgeEmoji: level.badgeEmoji,
                moduleName: level.moduleName,
                description: level.description,
                tasks,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            batch.set(docRef, levelDoc);
        }
        await batch.commit();
    }
    console.log(`✅ Finished seeding ${subjectName}`);
}

async function runSeeding() {
    await seedSubject('Math', mathCurriculum);
    await seedSubject('Science', scienceCurriculum);
    await seedSubject('Tamil', tamilCurriculum);
    await seedSubject('English', englishCurriculum);
}

runSeeding().then(() => {
    console.log('All subjects seeded successfully! 🚀');
    process.exit(0);
}).catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
});
