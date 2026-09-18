
import React, { useState, useEffect } from "react";
import { useAppLogo } from '../hooks/useAppLogo';
import { 
  Building2, 
  Calendar, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  User, 
  ChevronDown 
} from "lucide-react";
import { Role, SystemNotification } from "../types";
import { getHijriDate, formatGregorianFull } from "../utils/hijri";

interface HeaderProps {
  role: Role;
  onRoleChange: (newRole: Role) => void;
  notifications: SystemNotification[];
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  notifications,
  onOpenNotifications
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const appLogo = useAppLogo();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hijri = getHijriDate(currentDate);
  const masehiFormatted = formatGregorianFull(currentDate);

  // Custom format to match "5 Agustus 2026"
  const masehiShort = `${currentDate.getDate()} ${currentDate.toLocaleDateString('id-ID', { month: 'long' })} ${currentDate.getFullYear()}`;

  return (
    <header className="bg-[#125841] text-white border-b border-emerald-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Agency Branding */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white p-2 rounded-2xl shadow-sm border border-emerald-600/30 flex items-center justify-center shrink-0">
              <img 
                key={appLogo}
                src={appLogo} 
                alt="Logo Al-Bahjah" 
                className="w-full h-full object-contain drop-shadow-xs" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                Sistem Penilaian Pejuang Kepondokan
              </h1>
              <p className="text-sm font-medium text-emerald-100/90 mt-0.5">
                Yayasan Al-Bahjah Cabang Cirebon 1
              </p>
            </div>
          </div>

          {/* Right Side: Hijri/Masehi Date Widget & Role Switcher */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-[#176a51]">
            
            {/* Automatic Hijri & Gregorian Calendar Widget */}
            <div className="flex items-center space-x-3 bg-[#0a3829] px-4 py-2.5 rounded-xl border border-emerald-800/50">
              <div className="flex flex-col text-right">
                 <span className="font-bold text-white text-sm">{masehiShort}</span>
                 <span className="font-bold text-amber-400 text-[13px]">{hijri.formatted}</span>
              </div>
              <Calendar className="w-6 h-6 text-emerald-400/80" />
            </div>

            {/* Real-time Notifications Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="relative p-2.5 text-emerald-100 hover:text-white hover:bg-[#176a51] rounded-xl transition-colors border border-[#176a51]"
              title="Notifikasi Real-Time"
            >
              <Bell className="w-5 h-5 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#125841]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </header>
  );
};
