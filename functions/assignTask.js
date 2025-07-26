const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

exports.assignTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { childId, task } = data;
  const parentUid = context.auth.uid;

  if (!childId || !task) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters.");
  }

  const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(childId);

  try {
    await db.runTransaction(async (t) => {
      const childDoc = await t.get(childDocRef);
      if (!childDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Child document not found.");
      }

      const childData = childDoc.data();
      const assignedTasks = childData.assignedTasks || [];

      // Check if the task is already assigned to prevent duplicates
      if (assignedTasks.some(t => t.taskId === task.taskId)) {
        throw new functions.https.HttpsError("already-exists", "This task is already assigned to the child.");
      }

      const newTask = {
        ...task,
        status: 'not-started', // Set the initial status
        assignedDate: new Date().toISOString(),
      };

      t.update(childDocRef, {
        assignedTasks: [...assignedTasks, newTask]
      });
    });

    return { success: true, message: "Task assigned successfully!" };

  } catch (error) {
    console.error("Error in assignTask:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
  }
});
