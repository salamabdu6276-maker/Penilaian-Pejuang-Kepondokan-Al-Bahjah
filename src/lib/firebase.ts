import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCYqWHNyDLgYy2vCJKJWA4fjj2y4iqMY8",
  authDomain: "penilaian-pejuang-kepondokan.firebaseapp.com",
  projectId: "penilaian-pejuang-kepondokan",
  storageBucket: "penilaian-pejuang-kepondokan.firebasestorage.app",
  messagingSenderId: "999105431444",
  appId: "1:999105431444:web:137ceaf23d239c8c86b181"
};

let app;
let db;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  // Initialize Firestore with explicit settings
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, db };
