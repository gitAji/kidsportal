import { auth, db } from "./config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (onSuccess) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Create user document in Firestore if it doesn't exist
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      displayName: result.user.displayName,
      role: 'parent', // Default role for new sign-ups
      createdAt: new Date(),
      subscriptionStatus: 'free', // Add subscription status
    }, { merge: true }); // Use merge: true to avoid overwriting existing data
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password, onSuccess) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user document in Firestore
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      role: 'parent', // Default role for new sign-ups
      createdAt: new Date(),
      subscriptionStatus: 'free', // Add subscription status
    });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error signing up with email and password", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in with email and password", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out", error);
    throw error;
  }
};

export { auth };