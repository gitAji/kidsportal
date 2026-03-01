import { auth, app } from "./config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (onSuccess) => {
  const db = getFirestore(app);
  try {
    if (auth.currentUser) {
      await signOut(auth);
      sessionStorage.removeItem("childUser");
    }

    const result = await signInWithPopup(auth, googleProvider);
    // Create user document in Firestore if it doesn't exist
    const userRef = doc(db, "users", result.user.uid);

    // Calculate 1 month from now for trial
    const trialEnd = new Date();
    trialEnd.setMonth(trialEnd.getMonth() + 1);

    const userData = {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      // Only set role and subscription if it's a new user
      // or if they don't have a role yet.
      lastLogin: new Date(),
    };

    const existingDoc = await getDoc(userRef);
    if (!existingDoc.exists() || !existingDoc.data().role) {
      userData.role = 'parent';
      userData.subscription = {
        plan: 'trial',
        status: 'active',
        currentPeriodEnd: trialEnd,
        trialStartedAt: new Date(),
      };
    }

    await setDoc(userRef, userData, { merge: true });
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password, name, onSuccess) => {
  const db = getFirestore(app);
  try {
    if (auth.currentUser) {
      await signOut(auth);
      sessionStorage.removeItem("childUser");
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user document in Firestore
    const userRef = doc(db, "users", result.user.uid);

    // Calculate 1 month from now for trial
    const trialEnd = new Date();
    trialEnd.setMonth(trialEnd.getMonth() + 1);

    await setDoc(userRef, {
      email: result.user.email,
      displayName: name,
      role: 'parent',
      subscription: {
        plan: 'trial',
        status: 'active',
        currentPeriodEnd: trialEnd,
        trialStartedAt: new Date(),
      }
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
    if (auth.currentUser) {
      await signOut(auth);
      sessionStorage.removeItem("childUser");
    }

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
