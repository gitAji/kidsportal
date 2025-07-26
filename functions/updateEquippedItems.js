const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

exports.updateEquippedItems = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { childId, parentUid, equippedItems } = data;
  if (!childId || !parentUid || !equippedItems) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters.");
  }

  const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(childId);

  try {
    await childDocRef.update({ equippedItems });
    return { success: true, message: "Avatar updated successfully!" };
  } catch (error) {
    console.error("Error in updateEquippedItems:", error);
    throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
  }
});
