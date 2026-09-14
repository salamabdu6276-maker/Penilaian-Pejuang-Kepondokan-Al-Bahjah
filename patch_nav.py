import re

with open('src/components/Navigation.tsx', 'r') as f:
    content = f.read()

target = """export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  role
}) => {"""

new = """import { useEffect, useState } from "react";

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
  }, []);"""

content = content.replace(target, new)

target_nav = """  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-3 items-center relative">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.adminOnly && role !== "admin";
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => !isDisabled && onTabChange(tab.id as TabType)}
                disabled={isDisabled}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors z-10 ${
                  isDisabled 
                    ? "text-slate-400 opacity-60 cursor-not-allowed"
                    : isActive
                      ? "text-emerald-800 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title={isDisabled ? "Akses Khusus Admin" : tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full shadow-sm z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                <span>{tab.label}</span>
                {isDisabled && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );"""

new_nav = """  return (
    <nav className={`z-40 transition-all ${isMobile ? 'fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%]' : 'sticky top-[61px] w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm'}`}>
      <div className={`mx-auto ${isMobile ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-slate-200 dark:border-slate-700 rounded-full px-2 py-2 w-full max-w-sm' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        <div className={`flex ${isMobile ? 'justify-between items-center space-x-1' : 'space-x-4 py-3 overflow-x-auto no-scrollbar'}`}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.adminOnly && role !== "admin";
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => !isDisabled && onTabChange(tab.id as TabType)}
                disabled={isDisabled}
                className={`relative flex items-center justify-center rounded-full text-sm font-medium transition-colors z-10 ${
                  isMobile 
                    ? `h-12 ${isActive ? 'px-4 flex-1' : 'w-12 flex-shrink-0'}`
                    : `px-4 py-2.5 whitespace-nowrap space-x-2`
                } ${
                  isDisabled 
                    ? "text-slate-400 opacity-60 cursor-not-allowed"
                    : isActive
                      ? "text-emerald-800 dark:text-emerald-300 font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title={isDisabled ? "Akses Khusus Admin" : tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={`absolute inset-0 bg-emerald-100 dark:bg-emerald-900/50 rounded-full shadow-sm z-[-1] ${!isMobile ? 'border border-emerald-200 dark:border-emerald-800/50' : ''}`}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                
                <div className={`flex items-center justify-center ${isMobile && isActive ? 'space-x-2' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                  <AnimatePresence>
                    {(isActive || !isMobile) && (
                      <motion.span
                        initial={isMobile ? { opacity: 0, width: 0 } : false}
                        animate={isMobile ? { opacity: 1, width: "auto" } : {}}
                        exit={isMobile ? { opacity: 0, width: 0 } : {}}
                        className={`overflow-hidden whitespace-nowrap ${isMobile ? 'text-xs' : ''}`}
                      >
                        {tab.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {isDisabled && !isMobile && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );"""

content = content.replace(target_nav, new_nav)

with open('src/components/Navigation.tsx', 'w') as f:
    f.write(content)
print("Updated Navigation.tsx for mobile bottom tab")
