import re

with open('src/services/dbService.ts', 'r') as f:
    content = f.read()

logo_code = """
import { doc, getDoc, setDoc } from "firebase/firestore";

// --- APP SETTINGS SERVICES ---
export async function fetchAppLogo(): Promise<string | null> {
  try {
    const docRef = doc(db, "appSettings", "logo");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.url) return data.url;
    }
  } catch (e) {
    console.warn("Firestore fetchAppLogo failed:", e);
  }
  return localStorage.getItem("APP_LOGO") || null;
}

export async function saveAppLogo(base64Url: string): Promise<void> {
  localStorage.setItem("APP_LOGO", base64Url);
  try {
    const docRef = doc(db, "appSettings", "logo");
    await setDoc(docRef, { url: base64Url, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error("Firestore saveAppLogo error:", e);
  }
}
"""

if "export async function fetchAppLogo" not in content:
    # Need to add getDoc to imports if not there.
    if "getDoc" not in content:
        content = content.replace('getDocs,', 'getDocs, getDoc,')
    content += logo_code

with open('src/services/dbService.ts', 'w') as f:
    f.write(content)
