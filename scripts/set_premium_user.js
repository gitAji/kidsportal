const { admin, db } = require('./_adminInit');


async function setPremium() {
    const email = "kontaktaone@gmail.com";
    console.log(`Searching for user with email: ${email}`);

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
        console.log('No matching user found.');
        return;
    }

    snapshot.forEach(async doc => {
        console.log(`Found user: ${doc.id}`);
        await usersRef.doc(doc.id).update({
            plan: "premium",
            isPremium: true,
            status: "active"
        });
        console.log(`Updated user ${doc.id} to premium.`);
    });
}

setPremium().catch(console.error);
