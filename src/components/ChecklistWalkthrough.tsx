import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  HelpCircle, 
  Copy, 
  Check 
} from 'lucide-react';

interface ChecklistWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onStepChange?: (stepIndex: number) => void;
}

interface StepItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tips: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  targetElementId?: string;
}

const WALKTHROUGH_STEPS: StepItem[] = [
  {
    id: 'intro',
    title: 'Selamat Datang di Form Checklist',
    subtitle: 'Panduan Praktis Pengurus Baru',
    description: 'Formulir ini digunakan oleh Pengurus dan Evaluator Pondok untuk mencatat, memvalidasi, dan menilai ketercapaian amanah harian Pejuang secara presisi.',
    tips: 'Setiap checklist yang Anda simpan akan langsung memperbarui grafik performa, rekapan bulanan, serta peringkat Top Pejuang di Dashboard.',
    icon: Sparkles,
    accentColor: 'from-emerald-600 to-teal-700',
    targetElementId: 'checklist-input-view',
  },
  {
    id: 'selection',
    title: 'Pilih Pejuang & Periode',
    subtitle: 'Langkah 1: Identifikasi Data',
    description: 'Pilih nama Pejuang yang akan dinilai dari dropdown. Tentukan Bulan, Tahun, dan Pekan ke berapa (Pekan 1 sampai 5) yang sedang dievaluasi.',
    tips: 'Rentang tanggal kalender Masehi akan otomatis terkalkulasi sesuai pekan yang dipilih.',
    icon: Users,
    accentColor: 'from-blue-600 to-indigo-700',
    targetElementId: 'walkthrough-pejuang-select',
  },
  {
    id: 'table',
    title: 'Centang Rencana & Realisasi',
    subtitle: 'Langkah 2: Validasi Tugas Harian',
    description: 'Setiap tugas memiliki 2 baris centang: "Rencana" (target yang diagendakan) dan "Realisasi" (kegiatan yang benar-benar dikerjakan pada hari tersebut).',
    tips: 'Gunakan tombol centang cepat (ikon centang di ujung kanan baris) untuk mengisi semua hari sekaligus dengan 1 klik.',
    icon: CheckCircle2,
    accentColor: 'from-emerald-600 to-green-700',
    targetElementId: 'walkthrough-table',
  },
  {
    id: 'categories',
    title: 'Kategori Tugas (A, B, C)',
    subtitle: 'Langkah 3: Pembobotan & Tugas Custom',
    description: 'Kegiatan dikelompokkan ke Kategori A (Ibadah & Qiyam Pondok), Kategori B (Amanah Rutin Divisi), dan Kategori C (Amanah Tambahan).',
    tips: 'Anda juga dapat menambahkan kegiatan kustom baru melalui form "Tambah Kegiatan Khusus" di bagian bawah tabel.',
    icon: Layers,
    accentColor: 'from-amber-600 to-orange-700',
    targetElementId: 'walkthrough-add-task',
  },
  {
    id: 'save',
    title: 'Simpan & Duplikasi Cepat',
    subtitle: 'Langkah 4: Finalisasi & Efisiensi Waktu',
    description: 'Setelah seluruh tugas terisi, klik tombol "Simpan Checklist". Skor persentase ketercapaian pejuang akan otomatis dikalkulasi dan disimpan ke database cloud.',
    tips: 'Untuk menghemat waktu, manfaatkan tombol "Salin Pekan Lalu" atau "Duplikat Checklist" ke rekan-rekan satu divisi.',
    icon: Save,
    accentColor: 'from-purple-600 to-pink-700',
    targetElementId: 'walkthrough-submit-btn',
  },
];

export const ChecklistWalkthrough: React.FC<ChecklistWalkthroughProps> = ({
  isOpen,
  onClose,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = WALKTHROUGH_STEPS[currentStep];
  const StepIcon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === WALKTHROUGH_STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onStepChange?.(next);
      
      // Highlight target element if present
      const targetId = WALKTHROUGH_STEPS[next].targetElementId;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onStepChange?.(prev);

      const targetId = WALKTHROUGH_STEPS[prev].targetElementId;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenChecklistWalkthrough', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        {/* Top Decorative Banner */}
        <div className={`p-6 bg-gradient-to-r ${step.accentColor} text-white relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                Langkah {currentStep + 1} dari {WALKTHROUGH_STEPS.length}
              </span>
            </div>
            <button
              onClick={handleComplete}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Tutup Panduan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <StepIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80">{step.subtitle}</p>
              <h3 className="text-xl font-extrabold tracking-tight text-white">{step.title}</h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-normal">
              <span className="font-bold text-slate-900 dark:text-slate-100 mr-1">Tips:</span>
              {step.tips}
            </p>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {WALKTHROUGH_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? 'w-7 bg-emerald-600 dark:bg-emerald-500' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                title={`Buka langkah ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleComplete}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-xl transition-colors"
          >
            Lewati Panduan
          </button>

          <div className="flex items-center space-x-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
            >
              <span>{isLast ? 'Mulai Mengisi Form' : 'Lanjut'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
