import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const newConfig = {
  apiKey: "AIzaSyDCYqWHNyDLgYy2vCJKJWA4fjj2y4iqMY8",
  authDomain: "penilaian-pejuang-kepondokan.firebaseapp.com",
  projectId: "penilaian-pejuang-kepondokan",
};

const newApp = initializeApp(newConfig, "new");
const newDb = getFirestore(newApp);

async function check() {
  const collections = [
      "pejuang",
      "adminUsers",
      "admins",
      "checklistSubmissions",
      "documentUploads",
      "notifications",
      "activityLogs",
      "backups",
      "appSettings",
      "sholat_attendances"
  ];
  
  for (const col of collections) {
      try {
        const snap = await getDocs(collection(newDb, col));
        console.log(`Collection ${col}: ${snap.size} documents.`);
      } catch(e) {
        console.error(`Error reading ${col}:`, e.message);
      }
  }
  process.exit(0);
}
check();
