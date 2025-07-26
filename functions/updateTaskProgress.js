const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

exports.updateTaskProgress = functions.https.onCall(async (data, context) => {
  // This function is now called by the child's client, but we need the parent's UID
  // to build the correct path to the document.
  const { childId, parentUid, taskId, score } = data;

  if (!childId || !parentUid || !taskId || score === undefined) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters.");
  }

  try {
    const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(childId);
    let stickerAwarded = null;

    await db.runTransaction(async (t) => {
      const childDoc = await t.get(childDocRef);
      if (!childDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Child document not found.");
      }

      const childData = childDoc.data();
      
      const updatedTasks = childData.assignedTasks.map(task => 
        task.taskId === taskId ? { ...task, status: 'completed', score } : task
      );

      const pointsEarned = score * 10;
      const newTotalPoints = (childData.points || 0) + pointsEarned;

      const newStickers = childData.stickers || [];
      const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
      
      // Award a new sticker for every 3 completed tasks (as an example)
      const newStickerId = Math.floor(completedCount / 3);
      if (newStickerId > 0 && !newStickers.includes(newStickerId)) {
        newStickers.push(newStickerId);
        stickerAwarded = newStickerId;
      }

      t.update(childDocRef, {
        assignedTasks: updatedTasks,
        points: newTotalPoints,
        stickers: newStickers,
      });
    });

    return { success: true, message: "Progress updated!", pointsEarned, stickerAwarded };

  } catch (error) {
    console.error("Error in updateTaskProgress:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
  }
});