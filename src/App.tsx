/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Navigation, TabType } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { triggerHaptic } from './utils/haptics';
import { InstallBanner } from './components/InstallBanner';

import { ChecklistFormInput } from "./components/ChecklistFormInput";
import { AdminSettings } from "./components/AdminSettings";
import { ReportsView } from "./components/ReportsView";
import { NotificationModal } from "./components/NotificationModal";
import { 
  Pejuang, 
  AdminUser, 
  ChecklistFormSubmission, 
  SystemNotification, 
  Role 
} from "./types";
import { useAppLogo } from "./hooks/useAppLogo";
import { 
  fetchPejuangList, 
  savePejuang, 
  deletePejuang, 
  fetchAdminList, 
  saveAdminUser, 
  deleteAdmin,
  fetchChecklistSubmissions, 
  saveChecklistSubmission,
  deleteChecklistSubmission, 
  deleteChecklistsByMonthAndYear,
  fetchNotifications, 
  saveNotification, 
  markNotificationRead,
  saveBackup 
} from "./services/dbService";

import { Login } from "./components/Login";
import { DocumentUploadView } from "./components/DocumentUploadView";

function useSwipeGesture(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) onSwipeLeft();
      else onSwipeRight();
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd: onTouchEndEvent };
}

export default function App() {
  const appLogo = useAppLogo();
  
  useEffect(() => {
    if (appLogo) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = appLogo;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = appLogo;
        document.head.appendChild(newLink);
      }
    }
  }, [appLogo]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  const [role, setRole] = useState<Role>("guest");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const availableTabs: TabType[] = [
    "dashboard",
    ...(role === "admin" ? ["checklist" as TabType] : []),
    "settings",
    "reports",
    "documents"
  ];

  const handleSwipeLeft = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > -1 && currentIndex < availableTabs.length - 1) {
      triggerHaptic('medium');
      setActiveTab(availableTabs[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > 0) {
      triggerHaptic('medium');
      setActiveTab(availableTabs[currentIndex - 1]);
    }
  };

  const swipeHandlers = useSwipeGesture(handleSwipeLeft, handleSwipeRight);

  // State data
  const [pejuangList, setPejuangList] = useState<Pejuang[]>([]);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [submissions, setSubmissions] = useState<ChecklistFormSubmission[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);


  // Automatic weekly reminder (Monday 08:00 WIB)
  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      // Adjust to WIB (UTC+7)
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wibTime = new Date(utc + (3600000 * 7));
      
      const day = wibTime.getDay(); // 1 = Monday
      const hour = wibTime.getHours();
      
      // If Monday and >= 08:00 WIB
      if (day === 1 && hour >= 8) {
        // We use year+week as a unique key so we only remind once a week
        const year = wibTime.getFullYear();
        // Calculate week number simply
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (wibTime.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        const reminderKey = `reminder_w${weekNum}_${year}`;
        
        const lastReminder = localStorage.getItem('albahjah_last_reminder');
        if (lastReminder !== reminderKey) {
          const newNotif: SystemNotification = {
            id: `auto_remind_${Date.now()}`,
            title: `📅 Pengingat Form Checklist Mingguan`,
            message: `Assalamu'alaikum, jangan lupa untuk mengisi laporan performa checklist pejuang untuk pekan ini.`,
            date: wibTime.toLocaleDateString("id-ID"),
            type: "reminder",
            isRead: false
          };
          
          // Use setTimeout to ensure services are loaded or just call API
          saveNotification(newNotif).then(() => {
            setNotifications(prev => [newNotif as any, ...prev]);
            localStorage.setItem('albahjah_last_reminder', reminderKey);
            // Optionally open the drawer
            setIsNotifOpen(true);
          });
        }
      }
    };
    
    // Check initially and then every minute
    checkReminder();
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, []);


  // Automatic end of month backup
  useEffect(() => {
    const checkBackup = () => {
      const now = new Date();
      // Adjust to WIB (UTC+7)
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wibTime = new Date(utc + (3600000 * 7));
      
      const year = wibTime.getFullYear();
      const month = wibTime.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      
      const day = wibTime.getDate();
      
      // If it's the last day of the month
      if (day === lastDayOfMonth) {
        const backupKey = `backup_${month + 1}_${year}`;
        const lastBackup = localStorage.getItem('albahjah_last_backup');
        
        if (lastBackup !== backupKey && pejuangList.length > 0) {
          const performBackup = async () => {
            try {
              await saveBackup(month + 1, year, {
                pejuangList,
                adminList,
                submissions,
                notifications
              });
              localStorage.setItem('albahjah_last_backup', backupKey);
              console.log("Automatic monthly backup completed for", backupKey);
            } catch (e) {
              console.error("Backup failed", e);
            }
          };
          performBackup();
        }
      }
    };
    
    // Check initially and then every hour
    checkBackup();
    const interval = setInterval(checkBackup, 3600000);
    return () => clearInterval(interval);
  }, [pejuangList, adminList, submissions, notifications]);

  // Load initial data from Firebase/LocalStorage
  useEffect(() => {
    async function loadData() {
      const p = await fetchPejuangList();
      const a = await fetchAdminList();
      const c = await fetchChecklistSubmissions();
      const n = await fetchNotifications();

      setPejuangList(p);
      setAdminList(a);
      setSubmissions(c);
      setNotifications(n);
    }

    loadData();
  }, []);

  // Handlers for Pejuang CRUD
  const handleSavePejuang = async (pejuang: Pejuang) => {
    await savePejuang(pejuang);
    setPejuangList(prev => {
      const idx = prev.findIndex(p => p.id === pejuang.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = pejuang;
        return copy;
      }
      return [...prev, pejuang];
    });
  };

  const handleDeletePejuang = async (id: string) => {
    await deletePejuang(id);
    setPejuangList(prev => prev.filter(p => p.id !== id));
  };

  // Handlers for Admin CRUD
  const handleSaveAdmin = async (admin: AdminUser) => {
    await saveAdminUser(admin);
    setAdminList(prev => {
      const idx = prev.findIndex(a => a.id === admin.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = admin;
        return copy;
      }
      return [...prev, admin];
    });
  };

  const handleDeleteAdmin = async (id: string) => {
    await deleteAdmin(id);
    setAdminList(prev => prev.filter(a => a.id !== id));
  };

  const handleDeleteChecklist = async (id: string) => {
    await deleteChecklistSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteAllChecklistsByMonth = async (bulan: number, tahun: number) => {
    await deleteChecklistsByMonthAndYear(bulan, tahun);
    setSubmissions(prev => prev.filter(s => s.bulan !== bulan || s.tahun !== tahun));
  };

  // Handler for Checklist Submission Save
  const handleSaveSubmission = async (form: ChecklistFormSubmission) => {
    await saveChecklistSubmission(form);
    setSubmissions(prev => {
      const idx = prev.findIndex(c => c.id === form.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = form;
        return copy;
      }
      return [...prev, form];
    });

    // Check if target achievement is high (>= 85%) to trigger real-time notification
    if (form.percentage >= 85) {
      const newNotif: SystemNotification = {
        id: `notif_${Date.now()}`,
        title: `🏆 Pencapaian Target Pekan ${form.pekan}`,
        message: `MasyaAllah Tabarakallah! ${form.pejuangNama} (${form.subDivisi}) mencapai ${form.percentage}% ketercapaian checklist harian!`,
        date: new Date().toLocaleDateString("id-ID"),
        type: "achievement",
        pejuangId: form.pejuangId,
        isRead: false
      };
      await saveNotification(newNotif);
      setNotifications(prev => [newNotif, ...prev]);
    } else if (form.percentage < 70) {
      // Alert notification for underperforming pejuang
      const alertNotif: SystemNotification = {
        id: `notif_${Date.now()}`,
        title: `⚠️ Evaluasi Performa Pejuang`,
        message: `Perhatian: Performa ${form.pejuangNama} pada Pekan ${form.pekan} berada di angka ${form.percentage}%. Silakan persiapkan coaching personal oleh Lead Divisi.`,
        date: new Date().toLocaleDateString("id-ID"),
        type: "alert",
        pejuangId: form.pejuangId,
        isRead: false
      };
      await saveNotification(alertNotif);
      setNotifications(prev => [alertNotif, ...prev]);
    }
  };

  // Handler for Personal Coaching notification send
  const handleSendCoachingNotification = async (pejuangId: string, message: string) => {
    const pejuang = pejuangList.find(p => p.id === pejuangId);
    const newNotif: SystemNotification = {
      id: `coaching_${Date.now()}`,
      title: `💬 Personal Coaching: ${pejuang?.nama || 'Pejuang'}`,
      message,
      date: new Date().toLocaleDateString("id-ID"),
      type: "coaching",
      pejuangId,
      isRead: false
    };
    await saveNotification(newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handler for End of Period automated notification
  const handleTriggerPeriodNotification = async (message: string) => {
    const newNotif: SystemNotification = {
      id: `period_${Date.now()}`,
      title: `📅 Notifikasi Otomatis Periode Pelaporan`,
      message,
      date: new Date().toLocaleDateString("id-ID"),
      type: "reminder",
      isRead: false
    };
    await saveNotification(newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };

  
  const handleDeleteChecklistSubmission = async (id: string) => {
    await deleteChecklistSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  // Handler to mark notification read
  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await markNotificationRead(n.id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Load sample initial data (Optional Template button for user)
  const handleLoadSampleData = async () => {
    const samplePejuang: Pejuang[] = [
      {
        id: "pj_1",
        nama: "Muhammad Rosyad, S.Pd",
        subDivisi: "Kepondokan",
        amanah: "Kepala Pondok Cabang Cirebon 1",
        status: "aktif",
        createdAt: new Date().toISOString()
      },
      {
        id: "pj_2",
        nama: "Ustadz Abdullah Al-Hafiz",
        subDivisi: "Kurikulum & Pengajaran",
        amanah: "Kepala Diniyah & Tahfidz",
        status: "aktif",
        createdAt: new Date().toISOString()
      },
      {
        id: "pj_3",
        nama: "Ustadz Gunawan, M.Pd",
        subDivisi: "Sekretariat",
        amanah: "Ketua Al-Bahjah Cabang Cirebon 1",
        status: "aktif",
        createdAt: new Date().toISOString()
      },
      {
        id: "pj_4",
        nama: "Ustadz Ahmad Fauzi",
        subDivisi: "DKM / Takmir",
        amanah: "Pengasuh Takmir Masjid",
        status: "aktif",
        createdAt: new Date().toISOString()
      },
      {
        id: "pj_5",
        nama: "Ustadz Rizky Ramadhan",
        subDivisi: "Facility & Maintenance",
        amanah: "Koordinator Sarana Prasarana",
        status: "aktif",
        createdAt: new Date().toISOString()
      }
    ];

    for (const p of samplePejuang) {
      await savePejuang(p);
    }
    setPejuangList(samplePejuang);
    alert("Template contoh 5 Pejuang Al-Bahjah telah berhasil dimuat!");
  };

  return (
    <motion.div 
      initial={false}
      animate={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#0f172a' }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen font-sans flex flex-col transition-colors"
    >
      
      {/* Top Header */}
      <div className="print:hidden">
        <Header
        role={role}
        onRoleChange={setRole}
        notifications={notifications}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />
      </div>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-[5.5rem] md:bottom-6 right-6 z-50 p-3 rounded-full bg-slate-800 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg hover:scale-110 transition-transform"
        title="Toggle Dark Mode"
      >
        {darkMode ? (
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      {/* Main Navigation Tabs */}
      <div className="print:hidden">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        role={role}
      />
      </div>

      {/* Main Content Area */}
      <main 
        {...swipeHandlers}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36 md:pb-6 overflow-x-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <Dashboard
                pejuangList={pejuangList}
                submissions={submissions}
                role={role}
                onNavigateToChecklist={() => setActiveTab("checklist")}
                onNavigateToSettings={() => setActiveTab("settings")}
                onSendCoachingNotification={handleSendCoachingNotification}
              />
            )}

            {activeTab === "checklist" && (
              role === "guest" ? (
                <Login onLogin={setRole} adminList={adminList} />
              ) : (
                <ChecklistFormInput
                  pejuangList={pejuangList}
                  onSaveSubmission={handleSaveSubmission}
                  existingSubmissions={submissions}
                />
              )
            )}

            {activeTab === "settings" && (
              role === "guest" ? (
                <Login onLogin={setRole} adminList={adminList} />
              ) : (
                <AdminSettings
                  pejuangList={pejuangList}
                  adminList={adminList}
                  submissions={submissions}
                  onSavePejuang={handleSavePejuang}
                  onDeletePejuang={handleDeletePejuang}
                  onSaveAdmin={handleSaveAdmin}
                  onDeleteAdmin={handleDeleteAdmin}
                  onDeleteAllChecklistsByMonth={handleDeleteAllChecklistsByMonth}
                  onDeleteChecklist={handleDeleteChecklist}
                  onLoadSampleData={handleLoadSampleData}
                />
              )
            )}

            {activeTab === "reports" && (
              <ReportsView
                pejuangList={pejuangList}
                submissions={submissions}
                role={role}
                onTriggerPeriodNotification={handleTriggerPeriodNotification}
              />
            )}

            {activeTab === "documents" && (
              role === "guest" ? (
                <Login onLogin={setRole} adminList={adminList} />
              ) : (
                <DocumentUploadView pejuangList={pejuangList} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>


      {/* Real-time Notifications Drawer */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />
      
      {/* Floating Language Switcher */}
      <LanguageSwitcher />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-semibold text-slate-300">
            Sistem Penilaian Pejuang Al-Bahjah &copy; {new Date().getFullYear()} &bull; Created by Abdu Salam
          </p>
          <p className="font-bold text-slate-400 mt-2">
            YAYASAN AL-BAHJAH &bull; PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1
          </p>
          <p className="text-slate-500">
            Digitalisasi Form Checklist Konsorsium Kepondokan & Real-Time Performance Analytics System
          </p>
        </div>
      </footer>

    </motion.div>
  );
}
