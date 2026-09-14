import { ChecklistFormSubmission, Pejuang } from "../types";

export interface Badge {
  label: string;
  icon: string;
  color: string;
  description: string;
}

export function calculateBadges(submissions: ChecklistFormSubmission[], pejuangId: string, expectedCount?: number): Badge[] {
  const subs = submissions.filter(s => s.pejuangId === pejuangId);
  const badges: Badge[] = [];

  if (subs.length === 0) return badges;
  
  const divisor = expectedCount ? expectedCount : subs.length;
  const avgPct = subs.reduce((sum, s) => sum + s.percentage, 0) / Math.max(divisor, 1);
  
  // 1. Pejuang Teladan: Average performance >= 90% and minimum 4 submissions
  if (avgPct >= 90 && subs.length >= 4) {
    badges.push({
      label: 'Pejuang Teladan',
      icon: 'Award',
      color: 'bg-amber-100 text-amber-700 border-amber-300',
      description: 'Rata-rata performa di atas 90% secara konsisten'
    });
  }

  // 2. Disiplin Tinggi: At least 8 submissions with average >= 80% (consistent over long term)
  // OR simply has 100% in at least 2 submissions
  const perfectSubs = subs.filter(s => s.percentage === 100);
  if (subs.length >= 8 && avgPct >= 80) {
    badges.push({
      label: 'Disiplin Tinggi',
      icon: 'Medal',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      description: 'Konsisten mengisi laporan rutin di atas 80%'
    });
  }

  // 3. Sempurna: Punya nilai 100% lebih dari 2 kali
  if (perfectSubs.length >= 2) {
    badges.push({
      label: 'Sempurna',
      icon: 'Star',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      description: 'Pencapaian performa 100% sempurna berulang'
    });
  }
  
  // 4. Pendatang Baru Aktif: If they are new (have <4 subs) but all of them are >= 85%
  if (subs.length > 0 && subs.length < 4 && avgPct >= 85) {
     badges.push({
      label: 'Sangat Aktif',
      icon: 'Zap',
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      description: 'Menunjukkan keaktifan tinggi di minggu-minggu awal'
    });
  }

  return badges;
}
