import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const oldConfig = {
  projectId: "second-atlas-81ttq",
  apiKey: "AIzaSyDPyauhkkEQHL3BbxUY4A61lrmuBgf9Q3Y",
  authDomain: "second-atlas-81ttq.firebaseapp.com",
};

const newConfig = {
  apiKey: "AIzaSyDCYqWHNyDLgYy2vCJKJWA4fjj2y4iqMY8",
  authDomain: "penilaian-pejuang-kepondokan.firebaseapp.com",
  projectId: "penilaian-pejuang-kepondokan",
};

const oldApp = initializeApp(oldConfig, "old");
const oldDb = initializeFirestore(oldApp, { experimentalAutoDetectLongPolling: true }, "ai-studio-penilaianpejuang-12386939-3c5b-4faa-b25a-f4912309075d");

const newApp = initializeApp(newConfig, "new");
const newDb = getFirestore(newApp);

const collectionsToMigrate = [
  "sholat_attendances"
];

// Helper to wait
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function migrate() {
  console.log("Starting part 5 of migration...");
  for (const colName of collectionsToMigrate) {
    console.log(`Migrating collection: ${colName}...`);
    try {
      const oldColRef = collection(oldDb, colName);
      const snapshot = await getDocs(oldColRef);
      console.log(`Found ${snapshot.size} documents in ${colName}`);
      
      let count = 0;
      let alreadyMigrated = 0;
      for (const oldDoc of snapshot.docs) {
        if(count < 78) {
             // We skip the first 78, because they were migrated before we killed the task
             count++;
             continue;
        }
        
        try {
            const newDocRef = doc(newDb, colName, oldDoc.id);
            await setDoc(newDocRef, oldDoc.data());
            count++;
            await delay(1500); 
        } catch(writeErr) {
             console.error(`Failed to write doc ${oldDoc.id} in ${colName}:`, writeErr.message);
        }
      }
      console.log(`Successfully migrated the remaining documents for ${colName}. (Total: ${count})`);
    } catch (e) {
      console.error(`Error migrating collection ${colName}:`, e.message);
    }
  }
  console.log("Migration part 5 complete!");
  process.exit(0);
}

migrate();
