import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

export const addNotification = async (userId, message, type = 'info') => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      type,
      read: false,
      timestamp: new Date(),
    });
    console.log("Notification added successfully for user:", userId);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};
