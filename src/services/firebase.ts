import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCXgHeDqRATssU1_jklPCRQWof8BF2dX60",
  authDomain: "parko-91fb1.firebaseapp.com",
  projectId: "parko-91fb1",
  storageBucket: "parko-91fb1.firebasestorage.app",
  messagingSenderId: "231287538441",
  appId: "1:231287538441:web:af6378c03e29653d83c9d8",
  measurementId: "G-XV9N9B5NNJ"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Safe Analytics initialization in browser
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in test/offline environment
  });
}

/**
 * Trigger Google OAuth popup flow
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Sign out from Firebase
 */
export const logoutFirebase = async (): Promise<void> => {
  await signOut(auth);
};

export { onAuthStateChanged };
export type { FirebaseUser };
