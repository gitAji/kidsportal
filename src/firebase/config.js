import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAoce0dLOVSq6QDiK9E4DtETtbTZAeAb9g",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "kidsportal-afc7a.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://kidsportal-afc7a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kidsportal-afc7a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kidsportal-afc7a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "608263508296",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:608263508296:web:42845851b1f2898a34a37d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YHF3ZG66LX"
};

// Initialize Firebase
let app;
let auth;
let db;
let realtimeDb;
let storage;
let analytics;

if (typeof window !== 'undefined' || Object.keys(firebaseConfig).every(key => firebaseConfig[key])) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    try {
      realtimeDb = getDatabase(app);
    } catch (e) { }
    storage = getStorage(app);

    if (typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported) analytics = getAnalytics(app);
      });
    }
  }
}

export { app, auth, db, realtimeDb, storage, analytics };