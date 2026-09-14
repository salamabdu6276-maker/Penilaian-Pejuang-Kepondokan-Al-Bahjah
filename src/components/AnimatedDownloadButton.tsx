import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  onClick: () => void | Promise<void>;
  label?: string;
  className?: string;
}

export const AnimatedDownloadButton: React.FC<Props> = ({ onClick, label = "Download", className = "" }) => {
  const [status, setStatus] = useState<"idle" | "downloading" | "done">("idle");

  const handleClick = async () => {
    if (status !== "idle") return;
    setStatus("downloading");
    triggerHaptic("medium");
    
    // Fake progress delay to show animation
    setTimeout(async () => {
      try {
        await onClick();
      } finally {
        setStatus("done");
        triggerHaptic("success");
        setTimeout(() => setStatus("idle"), 2000);
      }
    }, 1500);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={status !== "idle"}
      animate={{
        width: status === "downloading" ? 140 : 'auto',
      }}
      className={`relative flex items-center justify-center overflow-hidden rounded-full font-bold transition-colors disabled:cursor-wait ${
        status === "done" ? "bg-emerald-600 text-white" : className.includes('bg-') ? className : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
      } ${label ? 'px-3 py-1.5' : 'p-1.5'} h-8`}
      style={{ whiteSpace: 'nowrap', minWidth: status === 'downloading' ? 140 : 'auto' }}
    >
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-xs relative z-10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{label}</span>
          </motion.div>
        )}
        
        {status === "downloading" && (
          <motion.div
            key="downloading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-indigo-50"
          >
            <motion.div
              className="h-full bg-indigo-600 absolute left-0 top-0 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="relative z-10 text-[10px] text-white font-bold tracking-wider uppercase"
            >
              Downloading
            </motion.span>
          </motion.div>
        )}

        {status === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs relative z-10"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selesai</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
