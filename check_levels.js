const { db } = require('./scripts/_adminInit');

async function run() {
  const levelsSnap = await db.collection('levels').get();
  console.log('Total levels:', levelsSnap.size);
  levelsSnap.forEach(doc => {
    const data = doc.data();
    console.log(`Level ID: ${doc.id}, isLocked: ${data.isLocked}, tasks length: ${data.tasks?.length}`);
  });
}
run();
