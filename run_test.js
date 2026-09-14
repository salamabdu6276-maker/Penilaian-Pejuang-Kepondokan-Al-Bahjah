import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCYqWHNyDLgYy2vCJKJWA4fjj2y4iqMY8",
  authDomain: "penilaian-pejuang-kepondokan.firebaseapp.com",
  projectId: "penilaian-pejuang-kepondokan",
  storageBucket: "penilaian-pejuang-kepondokan.firebasestorage.app",
  messagingSenderId: "999105431444",
  appId: "1:999105431444:web:137ceaf23d239c8c86b181"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDocs(collection(db, "pejuang"))
  .then(snap => {
    console.log("Success! Docs:", snap.size);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });
