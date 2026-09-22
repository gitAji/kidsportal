const { admin, db } = require('./_adminInit');


async function checkLevels() {
    const subjects = ['math-1', 'science-1', 'tamil-1'];
    for (const sub of subjects) {
        const snapshot = await db.collection('levels').where('subjectId', '==', sub).limit(1).get();
        snapshot.forEach(doc => {
            console.log(`Subject: ${sub}`);
            console.log(JSON.stringify(doc.data(), null, 2));
            console.log('---');
        });
    }
}

checkLevels().catch(console.error);
