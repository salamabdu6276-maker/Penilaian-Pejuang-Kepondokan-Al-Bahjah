import React, { useEffect, useState } from "react";
import { X, Bell, CheckCircle, AlertTriangle, MessageSquare, Award, Minus } from "lucide-react";
import { SystemNotification } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:justify-end sm:justify-center items-end md:items-start overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className={`relative w-full bg-white flex flex-col shadow-2xl ${
              isMobile
                ? "h-[85vh] rounded-t-3xl"
                : "max-w-md h-full border-l border-slate-200"
            }`}
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className={`p-4 ${isMobile ? 'pt-2' : 'bg-slate-900 text-white'} flex items-center justify-between border-b ${isMobile ? 'border-slate-100' : 'border-slate-800'}`}>
              <div className="flex items-center space-x-2">
                <Bell className={`w-5 h-5 ${isMobile ? 'text-emerald-500' : 'text-amber-400'}`} />
                <h3 className={`font-bold text-sm ${isMobile ? 'text-slate-900' : 'text-white'}`}>Notifikasi Real-Time</h3>
              </div>
              <div className="flex items-center space-x-2">
                {notifications.some(n => !n.isRead) && (
                  <button
                    onClick={onMarkAllRead}
                    className={`text-xs px-2 py-1 rounded transition-colors border ${
                      isMobile
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    Tandai Dibaca
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`p-1 rounded-full transition-colors ${
                    isMobile ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  Belum ada notifikasi pencapaian atau evaluasi saat ini.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      n.isRead
                        ? "bg-slate-50 border-slate-200 text-slate-600 opacity-80"
                        : "bg-emerald-50/90 border-emerald-300 text-slate-900 font-medium shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {n.type === "achievement" && <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                        {n.type === "alert" && <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                        {n.type === "coaching" && <MessageSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                        {n.type === "reminder" && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{n.date}</span>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500 pb-safe">
              Notifikasi diperbarui secara otomatis.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
