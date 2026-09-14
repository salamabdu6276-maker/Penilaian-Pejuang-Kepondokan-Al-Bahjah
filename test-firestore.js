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

async function testDefault() {
  try {
    const db = getFirestore(app);
    const colRef = collection(db, "pejuang");
    const snap = await getDocs(colRef);
    console.log("Default DB size:", snap.size);
  } catch(e) {
    console.error("Default DB error:", e.message);
  }
}

async function testNamed() {
  try {
    const db = getFirestore(app, "ai-studio-penilaianpejuang-12386939-3c5b-4faa-b25a-f4912309075d");
    const colRef = collection(db, "pejuang");
    const snap = await getDocs(colRef);
    console.log("Named DB size:", snap.size);
  } catch(e) {
    console.error("Named DB error:", e.message);
  }
}

testDefault().then(() => testNamed());
