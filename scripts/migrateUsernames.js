// scripts/migrateUsernames.js
const { admin, db } = require('./_adminInit');

async function migrateUsernames() {
  console.log("Starting migration with admin privileges...");

  try {
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.get();

    if (usersSnapshot.empty) {
      console.log("No parent users found. Nothing to migrate.");
      return;
    }

    let migrationCount = 0;
    console.log(`Found ${usersSnapshot.docs.length} parent user(s).`);

    // Loop through each parent user
    for (const userDoc of usersSnapshot.docs) {
      const parentUid = userDoc.id;
      console.log(`\nProcessing children for parent UID: ${parentUid}`);
      
      const childrenRef = userDoc.ref.collection('children');
      const childrenSnapshot = await childrenRef.get();

      if (childrenSnapshot.empty) {
        console.log("  -> No children found for this parent.");
        continue;
      }

      // Loop through each child of the parent
      for (const childDoc of childrenSnapshot.docs) {
        const childData = childDoc.data();
        const username = childData.username;
        const childId = childDoc.id;

        if (!username) {
          console.warn(`  -> Child with ID ${childId} has no username. Skipping.`);
          continue;
        }

        // /api/child-login always lowercases the username before looking it
        // up, so the registry key must be lowercase too, or login will fail
        // with "Invalid username or password" even with correct credentials.
        const usernameKey = username.toLowerCase();
        console.log(`  -> Found child: ${childData.name} (Username: ${usernameKey})`);

        const usernameDocRef = db.collection('child_usernames').doc(usernameKey);

        // Create the entry in the global username directory
        await usernameDocRef.set({ parentUid, childId });
        
        migrationCount++;
        console.log(`     - Synced "${username}" to the global username directory.`);
      }
    }

    console.log(`\n\nMigration complete!`);
    console.log(`Successfully processed and synced ${migrationCount} children.`);
    console.log("The child login should now work for all existing children.");

  } catch (error) {
    console.error("\nAn error occurred during migration:", error.message);
    console.error("Please ensure FIREBASE_ADMIN_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY are set in .env.local and have the necessary permissions.");
  }
}

migrateUsernames();