import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { 
  Pejuang, 
  AdminUser, 
  ChecklistFormSubmission, 
  SystemNotification 
} from "../types";

const LOCAL_STORAGE_KEYS = {
  PEJUANG: "albahjah_pejuang_v1",
  ADMINS: "albahjah_admins_v1",
  CHECKLISTS: "albahjah_checklists_v1",
  NOTIFICATIONS: "albahjah_notifications_v1",
  DOCUMENTS: "albahjah_documents_v1",
  ACTIVITY_LOGS: "albahjah_activity_logs_v1"
};

// Helper to handle local storage read/write
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to save to localStorage. Quota may be exceeded. Clearing large caches.", e);
    // Try to free up space by removing the largest caches (documents and checklists)
    if (key !== LOCAL_STORAGE_KEYS.DOCUMENTS && key !== LOCAL_STORAGE_KEYS.CHECKLISTS) {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CHECKLISTS);
        localStorage.setItem(key, JSON.stringify(value)); // Retry after clearing
      } catch (retryError) {
        console.warn("Still failed to save after clearing space.", retryError);
      }
    }
  }
}

// --- PEJUANG SERVICES ---
export async function fetchPejuangList(): Promise<Pejuang[]> {
  try {
    const colRef = collection(db, "pejuang");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pejuang));
      setLocal(LOCAL_STORAGE_KEYS.PEJUANG, list);
      return list;
  } catch (e) {
    console.warn("Firestore fetchPejuang failed, using fallback:", e);
  }
  return getLocal<Pejuang[]>(LOCAL_STORAGE_KEYS.PEJUANG, []);
}

export async function savePejuang(pejuang: Pejuang): Promise<void> {
  // Save to Local
  const current = getLocal<Pejuang[]>(LOCAL_STORAGE_KEYS.PEJUANG, []);
  const idx = current.findIndex(p => p.id === pejuang.id);
  let updated = [...current];
  if (idx >= 0) {
    updated[idx] = pejuang;
  } else {
    updated.push(pejuang);
  }
  setLocal(LOCAL_STORAGE_KEYS.PEJUANG, updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, "pejuang", pejuang.id);
    const safeData = JSON.parse(JSON.stringify(pejuang));
    await setDoc(docRef, safeData, { merge: true });
  } catch (e) {
    console.error("Firestore savePejuang error:", e);
  }
}

export async function deletePejuang(id: string): Promise<void> {
  const current = getLocal<Pejuang[]>(LOCAL_STORAGE_KEYS.PEJUANG, []);
  const updated = current.filter(p => p.id !== id);
  setLocal(LOCAL_STORAGE_KEYS.PEJUANG, updated);

  try {
    await deleteDoc(doc(db, "pejuang", id));
  } catch (e) {
    console.error("Firestore deletePejuang error:", e);
  }
}

// --- ADMIN USERS SERVICES ---
export async function fetchAdminList(): Promise<AdminUser[]> {
  try {
    const colRef = collection(db, "adminUsers");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
      setLocal(LOCAL_STORAGE_KEYS.ADMINS, list);
      return list;
  } catch (e) {
    console.warn("Firestore fetchAdminList failed, using fallback:", e);
  }
  return getLocal<AdminUser[]>(LOCAL_STORAGE_KEYS.ADMINS, []);
}

export async function saveAdminUser(admin: AdminUser): Promise<void> {
  const current = getLocal<AdminUser[]>(LOCAL_STORAGE_KEYS.ADMINS, []);
  const idx = current.findIndex(a => a.id === admin.id);
  let updated = [...current];
  if (idx >= 0) {
    updated[idx] = admin;
  } else {
    updated.push(admin);
  }
  setLocal(LOCAL_STORAGE_KEYS.ADMINS, updated);

  try {
    const docRef = doc(db, "adminUsers", admin.id);
    const safeData = JSON.parse(JSON.stringify(admin));
    await setDoc(docRef, safeData, { merge: true });
  } catch (e) {
    console.error("Firestore saveAdminUser error:", e);
  }
}

