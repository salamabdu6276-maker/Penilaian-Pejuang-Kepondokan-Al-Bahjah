import React, { useState } from 'react';
import { 
  Award, 
  Medal, 
  Star, 
  Zap, 
  ShieldCheck, 
  Moon, 
  Sun, 
  CheckCircle2, 
  TrendingUp, 
  Crown,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { Badge } from '../utils/badges';

interface Props {
  badges: Badge[];
  pejuangNama?: string;
  compact?: boolean;
}

export const renderBadgeIcon = (iconName: string, className: string = "w-4 h-4") => {
  switch (iconName) {
    case 'Award': return <Award className={className} />;
    case 'Medal': return <Medal className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Moon': return <Moon className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'CheckCircle2': return <CheckCircle2 className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Crown': return <Crown className={className} />;
    default: return <Award className={className} />;
  }
};

export const PejuangBadgeShowcase: React.FC<Props> = ({ badges, pejuangNama, compact = false }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'earned' | 'performa' | 'kehadiran'>('earned');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadges = badges.filter(b => b.isEarned);

  // If in compact mode, render a clean horizontal row of pill badges
  if (compact) {
    if (earnedBadges.length === 0) {
      return (
        <span className="text-[11px] text-slate-400 italic">Belum ada lencana diraih</span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {earnedBadges.map((badge) => (
          <button
            key={badge.id}
            type="button"
            onClick={() => setSelectedBadge(badge)}
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-transform hover:scale-105 shadow-2xs ${badge.color}`}
            title={`${badge.label}: ${badge.description}`}
          >
            {renderBadgeIcon(badge.icon, "w-3 h-3")}
            <span>{badge.label}</span>
          </button>
        ))}

        {/* Modal Detail on Click */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${selectedBadge.color}`}>
                    {renderBadgeIcon(selectedBadge.icon, "w-5 h-5")}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedBadge.label}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{selectedBadge.category}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBadge.description}
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Kriteria Pembukaan:</span>
                <p className="font-medium text-slate-700 dark:text-slate-200">{selectedBadge.criteria}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" /> Lencana Aktif Diraih
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Expanded Showcase
  const filteredBadges = badges.filter(b => {
    if (activeFilter === 'earned') return b.isEarned;
    if (activeFilter === 'performa') return b.category === 'performa';
    if (activeFilter === 'kehadiran') return b.category === 'kehadiran';
    return true; // 'all'
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Lencana Motivasi Digital {pejuangNama ? `(${pejuangNama})` : ''}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Apresiasi otomatis berdasarkan capaian kehadiran dan performa checklist.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('earned')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeFilter === 'earned' 
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Diraih ({earnedBadges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeFilter === 'all' 
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Semua ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('performa')}
            className={`px-2.5 py-1 rounded-lg transition-all hidden md:block ${
              activeFilter === 'performa' 
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Performa
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('kehadiran')}
            className={`px-2.5 py-1 rounded-lg transition-all hidden md:block ${
              activeFilter === 'kehadiran' 
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Kehadiran
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredBadges.map((b) => {
          return (
            <div
              key={b.id}
              className={`p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                b.isEarned 
                  ? `${b.badgeBg} ${b.badgeBorder} shadow-2xs hover:shadow-sm` 
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-75'
              }`}
            >
              {/* Top Row: Icon & Status */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`p-2 rounded-xl border flex items-center justify-center ${
                    b.isEarned ? b.color : 'bg-slate-100 dark:bg-slate-700 text-slate-400 border-slate-200 dark:border-slate-600'
                  }`}>
                    {renderBadgeIcon(b.icon, "w-5 h-5")}
                  </div>

                  {b.isEarned ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                      <Sparkles className="w-3 h-3" /> Diraih
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      <Lock className="w-3 h-3" /> Terkunci
                    </span>
                  )}
                </div>

                <h5 className={`font-bold text-xs mb-1 ${b.isEarned ? b.textColor : 'text-slate-700 dark:text-slate-300'}`}>
                  {b.label}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-2">
                  {b.description}
                </p>
              </div>

              {/* Progress Bar for Locked / Active Badges */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/40 mt-1">
                <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Progres: {b.progress.current}/{b.progress.max} {b.progress.unit}
                  </span>
                  <span className={b.isEarned ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}>
                    {b.progress.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.isEarned ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.min(b.progress.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredBadges.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            Belum ada lencana yang memenuhi filter ini. Tetap semangat istiqomah mengisi evaluasi checklist & kehadiran!
          </div>
        )}
      </div>
    </div>
  );
};
