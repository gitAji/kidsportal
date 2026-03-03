const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
});

const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKeyRaw = env.FIREBASE_ADMIN_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
    privateKeyRaw = privateKeyRaw.substring(1, privateKeyRaw.length - 1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
});

const db = getFirestore();

async function wipeStripeData() {
    console.log("Starting Stripe data wipe...");
    try {
        const usersSnap = await db.collection('users').get();
        console.log(`Found ${usersSnap.size} users. Processing...`);

        let count = 0;
        let paymentsDeleted = 0;

        for (const doc of usersSnap.docs) {
            const uid = doc.id;
            const data = doc.data();

            // 1. Wipe subscription fields from the user document
            const updateData = {};
            let needsUpdate = false;

            const fieldsToDelete = [
                'subscription',
                'subscriptionStatus',
                'subscriptionPlan',
                'subscriptionExpiresAt',
                'planType',
                'lastPayment'
            ];

            for (const field of fieldsToDelete) {
                if (data[field]) {
                    updateData[field] = FieldValue.delete();
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await db.collection('users').doc(uid).update(updateData);
                count++;
            }

            // 2. Delete all documents in the payments subcollection
            const paymentsRef = db.collection(`users/${uid}/payments`);
            const paymentsSnap = await paymentsRef.get();

            if (!paymentsSnap.empty) {
                const batch = db.batch();
                paymentsSnap.forEach(paymentDoc => {
                    batch.delete(paymentDoc.ref);
                    paymentsDeleted++;
                });
                await batch.commit();
            }
        }

        console.log("\n------------------------------------");
        console.log("Wipe completed successfully! ✅");
        console.log(`- User documents cleaned up: ${count}`);
        console.log(`- 'payments' sub-documents deleted: ${paymentsDeleted}`);
        console.log("------------------------------------\n");
    } catch (err) {
        console.error("Error wiping data:", err);
    }
}

wipeStripeData();
