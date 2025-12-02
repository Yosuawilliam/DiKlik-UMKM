import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// In the immersive environment, these variables are injected globally.
// For local development, you would use process.env.NEXT_PUBLIC_FIREBASE_API_KEY etc.
const firebaseConfig = typeof window !== 'undefined' && (window as any).__firebase_config 
  ? JSON.parse((window as any).__firebase_config)
  : {
      // Placeholder config for local TS compilation (replace with your real config locally)
      apiKey: "AIzaSyDdhPeBS5HG6nXTajg6CsbsStSloBfjqoc",
      authDomain: "coursetify-9670c.firebaseapp.com",
      projectId: "coursetify-9670c",
      storageBucket: "coursetify-9670c.firebasestorage.app",
      messagingSenderId: "278688590392",
      appId: "1:278688590392:web:c89437fd0946061eaf14cd"
    };

// Initialize only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Use a distinct App ID for this project's data separation
export const APP_ID = typeof window !== 'undefined' && (window as any).__app_id 
  ? (window as any).__app_id 
  : 'coursetify';