import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyDCYqWHNyDLgYy2vCJKJWA4fjj2y4iqMY8",
  authDomain: "penilaian-pejuang-kepondokan.firebaseapp.com",
  projectId: "penilaian-pejuang-kepondokan"
});
const db = getFirestore(app);

async function check() {
  try {
    const snap = await getDocs(collection(db, "pejuang"));
    console.log("Success! size:", snap.size);
  } catch(e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
check();
