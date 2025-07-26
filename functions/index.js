const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.manageChildAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { action, payload } = data;
  const parentUid = context.auth.uid;

  if (!action || !payload) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters.");
  }

  try {
    switch (action) {
      case "create": {
        // This part is working correctly.
        const { username, ...newChildData } = payload;
        if (!username) throw new functions.https.HttpsError("invalid-argument", "Username is required.");
        
        const usernameDocRef = db.collection("child_usernames").doc(username);
        const newChildRef = db.collection("users").doc(parentUid).collection("children").doc();

        await db.runTransaction(async (t) => {
          const usernameDoc = await t.get(usernameDocRef);
          if (usernameDoc.exists) {
            throw new functions.https.HttpsError("already-exists", "This username is already taken.");
          }
          t.set(newChildRef, { ...newChildData, username });
          t.set(usernameDocRef, { parentUid, childId: newChildRef.id });
        });
        return { success: true, message: "Child created successfully." };
      }

      case "update": {
        const { id, oldUsername, ...dataToUpdate } = payload;
        if (!id) {
            throw new functions.https.HttpsError("invalid-argument", "Child ID is required for update.");
        }
        const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(id);

        // **THE FIX IS HERE:** We build a clean object and only include fields that are not undefined.
        const cleanPayload = {};
        if (dataToUpdate.name !== undefined) cleanPayload.name = dataToUpdate.name;
        if (dataToUpdate.age !== undefined) cleanPayload.age = dataToUpdate.age;
        if (dataToUpdate.grade !== undefined) cleanPayload.grade = dataToUpdate.grade;
        if (dataToUpdate.username !== undefined) cleanPayload.username = dataToUpdate.username;
        if (dataToUpdate.password !== undefined) cleanPayload.password = dataToUpdate.password;
        if (dataToUpdate.avatar !== undefined) cleanPayload.avatar = dataToUpdate.avatar;
        if (dataToUpdate.loginEnabled !== undefined) cleanPayload.loginEnabled = dataToUpdate.loginEnabled;

        await db.runTransaction(async (t) => {
            if (cleanPayload.username && cleanPayload.username !== oldUsername) {
                if(!oldUsername) throw new functions.https.HttpsError("invalid-argument", "Old username is required when changing username.");
                const oldUsernameDocRef = db.collection("child_usernames").doc(oldUsername);
                const newUsernameDocRef = db.collection("child_usernames").doc(cleanPayload.username);
                
                const newUsernameDoc = await t.get(newUsernameDocRef);
                if (newUsernameDoc.exists) {
                    throw new functions.https.HttpsError("already-exists", "This username is already taken.");
                }
                t.delete(oldUsernameDocRef);
                t.set(newUsernameDocRef, { parentUid, childId: id });
            }
            t.update(childDocRef, cleanPayload);
        });
        return { success: true, message: "Child updated successfully." };
      }

      case "delete": {
        // This part is working correctly.
        const { id, username } = payload;
        if (!id || !username) throw new functions.https.HttpsError("invalid-argument", "Missing ID or username for deletion.");

        const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(id);
        const usernameDocRef = db.collection("child_usernames").doc(username);

        await db.runTransaction(async (t) => {
          t.delete(usernameDocRef);
          t.delete(childDocRef);
        });
        return { success: true, message: "Child deleted successfully." };
      }

      default:
        throw new functions.https.HttpsError("invalid-argument", "Invalid action specified.");
    }
  } catch (error) {
    console.error(`Error in manageChildAccount (Action: ${action}):`, error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "An unexpected error occurred. Please try again.");
  }
});
