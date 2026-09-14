import React, { useEffect, useState } from "react";
import { LayoutDashboard, FileSpreadsheet, Users, FileText, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Role } from "../types";
import { triggerHaptic } from "../utils/haptics";

export type TabType = "dashboard" | "checklist" | "settings" | "reports" | "documents";

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  role: Role;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  role
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "checklist", label: "Checklist", icon: FileSpreadsheet, adminOnly: true },
    { id: "settings", label: "Admin", icon: Users },
    { id: "reports", label: "Laporan", icon: FileText },
    { id: "documents", label: "Dokumen", icon: FileSpreadsheet }
  ];

  return (
    <nav className={`z-40 transition-all duration-500 ease-out ${isMobile ? 'fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[420px]' : 'sticky top-[61px] w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm'}`}>
      <div className={`mx-auto ${isMobile ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 rounded-full p-1.5 w-full' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        <div className={`flex ${isMobile ? 'justify-between items-center' : 'space-x-4 py-3 overflow-x-auto no-scrollbar'}`}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.adminOnly && role !== "admin";
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => { if (!isDisabled) { triggerHaptic("light"); onTabChange(tab.id as TabType); } }}
                disabled={isDisabled}
                className={`relative flex items-center justify-center rounded-full text-sm font-medium transition-colors z-10 ${
                  isMobile 
                    ? `h-12 ${isActive ? 'px-4 flex-1' : 'w-12 flex-shrink-0'}`
                    : `px-4 py-2.5 whitespace-nowrap space-x-2`
                } ${
                  isDisabled 
                    ? "text-slate-400 opacity-50 cursor-not-allowed"
                    : isActive
                      ? "text-emerald-900 dark:text-emerald-100 font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title={isDisabled ? "Akses Khusus Admin" : tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={`absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] z-[-1] ${!isMobile ? 'border border-slate-200 dark:border-slate-700' : ''}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <div className={`flex items-center justify-center ${isMobile && isActive ? 'space-x-2' : ''}`}>
                  <motion.div
                    animate={{ 
                      scale: isActive && isMobile ? 1.1 : 1,
                      color: isActive ? 'var(--tw-colors-emerald-600)' : 'currentColor'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive && !isMobile ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {(isActive || !isMobile) && (
                      <motion.span
                        initial={isMobile ? { opacity: 0, width: 0, scale: 0.8 } : false}
                        animate={isMobile ? { opacity: 1, width: "auto", scale: 1 } : {}}
                        exit={isMobile ? { opacity: 0, width: 0, scale: 0.8 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`overflow-hidden whitespace-nowrap ${isMobile ? 'text-[11px] font-bold tracking-wide text-emerald-800 dark:text-emerald-200' : ''}`}
                      >
                        {tab.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {isDisabled && !isMobile && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
                {isDisabled && isMobile && (
                  <div className="absolute top-1 right-1">
                    <Lock className="w-2.5 h-2.5 text-slate-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
