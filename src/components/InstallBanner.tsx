import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    // Check if already installed
    const isStandAloneMatch = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandAloneMatch || isIOSStandalone) {
      setIsStandalone(true);
      return;
    }
    
    setIsStandalone(false);

    // iOS Detection
    const ua = window.navigator.userAgent;
    const isDeviceIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isDeviceIOS);

    if (isDeviceIOS) {
      // Show iOS banner after a short delay
      setTimeout(() => setShowBanner(true), 2000);
    }

    // Android/Desktop PWA prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    triggerHaptic('medium');
    
    if (isIOS) {
      // iOS requires manual action, banner acts as instruction
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => {
    triggerHaptic('light');
    setShowBanner(false);
  };

  if (isStandalone || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        className="fixed top-4 left-4 right-4 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50 p-2.5 rounded-2xl">
            <Download className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Install Aplikasi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {isIOS 
                ? "Tap tombol Share di bawah lalu pilih 'Add to Home Screen' untuk akses lebih cepat."
                : "Install ke Home Screen untuk pengalaman seperti aplikasi native."}
            </p>
            
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Install Sekarang
              </button>
            )}
            {isIOS && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 inline-flex px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                <span>Tap</span> <Share className="w-3.5 h-3.5" /> <span>lalu Add to Home Screen</span>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
