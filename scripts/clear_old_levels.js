const { admin, db } = require('./_adminInit');


async function clearLevels() {
    const subjectsToClear = ['math', 'science', 'tamil'];
    console.log('Clearing old levels...');

    let deletedCount = 0;
    const snapshot = await db.collection('levels').get();
    const batch = db.batch();

    snapshot.forEach(doc => {
        const data = doc.data();
        const subjectId = data.subjectId || '';
        if (subjectsToClear.some(s => subjectId.startsWith(s))) {
            batch.delete(doc.ref);
            deletedCount++;
        }
    });

    if (deletedCount > 0) {
        await batch.commit();
    }
    console.log(`Deleted ${deletedCount} levels.`);
}

clearLevels().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
