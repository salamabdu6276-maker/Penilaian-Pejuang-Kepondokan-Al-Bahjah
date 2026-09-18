import React, { useState, useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Edit2, 
  Check, 
  X, 
  ChevronRight, 
  Calendar, 
  User,
  Sliders
} from 'lucide-react';
import { Pejuang, ChecklistFormSubmission, Role } from '../types';
import { getAllBadgesWithProgress, Badge } from '../utils/badges';
import { PejuangBadgeShowcase, renderBadgeIcon } from './PejuangBadgeShowcase';
import { updatePejuangTarget } from '../services/dbService';
import { GREGORIAN_MONTHS_ID } from '../utils/hijri';

interface Props {
  pejuangList: Pejuang[];
  submissions: ChecklistFormSubmission[];
  selectedMonth: number;
  selectedYear: number;
  selectedWeek: number;
  role: Role;
  onNavigateToChecklist: () => void;
  attendances?: any[];
  onPejuangTargetUpdated?: (pejuangId: string, newTarget: number) => void;
}

export const PejuangWeeklyTargetWidget: React.FC<Props> = ({
  pejuangList,
  submissions,
  selectedMonth,
  selectedYear,
  selectedWeek,
  role,
  onNavigateToChecklist,
  attendances = [],
  onPejuangTargetUpdated
}) => {
  // Active Pejuang selection from localStorage or first active pejuang
  const [activePejuangId, setActivePejuangId] = useState<string>(() => {
    const saved = localStorage.getItem("myPejuangId");
    if (saved && pejuangList.some(p => p.id === saved)) return saved;
    const firstActive = pejuangList.find(p => p.status === 'aktif');
    return firstActive ? firstActive.id : pejuangList[0]?.id || "";
  });

  const activePejuang = useMemo(() => {
    return pejuangList.find(p => p.id === activePejuangId) || pejuangList[0] || null;
  }, [pejuangList, activePejuangId]);

  // Target Mingguan State
  const defaultTarget = useMemo(() => {
    if (activePejuang?.targetMingguan) return activePejuang.targetMingguan;
    const stored = Number(localStorage.getItem(`pejuang_target_${activePejuangId}`));
    return stored || 80;
  }, [activePejuang, activePejuangId]);

  const [currentTarget, setCurrentTarget] = useState<number>(defaultTarget);
  const [isEditingTarget, setIsEditingTarget] = useState<boolean>(false);
  const [tempTarget, setTempTarget] = useState<number>(defaultTarget);
  const [showAllBadgesModal, setShowAllBadgesModal] = useState<boolean>(false);
  const [isSavingTarget, setIsSavingTarget] = useState<boolean>(false);

  // Sync when activePejuang changes
  React.useEffect(() => {
    const val = activePejuang?.targetMingguan || Number(localStorage.getItem(`pejuang_target_${activePejuangId}`)) || 80;
    setCurrentTarget(val);
    setTempTarget(val);
    setIsEditingTarget(false);
  }, [activePejuang, activePejuangId]);

  // Submissions for this pejuang
  const pejuangMonthSubs = useMemo(() => {
    return submissions.filter(s => 
      s.pejuangId === activePejuangId && 
      s.bulan === selectedMonth && 
      s.tahun === selectedYear
    );
  }, [submissions, activePejuangId, selectedMonth, selectedYear]);

  // Current active week submission
  const currentWeekSub = useMemo(() => {
    return pejuangMonthSubs.find(s => s.pekan === selectedWeek) || null;
  }, [pejuangMonthSubs, selectedWeek]);

  // Current Week Score & Status
  const currentScore = currentWeekSub ? currentWeekSub.percentage : 0;
  const isFilled = currentWeekSub !== null;
  const isTargetAchieved = isFilled && currentScore >= currentTarget;
  const diffFromTarget = currentScore - currentTarget;

  // Badges Calculation for Active Pejuang
  const badges = useMemo(() => {
    if (!activePejuangId) return [];
    return getAllBadgesWithProgress(
      submissions,
      activePejuangId,
      attendances,
      currentTarget
    );
  }, [submissions, activePejuangId, attendances, currentTarget]);

  const earnedBadges = useMemo(() => badges.filter(b => b.isEarned), [badges]);

  // Save Target Handler
  const handleSaveTarget = async () => {
    if (tempTarget < 10 || tempTarget > 100) return;
    setIsSavingTarget(true);
    try {
      await updatePejuangTarget(activePejuangId, tempTarget);
      setCurrentTarget(tempTarget);
      setIsEditingTarget(false);
      if (onPejuangTargetUpdated) {
        onPejuangTargetUpdated(activePejuangId, tempTarget);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTarget(false);
    }
  };

  if (!activePejuang) {
    return null;
  }

  // Color theme based on progress
  const getProgressColor = () => {
    if (!isFilled) return "bg-slate-300 dark:bg-slate-700";
    if (currentScore >= currentTarget) return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]";
    if (currentScore >= currentTarget - 15) return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]";
    return "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]";
  };

  const getStatusBadge = () => {
    if (!isFilled) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5" /> Belum Diisi Pekan Ini
        </span>
      );
    }
    if (isTargetAchieved) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 
          Target Tercapai! (+{diffFromTarget}%)
        </span>
      );
    }
    if (currentScore >= currentTarget - 15) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 
          Mendekati Target (Kurang {Math.abs(diffFromTarget)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> 
        Perlu Peningkatan (Kurang {Math.abs(diffFromTarget)}%)
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-7 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOP: Pejuang Profile Bar & Target Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-700/60 relative z-10">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xl flex items-center justify-center overflow-hidden border-2 border-emerald-300 dark:border-emerald-700 shadow-sm shrink-0">
            {activePejuang.fotoUrl ? (
              <img src={activePejuang.fotoUrl} alt={activePejuang.nama} className="w-full h-full object-cover" />
            ) : (
              activePejuang.nama.charAt(0)
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {activePejuang.nama}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {activePejuang.subDivisi}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {activePejuang.amanah} &bull; Periode: <span className="font-bold text-slate-700 dark:text-slate-300">{GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}</span>
            </p>
          </div>
        </div>

        {/* Pejuang Selector & Action */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 shadow-2xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Pilih Pejuang:</span>
            <select
              value={activePejuangId}
              onChange={(e) => {
                setActivePejuangId(e.target.value);
                localStorage.setItem("myPejuangId", e.target.value);
              }}
              className="bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {pejuangList.map(p => (
                <option key={p.id} value={p.id} className="dark:bg-slate-800">
                  {p.nama} ({p.subDivisi})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onNavigateToChecklist}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors"
          >
            <span>Isi Form Pekan Ini</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MIDDLE: Weekly Target Monitor with Dynamic Visual Progress Bar */}
      <div className="space-y-4 relative z-10">
        {/* Header & Target Modifier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  Monitoring Target Mingguan (Pekan {selectedWeek})
                </h4>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target capaian performa tugas dan kedisiplinan individu
              </p>
            </div>
          </div>

          {/* Target Value & Edit Button */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-600">
            {isEditingTarget ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={20}
                  max={100}
                  step={5}
                  value={tempTarget}
                  onChange={(e) => setTempTarget(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border border-emerald-500 rounded-lg text-xs font-bold text-center text-slate-800 dark:text-slate-100 focus:outline-none"
                  autoFocus
                />
                <span className="text-xs font-bold text-slate-500">%</span>
                <button
                  type="button"
                  onClick={handleSaveTarget}
                  disabled={isSavingTarget}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  title="Simpan Target"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempTarget(currentTarget);
                    setIsEditingTarget(false);
                  }}
                  className="p-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                  title="Batal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Target Individu</span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 leading-none">
                    {currentTarget}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(true)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-2xs"
                  title="Ubah Target Mingguan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BIG DYNAMIC PROGRESS BAR */}
        <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          {/* Numbers Row */}
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Realisasi Pekan {selectedWeek}:</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-3xl font-black ${
                  !isFilled 
                    ? 'text-slate-400' 
                    : isTargetAchieved 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : currentScore >= currentTarget - 15 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {isFilled ? `${currentScore}%` : '0%'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {isFilled ? `/ Target ${currentTarget}%` : '(Belum ada input form)'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                {isTargetAchieved 
                  ? 'Status: Memenuhi Target' 
                  : isFilled 
                  ? `Selisih Target: ${diffFromTarget}%` 
                  : 'Status: Belum Terisi'}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isFilled 
                  ? `Predikat ${currentScore >= 91 ? 'A (Istimewa)' : currentScore >= 76 ? 'B (Baik)' : currentScore >= 40 ? 'C (Cukup)' : 'D (Kurang)'}` 
                  : 'Silakan isi evaluasi pekan ini'}
              </span>
            </div>
          </div>

          {/* Interactive Visual Bar with Target Pin/Marker */}
          <div className="relative pt-6 pb-2">
            {/* Target Needle / Pin above the bar */}
            <div 
              className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-20 transition-all duration-300"
              style={{ left: `${currentTarget}%` }}
            >
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs whitespace-nowrap">
                Target {currentTarget}%
              </span>
              <div className="w-1.5 h-1.5 bg-slate-800 dark:bg-slate-100 rotate-45 -mt-0.5"></div>
            </div>

            {/* Background Track */}
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative shadow-inner">
              {/* Dynamic Fill Bar */}
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
                style={{ width: `${Math.min(currentScore, 100)}%` }}
              />
            </div>

            {/* Target Marker Guideline */}
            <div 
              className="absolute top-6 bottom-2 w-0.5 bg-slate-800/60 dark:bg-slate-200/60 border-dashed z-10 pointer-events-none"
              style={{ left: `${currentTarget}%` }}
            />

            {/* Scale Markers */}
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5 px-0.5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Month Week-by-Week Progress Strip (Pekan 1 s/d Pekan 5) */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-2">
              Progres Evaluasi Seluruh Pekan ({GREGORIAN_MONTHS_ID[selectedMonth - 1]}):
            </span>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((w) => {
                const sub = pejuangMonthSubs.find(s => s.pekan === w);
                const score = sub ? sub.percentage : null;
                const passed = score !== null && score >= currentTarget;
                const isCurrent = w === selectedWeek;

                return (
                  <div 
                    key={w} 
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isCurrent 
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Pekan {w}</span>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-sm font-black">
                      {score !== null ? (
                        <span className={passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                          {score}%
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">-</span>
                      )}
                    </div>
                    <div className="mt-1">
                      {score !== null ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          passed 
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        }`}>
                          {passed ? 'Tercapai' : 'Belum'}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-medium">Kosong</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Integrated Digital Badges Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Lencana Digital Pengurus & Pejuang
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {earnedBadges.length} dari {badges.length} lencana telah dibuka oleh {activePejuang.nama}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAllBadgesModal(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>Lihat Semua Kriteria Lencana ({badges.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Badges Row */}
        <PejuangBadgeShowcase 
          badges={badges} 
          pejuangNama={activePejuang.nama} 
          compact={true} 
        />
      </div>

      {/* MODAL: Full Badges Showcase */}
      {showAllBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Koleksi Lencana Digital Pejuang
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activePejuang.nama} ({activePejuang.subDivisi})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllBadgesModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PejuangBadgeShowcase 
              badges={badges} 
              pejuangNama={activePejuang.nama} 
              compact={false} 
            />

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowAllBadgesModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                Tutup Galeri Lencana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
