const { db } = require('./scripts/_adminInit');

async function findChild() {
    const users = await db.collection('users').get();
    for (const userDoc of users.docs) {
        const children = await db.collection('users').doc(userDoc.id).collection('children').get();
        if (!children.empty) {
            console.log(`Parent ID: ${userDoc.id}`);
            children.forEach(c => {
                const data = c.data();
                console.log(`Child ID: ${c.id}, Name: ${data.name}, Grade: ${data.gradeId || data.grade}`);
            });
        }
    }
}

findChild();
