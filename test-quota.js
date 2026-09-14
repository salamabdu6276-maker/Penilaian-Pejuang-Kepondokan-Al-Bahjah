import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";

const oldConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const oldApp = initializeApp(oldConfig, "old");
const oldDb = initializeFirestore(oldApp, { experimentalAutoDetectLongPolling: true }, oldConfig.firestoreDatabaseId || "(default)");

async function test() {
  try {
    const q = query(collection(oldDb, "pejuang"), limit(1));
    const snap = await getDocs(q);
    console.log("Success! Docs:", snap.size);
  } catch(e) {
    console.error("Failed:", e.message);
  }
}
test();
