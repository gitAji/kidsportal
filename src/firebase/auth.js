import { auth, app } from "./config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (onSuccess) => {
  const db = getFirestore(app);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Create user document in Firestore if it doesn't exist
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL, // <-- ADD THIS LINE
      role: 'parent', // Default role for new sign-ups
    }, { merge: true }); // Use merge: true to avoid overwriting existing data
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password, onSuccess) => {
  const db = getFirestore(app);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user document in Firestore
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      role: 'parent', // Default role for new sign-ups
    });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error signing up with email and password", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  const db = getFirestore(app);
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
    // Clear session storage on logout
    sessionStorage.removeItem("childUser");
    // You might want to clear other session-related items here too
    // sessionStorage.clear(); // Use this if you want to clear everything
  } catch (error) {
    console.error("Error logging out", error);
    throw error;
  }
};

export { auth };
