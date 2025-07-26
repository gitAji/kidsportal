const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Securely manages child account data (create, update, delete).
 */
exports.manageChildAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { action, payload } = data;
  const parentUid = context.auth.uid;

  if (!action || !payload) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters.");
  }

  console.log(`manageChildAccount called. Action: ${action}, Parent UID: ${parentUid}, Payload:`, payload);

  try {
    switch (action) {
      case "create": {
        console.log("Action: create");
        const { username, ...newChildData } = payload;
        if (!username) {
          console.error("Create: Username is required.");
          throw new functions.https.HttpsError("invalid-argument", "Username is required.");
        }
        
        const usernameDocRef = db.collection("child_usernames").doc(username);
        const newChildRef = db.collection("users").doc(parentUid).collection("children").doc();

        console.log(`Attempting to create child with username: ${username} and child ID: ${newChildRef.id}`);

        await db.runTransaction(async (t) => {
          console.log("Transaction: Checking username availability...");
          const usernameDoc = await t.get(usernameDocRef);
          if (usernameDoc.exists) {
            console.error("Transaction: Username already exists.");
            throw new functions.https.HttpsError("already-exists", "This username is already taken.");
          }
          console.log("Transaction: Setting child data and username mapping...");
          t.set(newChildRef, { ...newChildData, username, parentUid }); // Ensure parentUid is also stored in child document
          t.set(usernameDocRef, { parentUid, childId: newChildRef.id });
          console.log("Transaction: Commit successful.");
        });
        console.log("Child created successfully.");
        return { success: true, message: "Child created successfully." };
      }

      case "update": {
        console.log("Action: update");
        const { id, oldUsername, ...dataToUpdate } = payload;
        if (!id) {
          console.error("Update: Child ID is required.");
          throw new functions.https.HttpsError("invalid-argument", "Child ID is required for update.");
        }
        
        const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(id);

        console.log(`Attempting to update child ID: ${id}`);

        await db.runTransaction(async (t) => {
          console.log("Transaction: Checking for username change...");
          if (dataToUpdate.username && dataToUpdate.username !== oldUsername) {
            if (!oldUsername) {
              console.error("Transaction: Old username is required when changing username.");
              throw new functions.https.HttpsError("invalid-argument", "Old username is required when changing username.");
            }
            
            const oldUsernameDocRef = db.collection("child_usernames").doc(oldUsername);
            const newUsernameDocRef = db.collection("child_usernames").doc(dataToUpdate.username);
            
            console.log(`Transaction: Changing username from ${oldUsername} to ${dataToUpdate.username}`);
            const newUsernameDoc = await t.get(newUsernameDocRef);
            if (newUsernameDoc.exists) {
              console.error("Transaction: New username already exists.");
              throw new functions.https.HttpsError("already-exists", "This username is already taken.");
            }
            t.delete(oldUsernameDocRef);
            t.set(newUsernameDocRef, { parentUid, childId: id });
            console.log("Transaction: Username mapping updated.");
          }
          console.log("Transaction: Updating child document...");
          t.update(childDocRef, dataToUpdate);
          console.log("Transaction: Commit successful.");
        });
        console.log("Child updated successfully.");
        return { success: true, message: "Child updated successfully." };
      }

      case "delete": {
        console.log("Action: delete");
        const { id, username } = payload;
        if (!id || !username) {
          console.error("Delete: Missing ID or username.");
          throw new functions.https.HttpsError("invalid-argument", "Missing ID or username for deletion.");
        }

        const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(id);
        const usernameDocRef = db.collection("child_usernames").doc(username);

        console.log(`Attempting to delete child ID: ${id} and username: ${username}`);

        await db.runTransaction(async (t) => {
          console.log("Transaction: Deleting username mapping...");
          t.delete(usernameDocRef);
          console.log("Transaction: Deleting child document...");
          t.delete(childDocRef);
          console.log("Transaction: Commit successful.");
        });
        console.log("Child deleted successfully.");
        return { success: true, message: "Child deleted successfully." };
      }

      default:
        console.error("Invalid action specified.");
        throw new functions.https.HttpsError("invalid-argument", "Invalid action specified.");
    }
  } catch (error) {
    console.error(`Error in manageChildAccount (Action: ${action}):`, error);
    if (error instanceof functions.https.HttpsError) {
      console.error("HttpsError caught:", error.code, error.message);
      throw error;
    }
    console.error("Unexpected internal error:", error);
    throw new functions.https.HttpsError("internal", "An unexpected error occurred. Please try again.");
  }
});
