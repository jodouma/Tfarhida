import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./firebaseConfig";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp() {
  if (!isFirebaseConfigured) return undefined;
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

export function getFirebaseDb() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!db) db = getFirestore(firebaseApp);
  return db;
}

export function requireFirebase() {
  const firebaseAuth = getFirebaseAuth();
  const firebaseDb = getFirebaseDb();
  if (!firebaseAuth || !firebaseDb) {
    throw new Error("Firebase is not configured. Add VITE_FIREBASE_* values to .env.local.");
  }
  return { auth: firebaseAuth, db: firebaseDb };
}
