const { db } = require('./_adminInit');

async function debug() {
    const parentUid = "CthdhUipa0OBc8zSNWW1fJ9IfU52";
    console.log(`Checking parent: ${parentUid}`);

    const parentDoc = await db.collection("users").doc(parentUid).get();
    if (!parentDoc.exists) {
        console.log("Parent doc does NOT exist in Firestore!");
        return;
    }
    console.log("Parent doc exists.");

    const childrenSnapshot = await db.collection("users").doc(parentUid).collection("children").get();
    if (childrenSnapshot.empty) {
        console.log("No children found for this parent.");
    } else {
        console.log(`Found ${childrenSnapshot.size} children:`);
        childrenSnapshot.forEach(doc => {
            console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
        });
    }

    const usernamesSnapshot = await db.collection("child_usernames").get();
    console.log("\nRecent child usernames:");
    usernamesSnapshot.forEach(doc => {
        if (doc.data().parentUid === parentUid) {
            console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
        }
    });
}

debug().catch(console.error);
