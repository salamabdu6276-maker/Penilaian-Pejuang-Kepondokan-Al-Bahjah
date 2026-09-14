import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  onDelete: () => void;
  label?: string;
  className?: string;
}

export const AnimatedDeleteButton: React.FC<Props> = ({ onDelete, label = "", className = "" }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    triggerHaptic("heavy");
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
        setIsDeleting(false);
      }, 1200);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isDeleting}
      animate={{ width: isDeleting ? (label ? 40 : 'auto') : 'auto' }}
      className={`relative flex items-center justify-center overflow-hidden rounded-full font-medium transition-colors disabled:cursor-not-allowed ${
        className.includes('bg-') ? className : `bg-rose-600 text-white hover:bg-rose-700 ${className}`
      } ${label ? 'px-3 py-1.5' : 'p-1.5'}`}
      style={{ whiteSpace: 'nowrap' }}
    >
      <div className="flex items-center gap-1.5">
        <motion.div
           className="relative z-10 flex items-center justify-center"
           animate={isDeleting ? { rotate: [-10, 10, -10, 10, 0] } : {}}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <motion.g
               animate={isDeleting ? { y: -4, rotate: -20, x: -2 } : { y: 0, rotate: 0, x: 0 }}
               transition={{ duration: 0.3, repeat: 1, repeatType: "reverse", delay: 0.1 }}
               style={{ transformOrigin: 'left center' }}
             >
               <path d="M3 6h18" />
               <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
             </motion.g>
             <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
           </svg>
        </motion.div>
        
        <AnimatePresence>
          {!isDeleting && label && (
            <motion.span
              initial={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.2 }}
              transition={{ duration: 0.3 }}
              className="text-xs"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};
