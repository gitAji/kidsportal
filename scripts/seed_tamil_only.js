const { admin, db } = require('./_adminInit');

const tamilCurriculum = require('./generate_real_tamil_curriculum.js');

async function seedTamil() {
    console.log('Seeding Tamil curriculum with real content...');
    const levelsRef = db.collection('levels');

    for (let gradeNum = 1; gradeNum <= 8; gradeNum++) {
        const batch = db.batch();
        const gradeId = `grade-${gradeNum}`;
        const subjectId = `tamil-${gradeNum}`;
        const gradeLevels = tamilCurriculum[gradeNum.toString()].levels;

        console.log(`  Grade ${gradeNum} (${subjectId}): ${gradeLevels.length} levels`);

        for (let i = 0; i < gradeLevels.length; i++) {
            const level = gradeLevels[i];
            const levelId = `${subjectId}-level-${i + 1}`;
            const docRef = levelsRef.doc(levelId);

            const tasks = [
                {
                    taskId: `${levelId}-lesson`,
                    taskName: `கற்றல்: ${level.name}`,
                    type: 'lesson',
                    content: level.lesson,
                    xpReward: 20
                },
                {
                    taskId: `${levelId}-quiz`,
                    taskName: `வினாடி வினா: ${level.name}`,
                    type: 'quiz',
                    content: `${level.name} பற்றிய உங்கள் அறிவை சோதியுங்கள்.`,
                    timeLimit: 120,
                    xpReward: 30,
                    questions: level.quiz.map((q, qIndex) => {
                        const options = [...q.d, q.a].sort(() => Math.random() - 0.5);
                        return { questionId: `q-${levelId}-${qIndex}`, questionText: q.q, options, correctAnswer: q.a, type: 'multiple-choice' };
                    })
                },
                {
                    taskId: `${levelId}-exam`,
                    taskName: `தேர்வு: ${level.name}`,
                    type: 'exam',
                    content: `${level.name} பற்றிய இறுதி சவால்.`,
                    timeLimit: 300,
                    xpReward: 50,
                    questions: level.exam.map((q, qIndex) => {
                        const options = [...q.d, q.a].sort(() => Math.random() - 0.5);
                        return { questionId: `e-${levelId}-${qIndex}`, questionText: q.q, options, correctAnswer: q.a, type: 'multiple-choice' };
                    })
                }
            ];

            batch.set(docRef, {
                levelId, levelName: level.name, subjectId, subjectName: 'Tamil',
                gradeId, grade: `Grade ${gradeNum}`, isLocked: false,
                xpReward: level.xpReward || 100, badgeEmoji: level.badgeEmoji,
                moduleName: level.moduleName, description: level.description,
                tasks, createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        await batch.commit();
        console.log(`  ✅ Grade ${gradeNum} committed`);
    }

    console.log('\n🎉 Tamil curriculum seeded successfully!');
}

seedTamil().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
