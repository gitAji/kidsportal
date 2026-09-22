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

    const updatePromises = [];
    snapshot.forEach(doc => {
        console.log(`Found user: ${doc.id}`);
        updatePromises.push(usersRef.doc(doc.id).update({
            plan: "premium",
            isPremium: true,
            status: "active",
            planType: "paid",
            subscriptionStatus: "active",
            subscription: { status: "active" }
        }));
    });

    await Promise.all(updatePromises);
    console.log(`Updated user(s) to premium with full session fields.`);
}

setPremium().catch(console.error);
