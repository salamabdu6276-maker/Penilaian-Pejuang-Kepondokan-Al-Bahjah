import React, { useState, useEffect } from 'react';
import { useAppLogo } from '../hooks/useAppLogo';
import { X, Printer, Award, Download } from 'lucide-react';
import { getHijriDate, GREGORIAN_MONTHS_ID } from '../utils/hijri';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from "motion/react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pejuangName: string;
  divisi: string;
  bulan: number;
  tahun: number;
  performa: number;
}

export default function CertificateModal({ isOpen, onClose, pejuangName, divisi, bulan, tahun, performa }: CertificateModalProps) {
  const appLogo = useAppLogo();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDownloadPDF = async () => {
    const certElement = document.getElementById('cert-content-inner');
    if (!certElement) return;

    setIsGenerating(true);
    try {
      const imgData = await htmlToImage.toJpeg(certElement, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      const monthName = GREGORIAN_MONTHS_ID[bulan - 1];
      const safeName = pejuangName.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Piagam_${safeName}_${monthName}_${tahun}.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const hijriDate = getHijriDate(new Date());
  const monthName = GREGORIAN_MONTHS_ID[bulan - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className={`relative bg-white dark:bg-slate-900 w-full shadow-2xl flex flex-col overflow-hidden ${
              isMobile 
                ? "h-[90vh] mt-auto rounded-t-3xl"
                : "max-w-5xl rounded-3xl max-h-[95vh]"
            }`}
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-slate-800/50">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
              </div>
            )}

            {/* Header Actions */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 gap-4 ${isMobile ? 'pt-2' : ''}`}>
              <div className="flex w-full justify-between items-center">
                <h2 className="text-xl font-bold flex items-center space-x-2 text-slate-800 dark:text-white">
                  <Award className="w-6 h-6 text-amber-500" />
                  <span className="truncate">Pratinjau Piagam</span>
                </h2>
                {isMobile && (
                  <button
                    onClick={onClose}
                    className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className={`flex space-x-3 ${isMobile ? 'w-full' : ''}`}>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className={`flex-1 sm:flex-none flex justify-center items-center space-x-2 ${isGenerating ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-5 py-2.5 rounded-xl transition-colors font-semibold shadow-md`}
                >
                  <Download className="w-4 h-4" />
                  <span>{isGenerating ? 'Memproses PDF...' : 'Unduh PDF Piagam'}</span>
                </button>
                {!isMobile && (
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Certificate Content Preview */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-200 dark:bg-slate-900 flex justify-center items-center pb-safe">
              
              {/* A4 Landscape Size Wrapper for html2canvas */}
              <div 
                id="cert-content-inner"
                className="bg-white w-[297mm] h-[210mm] shadow-xl relative overflow-hidden flex flex-col items-center justify-center border-[12mm] border-double border-amber-600 p-12 text-slate-900 shrink-0"
                style={{ 
                  transform: isMobile ? 'scale(0.3)' : 'scale(0.65)', 
                  transformOrigin: 'top center',
                  marginBottom: isMobile ? '-140mm' : '-70mm' // Adjust container height due to scale
                }}
              >
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d97706 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Corner Ornaments */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-600 rounded-tl-3xl"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-600 rounded-tr-3xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-600 rounded-bl-3xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-600 rounded-br-3xl"></div>

                {/* Header Logos */}
                <div className="flex items-center space-x-6 mb-8 z-10">
                  <img src={appLogo} alt="Logo Al-Bahjah" className="w-28 h-28 object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="text-center">
                    <h1 className="text-4xl font-black text-emerald-900 tracking-wider uppercase font-serif">Yayasan Al-Bahjah</h1>
                    <h2 className="text-2xl font-bold text-emerald-800 uppercase tracking-widest mt-1">Cabang Cirebon 1</h2>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-10 z-10 relative">
                  <div className="absolute -inset-4 bg-amber-100 blur-2xl opacity-50 rounded-full z-0"></div>
                  <h1 className="text-[64px] font-black text-amber-600 tracking-widest uppercase relative z-10" style={{ fontFamily: 'Georgia, serif' }}>PIAGAM PENGHARGAAN</h1>
                  <div className="w-64 h-1.5 bg-amber-500 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Body */}
                <div className="text-center z-10 space-y-6 max-w-4xl relative">
                  <p className="text-2xl text-slate-600 font-medium uppercase tracking-widest">Diberikan dengan penuh rasa bangga kepada:</p>
                  
                  <div className="relative inline-block mt-4 mb-8">
                    <h2 className="text-7xl font-black text-emerald-900 my-2 pb-4 inline-block px-16 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>{pejuangName}</h2>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>
                  </div>
                  
                  <p className="text-2xl text-slate-700 leading-relaxed font-medium px-12">
                    Atas dedikasi, kedisiplinan, dan pencapaian luar biasa sebagai <strong>Pejuang Kepondokan</strong> di divisi <strong className="text-emerald-800">{divisi}</strong>.
                  </p>
                  
                  <div className="bg-amber-50/80 inline-block px-8 py-4 rounded-3xl border-2 border-amber-200 mt-6 shadow-sm">
                    <p className="text-xl text-slate-700">
                      Telah mencapai tingkat performa konsisten sebesar <span className="text-4xl font-black text-amber-600 ml-2">{performa}%</span> 
                      <br /><span className="mt-2 inline-block">pada periode <strong className="text-emerald-800">{monthName} {tahun}</strong>.</span>
                    </p>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="w-full flex justify-between items-end mt-20 px-20 z-10">
                  <div className="text-center">
                    <Award className="w-28 h-28 text-amber-400 opacity-30 mx-auto mb-2" />
                    <p className="text-base font-bold text-slate-500 uppercase tracking-widest">Predikat Mumtaz</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg text-slate-700 mb-20">Cirebon, {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())} M / {hijriDate.formatted}</p>
                    <div className="w-64 h-0.5 bg-slate-400 mx-auto mb-2"></div>
                    <p className="text-xl font-bold text-slate-800">Kepala Pondok Pesantren</p>
                    <p className="text-lg text-slate-600">Al-Bahjah Cabang Cirebon 1</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
