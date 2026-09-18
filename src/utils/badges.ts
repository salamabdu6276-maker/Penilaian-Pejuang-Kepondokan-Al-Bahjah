import { ChecklistFormSubmission } from "../types";

export interface Badge {
  id: string;
  label: string;
  category: 'performa' | 'kehadiran' | 'prestasi';
  icon: string; // 'Award' | 'Medal' | 'Star' | 'Zap' | 'ShieldCheck' | 'Moon' | 'Sun' | 'CheckCircle2' | 'TrendingUp' | 'Crown'
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  description: string;
  criteria: string;
  isEarned: boolean;
  earnedAt?: string;
  progress: {
    current: number;
    max: number;
    unit: string;
    percentage: number;
  };
}

export function getAllBadgesWithProgress(
  submissions: ChecklistFormSubmission[],
  pejuangId: string,
  attendances?: any[],
  targetMingguan: number = 80,
  expectedCount?: number
): Badge[] {
  const pSubs = submissions.filter(s => s.pejuangId === pejuangId);
  const pAtts = (attendances || []).filter(a => a.pejuangId === pejuangId);

  const divisor = expectedCount ? expectedCount : Math.max(pSubs.length, 1);
  const avgPct = pSubs.length > 0 ? Math.round(pSubs.reduce((sum, s) => sum + s.percentage, 0) / divisor) : 0;
  const perfectSubs = pSubs.filter(s => s.percentage === 100);

  // Attendance metrics
  const totalSholatSesi = pAtts.reduce((acc, curr) => {
    return acc + (curr.dzuhur ? 1 : 0) + (curr.ashar ? 1 : 0) + (curr.maghrib ? 1 : 0) + (curr.isya ? 1 : 0) + (curr.subuh ? 1 : 0) + (curr.qiyamul_lail ? 1 : 0);
  }, 0);

  const subuhCount = pAtts.filter(a => a.subuh).length;
  const qiyamCount = pAtts.filter(a => a.qiyamul_lail).length;

  // Check attendance inferred from checklist tasks (kategori A or sholat keywords) if no sholat_attendances
  let checklistSholatChecks = 0;
  pSubs.forEach(sub => {
    sub.tasks?.forEach(t => {
      const isSholatTask = (t.kategori === 'A' || /sholat|shalat|subuh|tahajjud|jamaah|qiyam/i.test(t.uraian));
      if (isSholatTask && t.realisasiChecks) {
        Object.values(t.realisasiChecks).forEach(val => {
          if (val) checklistSholatChecks++;
        });
      }
    });
  });

  const effectiveSholatSesi = Math.max(totalSholatSesi, checklistSholatChecks);
  const effectiveSubuhCount = Math.max(subuhCount, Math.floor(checklistSholatChecks / 4));
  const effectiveQiyamCount = Math.max(qiyamCount, Math.floor(checklistSholatChecks / 7));

  // Sort submissions chronologically
  const sortedSubs = [...pSubs].sort((a, b) => (a.tahun - b.tahun) || (a.bulan - b.bulan) || (a.pekan - b.pekan));
  const latestSub = sortedSubs[sortedSubs.length - 1];
  const prevSub = sortedSubs.length >= 2 ? sortedSubs[sortedSubs.length - 2] : null;

  // 1. Pejuang Teladan (Consistent Performer >= 90%)
  const highSubsCount = pSubs.filter(s => s.percentage >= 90).length;
  const teladanEarned = avgPct >= 90 && pSubs.length >= 4;

  // 2. Bintang Sempurna (100% Score)
  const sempurnaEarned = perfectSubs.length >= 1;

  // 3. Target Achiever (Reaching / Exceeding Personal Target)
  const targetReachedCount = pSubs.filter(s => s.percentage >= targetMingguan).length;
  const targetAchieverEarned = (latestSub ? latestSub.percentage >= targetMingguan : false) || targetReachedCount >= 2;

  // 4. Disiplin Istiqomah (Long-term submission consistency)
  const disiplinEarned = pSubs.length >= 6 && avgPct >= 80;

  // 5. Pengurus Aktif (Active engagement)
  const aktifSubs = pSubs.filter(s => s.percentage >= 75).length;
  const aktifEarned = aktifSubs >= 2;

  // 6. Pejuang Berkemajuan (Growth & Improvement)
  const isGrowing = Boolean(latestSub && prevSub && latestSub.percentage > prevSub.percentage);
  const growingEarned = isGrowing || (pSubs.length === 1 && (latestSub?.percentage || 0) >= 80);

  // 7. Penjaga Sholat Jamaah (Attendance Badge)
  const sholatEarned = effectiveSholatSesi >= 15;

  // 8. Pejuang Fajar (Subuh Attendance)
  const subuhEarned = effectiveSubuhCount >= 5;

  // 9. Qiyamul Lail Pondok (Night Prayer Attendance)
  const qiyamEarned = effectiveQiyamCount >= 3;

  // 10. Kehadiran Paripurna (Overall Attendance & Checklist >= 85%)
  const paripurnaEarned = (avgPct >= 85 && pSubs.length >= 3) || (effectiveSholatSesi >= 25);

  const badges: Badge[] = [
    {
      id: 'pejuang-teladan',
      label: 'Pejuang Teladan',
      category: 'performa',
      icon: 'Award',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
      badgeBorder: 'border-amber-300 dark:border-amber-700',
      textColor: 'text-amber-800 dark:text-amber-200',
      description: 'Rata-rata performa checklist di atas 90% secara konsisten',
      criteria: 'Rata-rata performa >= 90% dengan minimal 4 pekan evaluasi',
      isEarned: teladanEarned,
      progress: {
        current: Math.min(highSubsCount, 4),
        max: 4,
        unit: 'pekan >= 90%',
        percentage: Math.min(Math.round((highSubsCount / 4) * 100), 100)
      }
    },
    {
      id: 'bintang-sempurna',
      label: 'Bintang Sempurna (100%)',
      category: 'prestasi',
      icon: 'Star',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badgeBorder: 'border-emerald-300 dark:border-emerald-700',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      description: 'Pencapaian evaluasi tugas 100% sempurna tanpa cela',
      criteria: 'Mencapai skor performa 100% pada evaluasi tugas pekanan',
      isEarned: sempurnaEarned,
      progress: {
        current: Math.min(perfectSubs.length, 1),
        max: 1,
        unit: 'kali 100%',
        percentage: sempurnaEarned ? 100 : 0
      }
    },
    {
      id: 'target-achiever',
      label: 'Target Achiever',
      category: 'performa',
      icon: 'CheckCircle2',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
      badgeBorder: 'border-blue-300 dark:border-blue-700',
      textColor: 'text-blue-800 dark:text-blue-200',
      description: `Mencapai atau melampaui target mingguan individu (${targetMingguan}%)`,
      criteria: `Mencapai performa minimal ${targetMingguan}% pada pekan aktif`,
      isEarned: targetAchieverEarned,
      progress: {
        current: latestSub ? latestSub.percentage : 0,
        max: targetMingguan,
        unit: '% skor pekanan',
        percentage: latestSub ? Math.min(Math.round((latestSub.percentage / targetMingguan) * 100), 100) : 0
      }
    },
    {
      id: 'disiplin-istiqomah',
      label: 'Disiplin Istiqomah',
      category: 'performa',
      icon: 'Medal',
      color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-600',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      badgeBorder: 'border-indigo-300 dark:border-indigo-700',
      textColor: 'text-indigo-800 dark:text-indigo-200',
      description: 'Konsisten mengisi laporan rutin di atas 80% ketercapaian',
      criteria: 'Minimal 6 pekan evaluasi dengan rata-rata skor >= 80%',
      isEarned: disiplinEarned,
      progress: {
        current: Math.min(pSubs.length, 6),
        max: 6,
        unit: 'pekan evaluasi',
        percentage: Math.min(Math.round((pSubs.length / 6) * 100), 100)
      }
    },
    {
      id: 'pengurus-aktif',
      label: 'Pengurus Aktif',
      category: 'performa',
      icon: 'Zap',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
      badgeBorder: 'border-purple-300 dark:border-purple-700',
      textColor: 'text-purple-800 dark:text-purple-200',
      description: 'Aktif mengisi checklist evaluasi tugas dengan performa tinggi',
      criteria: 'Minimal 2 pekan mengisi checklist dengan nilai >= 75%',
      isEarned: aktifEarned,
      progress: {
        current: Math.min(aktifSubs, 2),
        max: 2,
        unit: 'pekan >= 75%',
        percentage: Math.min(Math.round((aktifSubs / 2) * 100), 100)
      }
    },
    {
      id: 'pejuang-berkemajuan',
      label: 'Pejuang Berkemajuan',
      category: 'prestasi',
      icon: 'TrendingUp',
      color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-600',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
      badgeBorder: 'border-sky-300 dark:border-sky-700',
      textColor: 'text-sky-800 dark:text-sky-200',
      description: 'Tren performa meningkat secara positif dari pekan sebelumnya',
      criteria: 'Pencapaian skor pekan ini lebih tinggi dari pekan sebelumnya',
      isEarned: growingEarned,
      progress: {
        current: latestSub?.percentage || 0,
        max: prevSub?.percentage || 100,
        unit: '% progres',
        percentage: growingEarned ? 100 : Math.min(Math.round(((latestSub?.percentage || 0) / (prevSub?.percentage || 1)) * 100), 99)
      }
    },
    {
      id: 'penjaga-sholat',
      label: 'Penjaga Sholat Jamaah',
      category: 'kehadiran',
      icon: 'Moon',
      color: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-600',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
      badgeBorder: 'border-teal-300 dark:border-teal-700',
      textColor: 'text-teal-800 dark:text-teal-200',
      description: 'Tercatat hadir sholat fardhu berjamaah secara istiqomah di pondok',
      criteria: 'Kehadiran sholat fardhu berjamaah tercatat minimal 15 sesi',
      isEarned: sholatEarned,
      progress: {
        current: Math.min(effectiveSholatSesi, 15),
        max: 15,
        unit: 'sesi sholat',
        percentage: Math.min(Math.round((effectiveSholatSesi / 15) * 100), 100)
      }
    },
    {
      id: 'pejuang-fajar',
      label: 'Pejuang Fajar (Subuh)',
      category: 'kehadiran',
      icon: 'Sun',
      color: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
      badgeBorder: 'border-orange-300 dark:border-orange-700',
      textColor: 'text-orange-800 dark:text-orange-200',
      description: 'Istiqomah hadir sholat Subuh berjamaah tepat waktu',
      criteria: 'Kehadiran sholat Subuh berjamaah tercatat minimal 5 hari',
      isEarned: subuhEarned,
      progress: {
        current: Math.min(effectiveSubuhCount, 5),
        max: 5,
        unit: 'hari Subuh',
        percentage: Math.min(Math.round((effectiveSubuhCount / 5) * 100), 100)
      }
    },
    {
      id: 'istiqomah-malam',
      label: 'Qiyamul Lail Pondok',
      category: 'kehadiran',
      icon: 'Crown',
      color: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-600',
      badgeBg: 'bg-violet-50 dark:bg-violet-950/40',
      badgeBorder: 'border-violet-300 dark:border-violet-700',
      textColor: 'text-violet-800 dark:text-violet-200',
      description: 'Aktif mengikuti ibadah sholat malam & qiyam kepondokan',
      criteria: 'Kehadiran Qiyamul Lail tercatat minimal 3 sesi',
      isEarned: qiyamEarned,
      progress: {
        current: Math.min(effectiveQiyamCount, 3),
        max: 3,
        unit: 'sesi Qiyam',
        percentage: Math.min(Math.round((effectiveQiyamCount / 3) * 100), 100)
      }
    },
    {
      id: 'kehadiran-paripurna',
      label: 'Kehadiran Paripurna',
      category: 'kehadiran',
      icon: 'ShieldCheck',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badgeBorder: 'border-emerald-300 dark:border-emerald-700',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      description: 'Kedisiplinan kehadiran tugas & rutinitas pondok di atas 85%',
      criteria: 'Rata-rata kehadiran tugas checklist & sholat minimal 85%',
      isEarned: paripurnaEarned,
      progress: {
        current: Math.min(avgPct, 85),
        max: 85,
        unit: '% kehadiran',
        percentage: Math.min(Math.round((avgPct / 85) * 100), 100)
      }
    }
  ];

  return badges;
}

// Backward-compatible calculateBadges function returning only earned badges
export function calculateBadges(
  submissions: ChecklistFormSubmission[],
  pejuangId: string,
  expectedCount?: number,
  attendances?: any[],
  targetMingguan: number = 80
): Badge[] {
  const all = getAllBadgesWithProgress(submissions, pejuangId, attendances, targetMingguan, expectedCount);
  return all.filter(b => b.isEarned);
}

