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

async function check() {
  const pejuangSnap = await getDocs(collection(db, "pejuang"));
  console.log("Pejuang count:", pejuangSnap.size);
  
  const subSnap = await getDocs(collection(db, "checklistsSubmissions"));
  console.log("Submissions count:", subSnap.size);
  if (subSnap.size > 0) {
    const subs = [];
    subSnap.forEach(d => subs.push(d.data()));
    const months = subs.map(s => s.bulan + "/" + s.tahun);
    console.log("Submission months:", [...new Set(months)]);
  }
  process.exit(0);
}
check();
