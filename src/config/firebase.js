import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Environment variables configuration using Vite's import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigValid = Object.values(firebaseConfig).every(val => Boolean(val));
let app;

if (!isConfigValid) {
  console.error(
    "🔥 FIREBASE ERROR: Missing environment variables! Please check your .env file. The application will not authenticate users until keys are provided and the Vite server is restarted."
  );
} else {
  // Ensure Firebase initializes only once
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

// Initialize Firebase Authentication only if config is completely valid to prevent crashes
export const auth = isConfigValid ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
