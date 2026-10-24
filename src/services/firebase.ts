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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim().length > 0 &&
  !firebaseConfig.apiKey.includes('your_')
);

// Fallback config to prevent initialization crash if env variables are not yet loaded
const activeConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      ...firebaseConfig,
      apiKey: 'AIzaSy_demo_placeholder_configure_in_env_file',
      projectId: 'parko-demo'
    };

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Safe Analytics initialization in browser
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && isFirebaseConfigured) {
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
  if (!isFirebaseConfigured) {
    throw new Error('Firebase credentials are not configured. Please add VITE_FIREBASE_API_KEY and other credentials to your environment variables.');
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Sign out from Firebase
 */
export const logoutFirebase = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

export { onAuthStateChanged };
export type { FirebaseUser };
