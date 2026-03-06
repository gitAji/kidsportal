const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync('/Users/at/Documents/GitHub/kidsportal/serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const levelsSnap = await db.collection('levels').get();
  console.log('Total levels:', levelsSnap.size);
  levelsSnap.forEach(doc => {
    const data = doc.data();
    console.log(`Level ID: ${doc.id}, isLocked: ${data.isLocked}, tasks length: ${data.tasks?.length}`);
  });
}
run();
