import { onAuthStateChanged, signInAnonymously, signOut, updateProfile, type User } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { isFirebaseConfigured } from "./firebaseConfig";

const disabled = () => Promise.reject(new Error("Firebase is not configured. Online rooms require Firebase Auth and Firestore."));

export const authService = {
  configured: isFirebaseConfigured,
  currentUser: () => getFirebaseAuth()?.currentUser,
  onUser(cb: (user: User | null) => void) {
    const auth = getFirebaseAuth();
    if (!auth) {
      cb(null);
      return () => undefined;
    }
    return onAuthStateChanged(auth, cb);
  },
  async guest(displayName?: string) {
    const auth = getFirebaseAuth();
    if (!auth) return disabled();
    const result = auth.currentUser ? { user: auth.currentUser } : await signInAnonymously(auth);
    if (displayName && result.user.displayName !== displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  },
  async logout() {
    const auth = getFirebaseAuth();
    if (!auth) return disabled();
    return signOut(auth);
  },
};
