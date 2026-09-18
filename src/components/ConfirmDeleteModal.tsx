import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X, ShieldAlert } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  type: "pejuang" | "admin" | "checklist" | "umum";
  title?: string;
  targetName: string;
  targetSub?: string;
  warningMessage?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  type,
  title,
  targetName,
  targetSub,
  warningMessage,
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const defaultTitle = 
    type === "pejuang" 
      ? "Konfirmasi Hapus Data Pejuang" 
      : type === "admin" 
      ? "Konfirmasi Hapus Akun Admin" 
      : "Konfirmasi Penghapusan Data";

  const defaultWarning =
    type === "pejuang"
      ? "Tindakan ini tidak dapat dibatalkan. Riwayat checklist, capaian, dan performa pejuang ini akan dihapus dari sistem."
      : type === "admin"
      ? "Tindakan ini tidak dapat dibatalkan. Akun ini tidak akan dapat lagi mengakses panel administrasi."
      : "Data yang dihapus tidak dapat dipulihkan kembali.";

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-7 overflow-hidden"
          role="alertdialog"
          aria-modal="true"
        >
          {/* Header icon and close button */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/60 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {title || defaultTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            Apakah Anda yakin ingin menghapus data di bawah ini? Pastikan keputusan Anda sudah tepat untuk mencegah human error.
          </p>

          {/* Target details card */}
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-600/60 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                {type === "pejuang" ? "Pejuang" : type === "admin" ? "Admin" : "Data"}
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {targetName}
              </p>
            </div>
            {targetSub && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-0.5">
                {targetSub}
              </p>
            )}
          </div>

          {/* Warning Callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs mb-6 leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>{warningMessage || defaultWarning}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? "Menghapus..." : "Ya, Hapus Sekarang"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