// --- DOCUMENT UPLOAD SERVICES ---
export async function deleteAdmin(id: string): Promise<void> {
  try {
    const docRef = doc(db, "admins", id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Firestore deleteAdmin error:", e);
    const current = getLocal<any[]>(LOCAL_STORAGE_KEYS.ADMINS, []);
    setLocal(LOCAL_STORAGE_KEYS.ADMINS, current.filter(a => a.id !== id));
  }
}

export async function deleteChecklistsByMonthAndYear(bulan: number, tahun: number): Promise<void> {
  try {
    const q = query(
      collection(db, "checklistSubmissions"),
      where("bulan", "==", bulan),
      where("tahun", "==", tahun)
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (e) {
    console.error("Firestore deleteChecklistsByMonthAndYear error:", e);
    const current = getLocal<ChecklistFormSubmission[]>(LOCAL_STORAGE_KEYS.CHECKLISTS, []);
    setLocal(LOCAL_STORAGE_KEYS.CHECKLISTS, current.filter(c => c.bulan !== bulan || c.tahun !== tahun));
  }
}

export async function fetchDocumentUploads(): Promise<any[]> {
  try {
    const colRef = collection(db, "documentUploads");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocal(LOCAL_STORAGE_KEYS.DOCUMENTS, list);
      return list;
  } catch (e) {
    console.warn("Firestore fetchDocumentUploads failed, using fallback:", e);
  }
  return getLocal<any[]>(LOCAL_STORAGE_KEYS.DOCUMENTS, []);
}

export async function saveDocumentUpload(docUpload: any): Promise<void> {
  const current = getLocal<any[]>(LOCAL_STORAGE_KEYS.DOCUMENTS, []);
  const idx = current.findIndex(d => d.id === docUpload.id);
  let updated = [...current];
  if (idx >= 0) {
    updated[idx] = docUpload;
  } else {
    updated.push(docUpload);
  }
  setLocal(LOCAL_STORAGE_KEYS.DOCUMENTS, updated);

  try {
    const docRef = doc(db, "documentUploads", docUpload.id);
    const safeData = JSON.parse(JSON.stringify(docUpload));
    await setDoc(docRef, safeData, { merge: true });
  } catch (e) {
    console.error("Firestore saveDocumentUpload error:", e);
  }
}

export async function fetchChecklistSubmissions(): Promise<ChecklistFormSubmission[]> {
  try {
    const colRef = collection(db, "checklistSubmissions");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChecklistFormSubmission));
      setLocal(LOCAL_STORAGE_KEYS.CHECKLISTS, list);
      return list;
  } catch (e) {
    console.warn("Firestore fetchChecklistSubmissions failed, using fallback:", e);
  }
  return getLocal<ChecklistFormSubmission[]>(LOCAL_STORAGE_KEYS.CHECKLISTS, []);
}

export async function saveChecklistSubmission(form: ChecklistFormSubmission): Promise<void> {
  const current = getLocal<ChecklistFormSubmission[]>(LOCAL_STORAGE_KEYS.CHECKLISTS, []);
  const idx = current.findIndex(c => c.id === form.id);
  let updated = [...current];
  if (idx >= 0) {
    updated[idx] = form;
  } else {
    updated.push(form);
  }
  setLocal(LOCAL_STORAGE_KEYS.CHECKLISTS, updated);

  try {
    const docRef = doc(db, "checklistSubmissions", form.id);
    const safeData = JSON.parse(JSON.stringify(form));
    await setDoc(docRef, safeData, { merge: true });
  } catch (e) {
    console.error("Firestore saveChecklistSubmission error:", e);
  }
}


export async function deleteChecklistSubmission(id: string): Promise<void> {
  try {
    const docRef = doc(db, "checklistSubmissions", id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Firestore deleteChecklistSubmission error:", e);
    const current = getLocal<any[]>(LOCAL_STORAGE_KEYS.CHECKLISTS, []);
    setLocal(LOCAL_STORAGE_KEYS.CHECKLISTS, current.filter(c => c.id !== id));
  }
}

// --- NOTIFICATIONS SERVICES ---
export async function fetchNotifications(): Promise<SystemNotification[]> {
  try {
    const colRef = collection(db, "notifications");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemNotification));
      setLocal(LOCAL_STORAGE_KEYS.NOTIFICATIONS, list);
      return list;
  } catch (e) {
    console.warn("Firestore fetchNotifications failed, using fallback:", e);
  }
  return getLocal<SystemNotification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
}

export async function saveNotification(notif: SystemNotification): Promise<void> {
  const current = getLocal<SystemNotification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = [notif, ...current.filter(n => n.id !== notif.id)];
  setLocal(LOCAL_STORAGE_KEYS.NOTIFICATIONS, updated);

  try {
    const docRef = doc(db, "notifications", notif.id);
    const safeData = JSON.parse(JSON.stringify(notif));
    await setDoc(docRef, safeData, { merge: true });
  } catch (e) {
    console.error("Firestore saveNotification error:", e);
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const current = getLocal<SystemNotification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  setLocal(LOCAL_STORAGE_KEYS.NOTIFICATIONS, updated);

  try {
    const docRef = doc(db, "notifications", id);
    await setDoc(docRef, { isRead: true }, { merge: true });
  } catch (e) {
    console.error("Firestore markNotificationRead error:", e);
  }
}

// --- ACTIVITY LOGS SERVICES ---
export async function fetchActivityLogs(): Promise<any[]> {
  try {
    const colRef = collection(db, "activityLogs");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLocal(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS, list);
    return list;
  } catch (e) {
    console.warn("Firestore fetchActivityLogs failed, using fallback:", e);
  }
  return getLocal<any[]>(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS, []);
}

export async function saveActivityLog(log: any): Promise<void> {
  const current = getLocal<any[]>(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS, []);
  const updated = [log, ...current];
  setLocal(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS, updated);
  try {
    const docRef = doc(db, "activityLogs", log.id);
    await setDoc(docRef, log);
  } catch (e) {
    console.warn("Firestore saveActivityLog failed:", e);
  }
}

// --- BACKUP SERVICES ---
export async function saveBackup(month: number, year: number, data: any): Promise<void> {
  try {
    const docRef = doc(db, "backups", `backup_${year}_${month}`);
    await setDoc(docRef, {
      month,
      year,
      timestamp: new Date().toISOString(),
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.error("Firestore saveBackup error:", e);
  }
}


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

export async function fetchSholatAttendances(): Promise<any[]> {
  if (!db) return [];
  const q = query(collection(db, 'sholat_attendances'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveSholatAttendance(attendance: any): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'sholat_attendances', attendance.id);
  await setDoc(docRef, attendance);
}

export async function fetchSignatureLogo(): Promise<string | null> {
  try {
    const docRef = doc(db, "appSettings", "signature");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.url) return data.url;
    }
  } catch (e) {
    console.warn("Firestore fetchSignatureLogo failed:", e);
  }
  return localStorage.getItem("APP_SIGNATURE") || null;
}

export async function saveSignatureLogo(base64Url: string): Promise<void> {
  localStorage.setItem("APP_SIGNATURE", base64Url);
  try {
    const docRef = doc(db, "appSettings", "signature");
    await setDoc(docRef, { url: base64Url, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error("Firestore saveSignatureLogo error:", e);
  }
}
