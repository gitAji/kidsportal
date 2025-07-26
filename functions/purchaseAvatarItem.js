const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// A simple definition of the shop items on the server to prevent client-side price tampering.
const SHOP_ITEMS = {
  'hat_cowboy': { price: 100 },
  'glasses_cool': { price: 150 },
  'color_red': { price: 50 },
  'color_green': { price: 50 },
};

exports.purchaseAvatarItem = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { itemId, childId, parentUid } = data;
  if (!itemId || !childId || !parentUid) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required parameters.");
  }

  const item = SHOP_ITEMS[itemId];
  if (!item) {
    throw new functions.https.HttpsError("not-found", "The item you tried to purchase does not exist.");
  }

  const childDocRef = db.collection("users").doc(parentUid).collection("children").doc(childId);

  try {
    await db.runTransaction(async (t) => {
      const childDoc = await t.get(childDocRef);
      if (!childDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Child document not found.");
      }

      const childData = childDoc.data();
      const currentPoints = childData.points || 0;
      const ownedItems = childData.avatarItems || [];

      if (ownedItems.includes(itemId)) {
        throw new functions.https.HttpsError("already-exists", "You already own this item.");
      }

      if (currentPoints < item.price) {
        throw new functions.https.HttpsError("failed-precondition", "You do not have enough points to purchase this item.");
      }

      const newPoints = currentPoints - item.price;
      const newItems = [...ownedItems, itemId];

      t.update(childDocRef, {
        points: newPoints,
        avatarItems: newItems,
      });
    });

    return { success: true, message: "Purchase successful!" };

  } catch (error) {
    console.error("Error in purchaseAvatarItem:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
  }
});
