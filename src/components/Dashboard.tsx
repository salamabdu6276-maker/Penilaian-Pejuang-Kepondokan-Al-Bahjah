import React, { useState, useMemo } from "react";
import { MessageCircle, Phone, 
  Users, 
  Filter, 
  TrendingUp, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  Award, 
  Medal,
  Star,
  Zap,
  Download,
  FileText, 
  FileSpreadsheet, 
  ChevronRight, 
  UserCheck, 
  Send, 
  X, 
  Moon, 
  Sparkles,
  Info,
  CheckCircle2,
  BarChart2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";
import { 
  Pejuang, 
  ChecklistFormSubmission, 
  Role, 
  SystemNotification 
} from "../types";
import { getHijriDate, GREGORIAN_MONTHS_ID, getWeeksInMonth } from "../utils/hijri";
import { exportToCSV, exportToExcel, exportElementToImage } from "../utils/export";
import { HijriCalendarWidget } from './HijriCalendarWidget';
import { MonthlyHeatmap } from "./MonthlyHeatmap";
import { AnimatedDownloadButton } from './AnimatedDownloadButton';
import { SholatAttendanceUploader } from "./SholatAttendanceUploader";
import { SholatAttendanceRecap } from "./SholatAttendanceRecap";
import { Overall4WeekTrend } from './Overall4WeekTrend';
import { PejuangWeeklyTrend } from "./PejuangWeeklyTrend";
import { Activity, Clock } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateBadges } from "../utils/badges";

interface DashboardProps {
  pejuangList: Pejuang[];
  submissions: ChecklistFormSubmission[];
  role: Role;
  onNavigateToChecklist: () => void;
  onNavigateToSettings: () => void;
  onSendCoachingNotification: (pejuangId: string, message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  pejuangList,
  submissions,
  role,
  onNavigateToChecklist,
  onNavigateToSettings,
  onSendCoachingNotification
}) => {

  const getPejuangBadges = (pejuangId: string, top3: any[]) => {
    const pSubs = submissions.filter(s => s.pejuangId === pejuangId);
    const badges = [];
    
    const highScores = pSubs.filter(s => s.percentage >= 90).length;
    if (highScores >= 3) badges.push({ icon: '🌟', title: 'Consistent Performer (3+ nilai >90%)' });
    
    if (pSubs.length >= 10) badges.push({ icon: '🏅', title: 'Dedicated (10+ laporan)' });
    
    if (top3.some(t => t.pejuang.id === pejuangId)) badges.push({ icon: '👑', title: 'Top Rank Bulan Ini' });
    
    if (pSubs.some(s => s.percentage === 100)) badges.push({ icon: '✨', title: 'Flawless Score (Pernah 100%)' });
    
    return badges;
  };

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [sholatRefreshKey, setSholatRefreshKey] = useState(0);
  const [selectedDrilldownPejuang, setSelectedDrilldownPejuang] = useState<Pejuang | null>(null);
  const [heatmapSortBy, setHeatmapSortBy] = useState<"name" | "performance">("performance");

  const recentEvents = useMemo(() => {
    const events = [];
    submissions.forEach(sub => {
      events.push({
        id: sub.id,
        title: `Form Checklist Disubmit (${sub.pejuangNama})`,
        message: `Pekan ${sub.pekan} ${GREGORIAN_MONTHS_ID[sub.bulan - 1]} ${sub.tahun} - Performa ${sub.percentage}%`,
        date: new Date(sub.updatedAt || new Date()),
        type: 'submission'
      });
    });
    return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }, [submissions]);
  const [subDivisiFilter, setSubDivisiFilter] = useState<string>("Semua Divisi");
  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "nonaktif">("semua");
  const [compareChartWeek, setCompareChartWeek] = useState<number | "all">("all");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [overviewViewType, setOverviewViewType] = useState<"weekly" | "monthly" | "quarterly">("weekly");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [rankingPeriod, setRankingPeriod] = useState<"pekan" | "bulan">("pekan");
  
  // Modal states for Calendar date details & Coaching
  const [activeCalendarDate, setActiveCalendarDate] = useState<{ dayNum: number, dateStr: string } | null>(null);
  const [coachingPejuang, setCoachingPejuang] = useState<Pejuang | null>(null);
  const [historyModalPejuang, setHistoryModalPejuang] = useState<Pejuang | null>(null);
  const [coachingNote, setCoachingNote] = useState<string>("");

  const activePejuangList = React.useMemo(() => {
    return pejuangList.filter(p => {
      const matchDivisi = subDivisiFilter === "Semua Divisi" ? true : p.subDivisi === subDivisiFilter;
      const matchStatus = statusFilter === "semua" ? true : p.status === statusFilter;
      return matchDivisi && matchStatus;
    });
  }, [pejuangList, subDivisiFilter, statusFilter]);

  // Sub Division breakdown calculation
  const subDivisiStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    activePejuangList.forEach(p => {
      const sub = p.subDivisi || "Lainnya";
      stats[sub] = (stats[sub] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [activePejuangList]);

  // Filter submissions by current month/year
  const monthSubmissions = React.useMemo(() => {
    return submissions.filter(s => s.bulan === selectedMonth && s.tahun === selectedYear && activePejuangList.some(p => p.id === s.pejuangId));
  }, [submissions, selectedMonth, selectedYear, activePejuangList]);

  // Overall performance average
  const avgPerformance = React.useMemo(() => {
    if (monthSubmissions.length === 0) return 0;
    const total = monthSubmissions.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(total / monthSubmissions.length);
  }, [monthSubmissions]);

  const [myProfileId, setMyProfileId] = useState<string>(localStorage.getItem("myPejuangId") || "");
  
  // My Performance Trend Data
  const myPerformanceData = React.useMemo(() => {
    if (!myProfileId) return [];
    const weeks = [1, 2, 3, 4, 5];
    return weeks.map(w => {
      const sub = monthSubmissions.find(s => s.pekan === w && s.pejuangId === myProfileId);
      return {
        name: `Pekan ${w}`,
        Performa: sub ? sub.percentage : null
      };
    });
  }, [monthSubmissions, myProfileId]);

  // Yearly Summary Data (Average score per Sub-Divisi per Month)
  const yearlySummaryData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // Get unique active sub divisi
    const activeSubDivisi = Array.from(new Set(activePejuangList.map(p => p.subDivisi || "Lainnya")));
    
    return months.map(m => {
      const dataPoint: any = { name: GREGORIAN_MONTHS_ID[m - 1].substring(0,3) };
      
      activeSubDivisi.forEach(sd => {
        const subs = submissions.filter(s => s.bulan === m && s.tahun === selectedYear && activePejuangList.find(p => p.id === s.pejuangId)?.subDivisi === sd);
        const avg = subs.length > 0 ? Math.round(subs.reduce((acc, curr) => acc + curr.percentage, 0) / subs.length) : 0;
        dataPoint[sd] = avg;
      });
      
      return dataPoint;
    });
  }, [submissions, selectedYear, activePejuangList]);

  // Heatmap Data (Pejuang vs Week for current month)
  const heatmapData = React.useMemo(() => {
    return activePejuangList.map(p => {
      const pSubs = monthSubmissions.filter(s => s.pejuangId === p.id);
      return {
        pejuang: p,
        w1: pSubs.find(s => s.pekan === 1)?.percentage,
        w2: pSubs.find(s => s.pekan === 2)?.percentage,
        w3: pSubs.find(s => s.pekan === 3)?.percentage,
        w4: pSubs.find(s => s.pekan === 4)?.percentage,
        w5: pSubs.find(s => s.pekan === 5)?.percentage,
      }
    });
  }, [activePejuangList, monthSubmissions]);

  // Weekly Trend Chart Data
  const weeklyTrendData = React.useMemo(() => {
    const weeks = [1, 2, 3, 4, 5];
    return weeks.map(w => {
      const weekSubs = monthSubmissions.filter(s => s.pekan === w);
      const avg = weekSubs.length > 0 
        ? Math.round(weekSubs.reduce((a, b) => a + b.percentage, 0) / weekSubs.length)
        : 0;
      return {
        name: `Pekan ${w}`,
        Performa: avg,
        JumlahSubmit: weekSubs.length
      };
    });
  }, [monthSubmissions]);

  // 12-Week Trend Chart Data
  const twelveWeekTrendData = React.useMemo(() => {
    const allWeeksMap = new Map<string, { year: number, month: number, week: number, totalPct: number, count: number }>();
    
    submissions.forEach(s => {
      if (activePejuangList.some(p => p.id === s.pejuangId)) {
        const key = `${s.tahun}-${String(s.bulan).padStart(2, '0')}-W${s.pekan}`;
        if (!allWeeksMap.has(key)) {
          allWeeksMap.set(key, { year: s.tahun, month: s.bulan, week: s.pekan, totalPct: 0, count: 0 });
        }
        const entry = allWeeksMap.get(key)!;
        entry.totalPct += s.percentage;
        entry.count += 1;
      }
    });

    const sortedWeeks = Array.from(allWeeksMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (a.month !== b.month) return a.month - b.month;
      return a.week - b.week;
    });

    const last12 = sortedWeeks.slice(-12);

    return last12.map(w => ({
      name: `${GREGORIAN_MONTHS_ID[w.month - 1].substring(0,3)} W${w.week}`,
      Performa: Math.round(w.totalPct / w.count),
      LabelTooltip: `${GREGORIAN_MONTHS_ID[w.month - 1]} ${w.year} - Pekan ${w.week}`
    }));
  }, [submissions, activePejuangList]);

  // Performance Overview Data (Current Month by Week)
  const performanceOverviewData = React.useMemo(() => {
    const data = [
      { name: 'Pekan 1', Performa: 0, count: 0 },
      { name: 'Pekan 2', Performa: 0, count: 0 },
      { name: 'Pekan 3', Performa: 0, count: 0 },
      { name: 'Pekan 4', Performa: 0, count: 0 },
      { name: 'Pekan 5', Performa: 0, count: 0 }
    ];
    
    monthSubmissions.forEach(s => {
      if (s.pekan >= 1 && s.pekan <= 5 && activePejuangList.some(p => p.id === s.pejuangId)) {
        data[s.pekan - 1].Performa += s.percentage;
        data[s.pekan - 1].count += 1;
      }
    });

    return data.map(d => ({
      name: d.name,
      Performa: d.count > 0 ? Math.round(d.Performa / d.count) : 0,
      Count: d.count
    }));
  }, [monthSubmissions, activePejuangList]);

  // Ranking calculation
  const rankings = React.useMemo(() => {
    const map: Record<string, { pejuang: Pejuang; totalPct: number; count: number; highestCategory: string }> = {};

    const targetSubs = rankingPeriod === "pekan" 
      ? monthSubmissions.filter(s => s.pekan === selectedWeek)
      : monthSubmissions;

    targetSubs.forEach(s => {
      const p = activePejuangList.find(x => x.id === s.pejuangId);
      if (p) {
        if (!map[p.id]) {
          map[p.id] = { pejuang: p, totalPct: 0, count: 0, highestCategory: s.kategoriTertinggi || "A" };
        }
        map[p.id].totalPct += s.percentage;
        map[p.id].count += 1;
      }
    });

    const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
    const expectedCount = rankingPeriod === "pekan" ? 1 : totalWeeksInMonth;
    
    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: Math.round(item.totalPct / expectedCount),
      count: item.count,
      expectedCount,
      highestCategory: item.highestCategory
    }));

    return result.sort((a, b) => b.score - a.score);
  }, [pejuangList, monthSubmissions, rankingPeriod, selectedWeek]);

  const top3Bulanan = React.useMemo(() => {
    const map: Record<string, { pejuang: Pejuang; totalPct: number; count: number }> = {};
    monthSubmissions.forEach(s => {
      const p = activePejuangList.find(x => x.id === s.pejuangId);
      if (p) {
        if (!map[p.id]) map[p.id] = { pejuang: p, totalPct: 0, count: 0 };
        map[p.id].totalPct += s.percentage;
        map[p.id].count += 1;
      }
    });

    const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: Math.round(item.totalPct / totalWeeksInMonth),
      count: item.count,
      expectedCount: totalWeeksInMonth
    }));

    return result.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [activePejuangList, monthSubmissions]);

  // Top 3 Divisions 6-Month Trajectory
  const top3Divisions6MonthData = React.useMemo(() => {
    // Determine the last 6 months (including current month)
    const monthsData: { year: number, month: number, name: string }[] = [];
    let cMonth = selectedMonth;
    let cYear = selectedYear;
    for (let i = 0; i < 6; i++) {
      monthsData.unshift({ year: cYear, month: cMonth, name: `${GREGORIAN_MONTHS_ID[cMonth - 1].substring(0,3)} ${cYear.toString().substring(2)}` });
      cMonth--;
      if (cMonth < 1) {
        cMonth = 12;
        cYear--;
      }
    }

    // Calculate total average for all divisions in the last 6 months to find top 3
    const divTotals: Record<string, { totalPct: number, count: number }> = {};
    submissions.forEach(s => {
      // Check if submission is in the 6 month window
      if (monthsData.some(m => m.year === s.tahun && m.month === s.bulan)) {
        if (!divTotals[s.subDivisi]) divTotals[s.subDivisi] = { totalPct: 0, count: 0 };
        divTotals[s.subDivisi].totalPct += s.percentage;
        divTotals[s.subDivisi].count += 1;
      }
    });

    const topDivs = Object.entries(divTotals)
      .map(([divisi, data]) => ({ divisi, avg: data.totalPct / data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3)
      .map(d => d.divisi);

    // If no data, return empty
    if (topDivs.length === 0) return { data: [], topDivs: [] };

    // Format data for LineChart
    const chartData = monthsData.map(mInfo => {
      const point: any = { month: mInfo.name };
      topDivs.forEach(div => {
        const divSubs = submissions.filter(s => s.tahun === mInfo.year && s.bulan === mInfo.month && s.subDivisi === div);
        const avg = divSubs.length > 0 ? Math.round(divSubs.reduce((acc, curr) => acc + curr.percentage, 0) / divSubs.length) : 0;
        point[div] = avg;
      });
      return point;
    });

    return { data: chartData, topDivs };
  }, [submissions, selectedMonth, selectedYear]);

  // Underperforming Pejuang (Performa Menurun < 75%)
  const underperformingList = React.useMemo(() => {
    return rankings.filter(r => r.score > 0 && r.score < 75);
  }, [rankings]);

  // Data for Sub Divisi Comparison Chart
  const threeMonthsDivisionData = React.useMemo(() => {
    const result: Record<string, { totalPct: number; count: number }> = {};
    // Last 3 months based on selectedMonth/selectedYear
    let curBulan = selectedMonth;
    let curTahun = selectedYear;
    for (let i = 0; i < 3; i++) {
      const b = curBulan;
      const t = curTahun;
      submissions.filter(s => s.bulan === b && s.tahun === t && (subDivisiFilter === "Semua Divisi" || s.subDivisi === subDivisiFilter)).forEach(s => {
        if (!result[s.subDivisi]) result[s.subDivisi] = { totalPct: 0, count: 0 };
        result[s.subDivisi].totalPct += s.percentage;
        result[s.subDivisi].count += 1;
      });
      curBulan--;
      if (curBulan < 1) {
        curBulan = 12;
        curTahun--;
      }
    }
    return Object.entries(result).map(([subDivisi, data]) => ({
      name: subDivisi,
      RataRata: data.count > 0 ? Math.round(data.totalPct / data.count) : 0
    })).sort((a, b) => b.RataRata - a.RataRata);
  }, [submissions, selectedMonth, selectedYear, subDivisiFilter]);

  const subDivisiCompareData = React.useMemo(() => {
    const targetSubs = compareChartWeek === "all" 
      ? monthSubmissions 
      : monthSubmissions.filter(s => s.pekan === compareChartWeek);

    const map: Record<string, { pejuang: Pejuang; totalPct: number; count: number }> = {};
    targetSubs.forEach(s => {
      const p = activePejuangList.find(x => x.id === s.pejuangId);
      if (p) {
        if (!map[p.id]) map[p.id] = { pejuang: p, totalPct: 0, count: 0 };
        map[p.id].totalPct += s.percentage;
        map[p.id].count += 1;
      }
    });

    return Object.values(map)
      .map(item => ({
        name: item.pejuang.nama.split(" ").slice(0, 2).join(" "),
        Performa: item.count > 0 ? Math.round(item.totalPct / item.count) : 0,
        SubDivisi: item.pejuang.subDivisi
      }))
      .filter(r => r.Performa > 0)
      .sort((a, b) => b.Performa - a.Performa);
  }, [monthSubmissions, activePejuangList, compareChartWeek]);


  // Calendar Date Pejuang details calculation
  const getTop5PejuangForDate = (dayNum: number) => {
    let totalChecks = 0;
    
    const dateRankings: { pejuangId: string; pejuangNama: string; fotoUrl: string; percentage: number; kategori: string }[] = [];

    monthSubmissions.forEach(sub => {
      sub.tasks.forEach(t => {
        if (t.realisasiChecks && t.realisasiChecks[dayNum]) {
          totalChecks++;
        }
      });
      if (sub.dates.includes(dayNum)) {
        const p = pejuangList.find(x => x.id === sub.pejuangId);
        const existing = dateRankings.find(x => x.pejuangId === sub.pejuangId);
        if (existing) {
           if (sub.percentage > existing.percentage) {
              existing.percentage = sub.percentage;
              existing.kategori = sub.kategoriTertinggi || existing.kategori;
           }
        } else {
          dateRankings.push({
            pejuangId: sub.pejuangId,
            pejuangNama: sub.pejuangNama,
            fotoUrl: p?.fotoUrl || "",
            percentage: sub.percentage,
            kategori: sub.kategoriTertinggi || "A"
          });
        }
      }
    });
    
    const top5 = dateRankings.sort((a, b) => b.percentage - a.percentage).slice(0, 5);

    return {
      top5,
      totalChecks
    };
  };

  // Lists for Status Setoran
  const submittedPejuangIds = new Set(monthSubmissions.filter(s => s.pekan === selectedWeek).map(s => s.pejuangId));
  const submittedList = pejuangList.filter(p => submittedPejuangIds.has(p.id));
  const unsubmittedList = pejuangList.filter(p => !submittedPejuangIds.has(p.id));

  // Export handlers
  const handleExportCSV = async () => {
    await import("../utils/export").then(m => m.prepareTranslations());
    const exportData = rankings.map((r, i) => ({
      Ranking: i + 1,
      Nama: r.pejuang.nama,
      SubDivisi: r.pejuang.subDivisi,
      Amanah: r.pejuang.amanah,
      PerformaPersen: `${r.score}%`,
      Predikat: r.score >= 91 ? 'A' : r.score >= 75 ? 'B' : r.score >= 40 ? 'C' : 'D'
    }));
    exportToCSV(exportData, `Rangking_Pejuang_${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`);
  };

  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const monthName = GREGORIAN_MONTHS_ID[selectedMonth - 1];
    
    // Add Title
    doc.setFontSize(18);
    doc.text(`Laporan Performa Pejuang Al-Bahjah`, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Periode: ${monthName} ${selectedYear}`, 14, 30);
    doc.text(`Total Pejuang Aktif: ${pejuangList.filter(p => p.status === 'aktif').length}`, 14, 36);
    doc.text(`Rata-rata Performa: ${avgPerformance}%`, 14, 42);

    // Prepare table data
    const tableData = rankings.map((r, i) => [
      i + 1,
      r.pejuang.nama,
      r.pejuang.subDivisi,
      `${r.score}%`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Ranking', 'Nama Pejuang', 'Sub Divisi', 'Skor']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] }, // emerald-600
    });

    doc.save(`Laporan_Performa_${monthName}_${selectedYear}.pdf`);
  };

  const handleExportExcel = () => {
    const exportData = rankings.map((r, i) => ({
      Ranking: i + 1,
      Nama: r.pejuang.nama,
      SubDivisi: r.pejuang.subDivisi,
      Amanah: r.pejuang.amanah,
      PerformaPersen: `${r.score}%`,
      Predikat: r.score >= 91 ? 'A' : r.score >= 75 ? 'B' : r.score >= 40 ? 'C' : 'D'
    }));
    exportToExcel(exportData, `Rangking_Pejuang_${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`);
  };

  const handleSendCoachingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coachingPejuang && coachingNote.trim()) {
      onSendCoachingNotification(
        coachingPejuang.id,
        `Evaluasi & Coaching Personal dari Lead Divisi: ${coachingNote}`
      );
      alert(`Pesan Coaching telah berhasil dikirimkan kepada ${coachingPejuang.nama}.`);
      setCoachingPejuang(null);
      setCoachingNote("");
    }
  };

  const hijriDate = React.useMemo(() => getHijriDate(new Date()), []);

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">

      {/* HIJRI WIDGET */}
      <HijriCalendarWidget />
      
      {/* Top Banner & Control Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                Laporan & Executive Summary
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Yayasan Al-Bahjah Cirebon 1
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Dashboard Performa Tim Pejuang
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Pantau tren produktivitas, pencapaian target mingguan, dan evaluasi personal secara real-time.
            </p>
          </div>

          
          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3 lg:justify-end">
            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-3 pr-8 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg py-1.5 font-semibold focus:ring-2 focus:ring-emerald-500 appearance-none outline-none"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>
            </div>
            
            {/* Sub-Divisi Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Filter Divisi Global</label>
              <div className="relative">
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <select
                  value={subDivisiFilter}
                  onChange={(e) => setSubDivisiFilter(e.target.value)}
                  className="pl-8 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 font-semibold focus:ring-2 focus:ring-emerald-500 min-w-[150px] max-w-[200px] truncate"
                >
                  <option value="Semua Divisi">Semua Divisi</option>
                  {Array.from(new Set(pejuangList.map(p => p.subDivisi))).map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Bulan</label>
              <select
                id="select-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                {GREGORIAN_MONTHS_ID.map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tahun</label>
              <select
                id="select-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            {/* Quick Export Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <button
                id="btn-export-excel"
                onClick={handleExportExcel}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors h-[34px]"
                title="Ekspor Ke Excel XLSX"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                id="btn-export-csv"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors h-[34px]"
                title="Ekspor Ke CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button
                id="btn-export-pdf"
                onClick={handleExportPDF}
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors h-[34px]"
                title="Ekspor Laporan Ke PDF"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>

            </div>
          </div>
        </div>
      </div>

      
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* TOP 3 PERFORMERS (BULANAN) */}
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-800 dark:text-white">Top Performers</h3>
        </div>
        
        {top3Bulanan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Bulanan.map((item, idx) => (
              <div key={item.pejuang.id} className="flex items-center p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mr-3 shadow-sm ${idx === 0 ? 'bg-amber-100 text-amber-600 border-2 border-amber-300' : idx === 1 ? 'bg-slate-200 text-slate-500 border-2 border-slate-300' : 'bg-orange-100 text-orange-600 border-2 border-orange-300'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white truncate">{item.pejuang.nama}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.pejuang.subDivisi}</p>
                </div>
                <div className="ml-2 font-black text-emerald-600 dark:text-emerald-400 text-lg">
                  {item.score}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada data performa untuk bulan ini. Pejuang dengan rata-rata checklist tertinggi akan tampil di sini.</p>
          </div>
        )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <SholatAttendanceUploader pejuangList={pejuangList} onUploadSuccess={() => setSholatRefreshKey(prev => prev + 1)} />
        </div>
      </div>

      <div className="mb-6">
        <SholatAttendanceRecap key={sholatRefreshKey} pejuangList={pejuangList} selectedMonth={selectedMonth} selectedYear={selectedYear} />
      </div>

      {/* QUICK STATS SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 rounded-2xl shadow-md text-white flex items-center space-x-4 border border-emerald-500">
          <div className="p-3 bg-white dark:bg-slate-800/20 rounded-xl backdrop-blur-sm">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wide">Total Pejuang Aktif</p>
            <h3 className="text-2xl font-extrabold leading-tight">{pejuangList.filter(p => p.status === 'aktif').length}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 rounded-2xl shadow-md text-white flex items-center space-x-4 border border-indigo-500">
          <div className="p-3 bg-white dark:bg-slate-800/20 rounded-xl backdrop-blur-sm">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-indigo-100 uppercase tracking-wide">Submit Pekan Ini</p>
            <h3 className="text-2xl font-extrabold leading-tight">{submissions.filter(s => s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear).length}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-5 rounded-2xl shadow-md text-white flex items-center space-x-4 border border-amber-400">
          <div className="p-3 bg-white dark:bg-slate-800/20 rounded-xl backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-100 uppercase tracking-wide">Performa Rata-rata</p>
            <h3 className="text-2xl font-extrabold leading-tight">{avgPerformance}%</h3>
          </div>
        </div>
      </div>

{/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Pejuang Aktif */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Pejuang Aktif</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none mt-1">
              {activePejuangList.filter(p => p.status === 'aktif').length} 
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">Orang</span>
            </h3>
            <p className="text-[10px] text-emerald-700 font-semibold mt-1 bg-emerald-50 inline-block px-1.5 py-0.5 rounded truncate max-w-[150px]">
              {subDivisiFilter}
            </p>
          </div>
        </div>

        {/* Total Checklist (Minggu Ini) */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-100 text-indigo-800 rounded-xl flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Checklist Pekan Ini</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none mt-1">
              {submissions.filter(s => s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear && activePejuangList.some(p => p.id === s.pejuangId)).length} 
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">Submit</span>
            </h3>
            <p className="text-[10px] text-indigo-700 font-semibold mt-1 bg-indigo-50 inline-block px-1.5 py-0.5 rounded truncate max-w-[150px]">
              Sesuai filter divisi
            </p>
          </div>
        </div>

        {/* Average Performance */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center space-x-4">
          <div className="p-3.5 bg-blue-100 text-blue-800 rounded-xl flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rata-rata Performa</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none mt-1">{avgPerformance}%</h3>
            <p className="text-[10px] text-blue-700 font-semibold mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded truncate max-w-[150px]">
              {subDivisiFilter}
            </p>
          </div>
        </div>

      </div>


      {/* Empty Pejuang Notice */}
      {pejuangList.length === 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Data Pejuang Masih Kosong</h4>
              <p className="text-xs text-amber-800">
                Sesuai instruksi, database telah dikosongkan. Silakan input data pejuang baru di menu Admin atau gunakan Quick Template.
              </p>
            </div>
          </div>
          {role === 'admin' && (
            <button
              onClick={onNavigateToSettings}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              Tambah Data Pejuang Sekarang
            </button>
          )}
        </div>
      )}

      
      {/* PERFORMANCE OVERVIEW CURRENT MONTH */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              Performance Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rata-rata persentase performa pejuang berdasarkan waktu</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button onClick={() => setOverviewViewType('weekly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${overviewViewType === 'weekly' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Pekan (Bulan Ini)</button>
            <button onClick={() => setOverviewViewType('monthly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${overviewViewType === 'monthly' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Bulan (Tahun Ini)</button>
            <button onClick={() => setOverviewViewType('quarterly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${overviewViewType === 'quarterly' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Kuartal (Tahun Ini)</button>
          </div>
        </div>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Rata-rata Performa']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                {performanceOverviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.Performa >= 80 ? '#10b981' : entry.Performa >= 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YEARLY HEATMAP & 12-WEEK TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Weekly Trend Line (6 Cols) */}
        <div className="lg:col-span-6">
          <PejuangWeeklyTrend pejuangList={pejuangList} submissions={submissions} />
        </div>
        
        {/* Overall 4 Week Trend Line (6 Cols) */}
        <div className="lg:col-span-6">
          <Overall4WeekTrend submissions={submissions} />
        </div>

        {/* Top 3 Divisions 6-Month Trajectory (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Tren 6 Bulan: Top 3 Divisi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pergerakan rata-rata persentase performa</p>
            </div>
          </div>
          <div className="h-64">
            {top3Divisions6MonthData.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={top3Divisions6MonthData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  {top3Divisions6MonthData.topDivs[0] && (
                    <Line type="monotone" dataKey={top3Divisions6MonthData.topDivs[0]} stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  )}
                  {top3Divisions6MonthData.topDivs[1] && (
                    <Line type="monotone" dataKey={top3Divisions6MonthData.topDivs[1]} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  )}
                  {top3Divisions6MonthData.topDivs[2] && (
                    <Line type="monotone" dataKey={top3Divisions6MonthData.topDivs[2]} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data untuk periode ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* 12-Week Trend Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                Tren Performa 12 Pekan Terakhir
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Melihat pergerakan rata-rata performa pejuang dalam 12 minggu terakhir (Semua Divisi aktif)</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={twelveWeekTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Performa']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.LabelTooltip;
                    }
                    return label;
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                  {twelveWeekTrendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Performa >= 80 ? '#10b981' : entry.Performa >= 60 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* YEARLY HEATMAP */}
      <MonthlyHeatmap submissions={submissions} year={selectedYear} month={selectedMonth} onDateClick={(dayNum, dateStr) => setActiveCalendarDate({ dayNum, dateStr })} />

      {/* WEEKLY TREND & CALENDAR SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Trend Chart (8 Cols) */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Grafik Garis Tren Performa Mingguan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Persentase rata-rata ketercapaian kegiatan per pekan</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Performa Rata-rata']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="Performa" stroke="#059669" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>Tinggi (≥80%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              <span>Sedang (60-79%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span>Perlu Coaching (&lt;60%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* YEARLY SUMMARY CHART */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Yearly Summary - Performa Divisi</h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200 uppercase">
            Tahun {selectedYear}
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlySummaryData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                cursor={{fill: 'rgba(226, 232, 240, 0.2)'}}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {Array.from(new Set(activePejuangList.map(p => p.subDivisi || "Lainnya"))).map((sd, idx) => {
                const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
                return <Bar key={sd} dataKey={sd} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONSISTENCY HEATMAP */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 mb-6 overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Consistency Heatmap (Bulan Ini)</h3>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button 
              onClick={() => setHeatmapSortBy("performance")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${heatmapSortBy === "performance" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              By Performa (Pekan {selectedWeek})
            </button>
            <button 
              onClick={() => setHeatmapSortBy("name")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${heatmapSortBy === "name" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Alphabetical
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="p-2 text-xs font-bold text-slate-500 w-48 truncate">Nama Pejuang</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 1</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 2</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 3</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 4</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 5</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.pejuang.id}>
                  <td className="p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[180px] bg-slate-50 dark:bg-slate-700/30 rounded-md">
                    <div className="truncate mb-1">{row.pejuang.nama}</div>
                    <div className="flex flex-wrap gap-1">
                      {getPejuangBadges(row.pejuang.id, top3Bulanan).map((badge, i) => (
                        <span key={i} title={badge.title} className="text-sm bg-white dark:bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center shadow-xs border border-slate-200 dark:border-slate-600 cursor-help">
                          {badge.icon}
                        </span>
                      ))}
                    </div>
                  </td>
                  {[row.w1, row.w2, row.w3, row.w4, row.w5].map((val, idx) => {
                    let bgClass = "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
                    if (val !== undefined) {
                      if (val >= 90) bgClass = "bg-emerald-500 text-white";
                      else if (val >= 75) bgClass = "bg-emerald-400 text-emerald-950";
                      else if (val >= 50) bgClass = "bg-emerald-300 text-emerald-950";
                      else bgClass = "bg-emerald-200 text-emerald-950";
                    }
                    return (
                      <td key={idx} className={`p-2 text-[10px] font-bold text-center rounded-md ${bgClass} transition-colors`}>
                        {val !== undefined ? `${val}%` : '-'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 MONTHS DIVISION CHART */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs mb-6">
        <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            Rata-rata Skor per Divisi (3 Bulan Terakhir)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Menampilkan rata-rata skor performa setiap divisi berdasarkan data 3 bulan terakhir dari bulan terpilih.</p>
        </div>
        
        {threeMonthsDivisionData.length === 0 ? (
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data untuk periode ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <div style={{ width: Math.max(600, threeMonthsDivisionData.length * 80), height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={threeMonthsDivisionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#64748b" }} 
                    angle={-45} 
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#94a3b8" }} 
                  />
                  <Tooltip 
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }}
                    formatter={(value: number) => [`${value}%`, "Rata-rata"]}
                  />
                  <Bar 
                    dataKey="RataRata" 
                    radius={[4, 4, 0, 0]}
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* COMPARISON CHART */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs mb-6">
        <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            Perbandingan Produktivitas Pejuang
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Perbandingan persentase performa rata-rata pejuang dalam Divisi {subDivisiFilter || "Semua Divisi"}</p>
        </div>
        
        <div className="flex justify-end mb-4">
          <select value={compareChartWeek} onChange={(e) => setCompareChartWeek(e.target.value === "all" ? "all" : parseInt(e.target.value))} className="p-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="all">Keseluruhan Bulan</option>
            <option value={1}>Pekan 1 (Tanggal 01 - 07)</option>
            <option value={2}>Pekan 2 (Tanggal 08 - 14)</option>
            <option value={3}>Pekan 3 (Tanggal 15 - 21)</option>
            <option value={4}>Pekan 4 (Tanggal 22 - 28)</option>
            <option value={5}>Pekan 5 (Tanggal 29 - 31)</option>
          </select>
        </div>
        {subDivisiCompareData.length === 0 ? (
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data untuk periode ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <div style={{ width: Math.max(800, subDivisiCompareData.length * 60), height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subDivisiCompareData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#64748b" }} 
                    angle={-45} 
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#94a3b8" }} 
                  />
                  <Tooltip 
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }}
                    formatter={(value: number) => [`${value}%`, "Performa"]}
                  />
                  <Bar 
                    dataKey="Performa" 
                    radius={[4, 4, 0, 0]}
                  >
                    {subDivisiCompareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.Performa >= 90 ? "#10b981" : entry.Performa >= 75 ? "#f59e0b" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* STATUS SUBMISSION LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Status Penyetoran Checklist (Pekan {selectedWeek})
          </h3>
          <div className="flex flex-wrap items-center gap-2">
             <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pilih Pekan:</span>
             {[1, 2, 3, 4, 5].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                    selectedWeek === w
                      ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                      : "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  Pekan {w}
                </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sudah Menyetorkan */}
          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
            <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              Sudah Menyetorkan ({submittedList.length})
            </h4>
            {submittedList.length === 0 ? (
              <p className="text-sm text-emerald-600/70 italic">Belum ada yang menyetorkan pada pekan ini.</p>
            ) : (
              <ul className="space-y-2">
                {submittedList.map(p => (
                  <li key={p.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-emerald-100/50 shadow-sm flex flex-col items-start">
                    <button onClick={() => setHistoryModalPejuang(p)} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors text-left">{p.nama}</button>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{p.subDivisi}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Belum Menyetorkan */}
          <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
            <h4 className="font-bold text-rose-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" />
              Belum Menyetorkan ({unsubmittedList.length})
            </h4>
            {unsubmittedList.length === 0 ? (
              <p className="text-sm text-rose-600/70 italic">Alhamdulillah, semua sudah menyetorkan.</p>
            ) : (
              <ul className="space-y-2">
                {unsubmittedList.map(p => (
                  <li key={p.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-rose-100/50 shadow-sm flex flex-col items-start">
                    <button onClick={() => setHistoryModalPejuang(p)} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors text-left">{p.nama}</button>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{p.subDivisi}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* UNDERPERFORMING PEJUANG & PERSONAL COACHING LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3">
          <div>
            <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Evaluasi & Personal Coaching Pejuang (Performa Menurun)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Daftar pejuang dengan ketercapaian target di bawah 75% untuk segera diberikan pembinaan & coaching personal oleh Lead Divisi.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full w-fit">
            {underperformingList.length} Pejuang Perlu Evaluasi
          </span>
        </div>

        {underperformingList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <UserCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-800 dark:text-slate-200">Alhamdulillah! Semua Pejuang Mencapai Target</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tidak ada pejuang dengan performa menurun pada periode ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {underperformingList.map((item, idx) => (
              <div key={idx} className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-900 font-bold flex items-center justify-center overflow-hidden border border-rose-300">
                      {item.pejuang.fotoUrl ? (
                        <img src={item.pejuang.fotoUrl} alt={item.pejuang.nama} className="w-full h-full object-cover" />
                      ) : (
                        item.pejuang.nama.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.pejuang.nama}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.pejuang.subDivisi} • {item.pejuang.amanah}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-300">
                    {item.score}%
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p><span className="font-semibold">Predikat:</span> Predikat {item.score >= 91 ? 'A' : item.score >= 75 ? 'B' : item.score >= 40 ? 'C' : 'D'}</p>
                  <p><span className="font-semibold">Rekomendasi:</span> Coaching Personal oleh Head {item.pejuang.subDivisi}</p>
                </div>

                {role === 'admin' ? (
                  <button
                    onClick={() => setCoachingPejuang(item.pejuang)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Beri Coaching Personal</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-rose-700 italic text-center block bg-rose-100/80 py-1 rounded">
                    Menunggu Coaching oleh Lead Divisi
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANAGEMENT MONTHLY SUMMARY & RANKINGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RANKINGS LIST (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top 5 Pejuang Konsorsium
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Urutan ketercapaian terbanyak berdasarkan checklist harian</p>
            </div>

            {/* Switch Period: Pekan vs Bulan */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              <button
                onClick={() => setRankingPeriod("pekan")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  rankingPeriod === "pekan"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
                }`}
              >
                Per Pekan
              </button>
              <button
                onClick={() => setRankingPeriod("bulan")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  rankingPeriod === "bulan"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
                }`}
              >
                Per Bulan
              </button>
            </div>
          </div>

          {rankingPeriod === "pekan" && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pilih Pekan:</span>
              {[1, 2, 3, 4, 5].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                    selectedWeek === w
                      ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                      : "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  Pekan {w}
                </button>
              ))}
            </div>
          )}

          {rankings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              Belum ada data checklist terisi untuk periode ini.
            </div>
          ) : (
            <div className="space-y-2.5">
              {rankings.slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  onClick={() => setHistoryModalPejuang(r.pejuang)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    i === 0
                      ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                      : i === 1
                      ? "bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600"
                      : i === 2
                      ? "bg-amber-900/5 border-amber-200"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Badge Medal */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </div>

                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center overflow-hidden border border-emerald-300">
                      {r.pejuang.fotoUrl ? (
                        <img src={r.pejuang.fotoUrl} alt={r.pejuang.nama} className="w-full h-full object-cover" />
                      ) : (
                        r.pejuang.nama.charAt(0)
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{r.pejuang.nama}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{r.pejuang.subDivisi}
                      {r.count < r.expectedCount && (
                        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${r.count < 3 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`} title={`Hanya mengisi ${r.count} dari ${r.expectedCount} pekan yang dinilai`}>
                          {r.count < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'} ({r.count}/{r.expectedCount})
                        </span>
                      )} • {r.pejuang.amanah}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-base font-extrabold ${
                      r.score >= 80 ? "text-emerald-700" : r.score >= 60 ? "text-amber-700" : "text-rose-700"
                    }`}>
                      {r.score}%
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Kat. {r.highestCategory}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MONTHLY SUMMARY FOR MANAGEMENT (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Ringkasan Performa Manajemen
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Laporan eksekutif produktivitas bulanan</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Pencapaian Target Konsorsium</span>
                <span className="text-emerald-700 font-bold">{avgPerformance}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${avgPerformance}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-slate-500 dark:text-slate-400 block">Total Pejuang Aktif</span>
                <span className="text-lg font-bold text-emerald-900">{pejuangList.filter(p => p.status === 'aktif').length}</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-slate-500 dark:text-slate-400 block">Laporan Tervalidasi</span>
                <span className="text-lg font-bold text-purple-900">{monthSubmissions.length}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3">
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Sebaran Sub Divisi</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                {subDivisiStats.map((sub, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">{sub.count} Pejuang</span>
                  </div>
                ))}
              </div>
            </div>

            {role === 'admin' && (
              <button
                onClick={onNavigateToChecklist}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-2xs mt-2"
              >
                <span>Input Form Checklist Harian Baru</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* MODAL DATE DETAIL HIJRI/MASEHI */}
      {activeCalendarDate !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Detail Performa Tanggal {activeCalendarDate.dayNum} {GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}
                </h3>
                <p className="text-xs text-amber-700 font-semibold">
                  Kalender Hijriyah: {new Intl.DateTimeFormat('id-ID-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedYear, selectedMonth - 1, activeCalendarDate.dayNum))}
                </p>
              </div>
              <button 
                onClick={() => setActiveCalendarDate(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const info = getTop5PejuangForDate(activeCalendarDate.dayNum);
              return (
                <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                    Top 5 Pejuang (Total Ceklis Keseluruhan: {info.totalChecks})
                  </div>
                  {info.top5.length > 0 ? (
                    info.top5.map((p, idx) => (
                      <div key={p.pejuangId} className={`flex items-center space-x-3 p-3 rounded-xl border ${idx === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex-shrink-0 w-6 font-bold text-slate-400 text-center">{idx + 1}</div>
                        <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center overflow-hidden border text-sm ${idx === 0 ? 'bg-emerald-200 text-emerald-900 border-emerald-300' : 'bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}`}>
                          {p.fotoUrl ? (
                            <img src={p.fotoUrl} alt={p.pejuangNama} className="w-full h-full object-cover" />
                          ) : (
                            p.pejuangNama.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{p.pejuangNama}</h4>
                          <div className="flex items-center text-[10px] text-slate-500 dark:text-slate-400 gap-2 mt-0.5">
                            <span className="font-bold text-emerald-600">{p.percentage}%</span>
                            <span>•</span>
                            <span>Kat {p.kategori}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-sm italic">
                      Belum ada data aktivitas untuk tanggal ini.
                    </div>
                  )}
                </div>
              );
            })()}

            <button
              onClick={() => setActiveCalendarDate(null)}
              className="w-full bg-slate-800 text-white font-bold py-2 rounded-xl text-xs hover:bg-slate-900 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      
      {/* MODAL HIStORICAL PERFORMANCE */}
      {historyModalPejuang && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Riwayat Performa Pejuang</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Histori tren pejuang secara individual</p>
              </div>
              <button 
                onClick={() => setHistoryModalPejuang(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center overflow-hidden">
                {historyModalPejuang.fotoUrl ? (
                  <img src={historyModalPejuang.fotoUrl} alt={historyModalPejuang.nama} className="w-full h-full object-cover" />
                ) : (
                  historyModalPejuang.nama.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{historyModalPejuang.nama}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{historyModalPejuang.subDivisi} • {historyModalPejuang.amanah}</p>
              </div>
              
              {historyModalPejuang.whatsapp && (
                <button
                  onClick={() => {
                    const latestSub = submissions.filter(s => s.pejuangId === historyModalPejuang.id).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
                    let templateMsg = `Assalamu'alaikum, Pejuang ${historyModalPejuang.nama}. `;
                    if (latestSub) {
                       templateMsg += `Ini adalah info terkait performa checklist Anda untuk pekan ${latestSub.pekan} bulan ${latestSub.bulan}, dengan capaian ${latestSub.percentage}%. `;
                    } else {
                       templateMsg += `Mohon segera mengisi checklist performa Anda.`;
                    }
                    window.open(`https://wa.me/${historyModalPejuang.whatsapp}?text=${encodeURIComponent(templateMsg)}`, '_blank');
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi via WA
                </button>
              )}
            </div>

            {(() => {
              const pejuangSubs = submissions.filter(s => s.pejuangId === historyModalPejuang.id).sort((a,b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
              if (pejuangSubs.length === 0) {
                return (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    Belum ada data historis performa untuk pejuang ini.
                  </div>
                );
              }
              
              const historyData = pejuangSubs.map(s => ({
                name: `Pekan ${s.pekan}/${s.bulan}`,
                Performa: s.percentage,
                Tanggal: new Date(s.updatedAt).toLocaleDateString('id-ID')
              }));
              
              return (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Skor Performa']}
                        labelFormatter={(label, payload) => payload && payload.length > 0 ? `${label} (${payload[0].payload.Tanggal})` : label}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="Performa" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setHistoryModalPejuang(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERSONAL COACHING INPUT */}
      {coachingPejuang && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Personal Coaching & Evaluasi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kirim arahan personal untuk {coachingPejuang.nama}</p>
              </div>
              <button 
                onClick={() => setCoachingPejuang(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCoachingSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-xs">
                <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-900 font-bold flex items-center justify-center overflow-hidden">
                  {coachingPejuang.fotoUrl ? (
                    <img src={coachingPejuang.fotoUrl} alt={coachingPejuang.nama} className="w-full h-full object-cover" />
                  ) : (
                    coachingPejuang.nama.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{coachingPejuang.nama}</h4>
                  <p className="text-slate-500 dark:text-slate-400">{coachingPejuang.subDivisi} • {coachingPejuang.amanah}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Evaluasi / Arahan Lead Divisi
                </label>
                <textarea
                  rows={4}
                  required
                  value={coachingNote}
                  onChange={(e) => setCoachingNote(e.target.value)}
                  placeholder="Tuliskan poin evaluasi, bimbingan, atau jadwal coaching tatap muka..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCoachingPejuang(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Evaluasi Real-Time</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ACTIVITY TIMELINE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Activity Timeline
        </h3>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {recentEvents.length === 0 ? (
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4">Belum ada aktivitas terekam.</div>
          ) : recentEvents.map((evt, idx) => (
            <div key={evt.id + idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 dark:bg-slate-700 group-[.is-active]:bg-emerald-50 text-slate-500 dark:text-slate-400 group-[.is-active]:text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Clock className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{evt.title}</h4>
                  <time className="text-[10px] text-slate-400">{evt.date.toLocaleDateString('id-ID', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'})}</time>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{evt.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRILLDOWN MODAL */}
      {selectedDrilldownPejuang && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Profil Pejuang & Histori</h3>
              <button 
                onClick={() => setSelectedDrilldownPejuang(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
              {selectedDrilldownPejuang.fotoUrl ? (
                <img src={selectedDrilldownPejuang.fotoUrl} alt={selectedDrilldownPejuang.nama} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl border-2 border-white shadow-sm">
                  {selectedDrilldownPejuang.nama.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedDrilldownPejuang.nama}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{selectedDrilldownPejuang.amanah} &bull; {selectedDrilldownPejuang.subDivisi}</p>
                {(() => {
                  const badges = calculateBadges(submissions, selectedDrilldownPejuang.id); // Historical, no strict expected count
                  if (badges.length === 0) return null;
                  
                  const getIcon = (iconName: string) => {
                    switch(iconName) {
                      case 'Award': return <Award className="w-3.5 h-3.5 mr-1" />;
                      case 'Medal': return <Medal className="w-3.5 h-3.5 mr-1" />;
                      case 'Star': return <Star className="w-3.5 h-3.5 mr-1" />;
                      case 'Zap': return <Zap className="w-3.5 h-3.5 mr-1" />;
                      default: return <Award className="w-3.5 h-3.5 mr-1" />;
                    }
                  };

                  return (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {badges.map((badge, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}
                          title={badge.description}
                        >
                          {getIcon(badge.icon)}
                          {badge.label}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm pt-2 border-t border-slate-100 dark:border-slate-700/50">Histori Checklist (Terbaru)</h4>
            <div className="space-y-2">
              {submissions.filter(s => s.pejuangId === selectedDrilldownPejuang.id).sort((a,b) => b.tahun - a.tahun || b.bulan - a.bulan || b.pekan - a.pekan).slice(0, 10).map((s, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{s.periodeStr}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Pekan {s.pekan} &bull; {GREGORIAN_MONTHS_ID[s.bulan-1]} {s.tahun}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600 block">{s.percentage}%</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Predikat {s.percentage >= 91 ? 'A' : s.percentage >= 76 ? 'B' : s.percentage >= 40 ? 'C' : 'D'}</span>
                  </div>
                </div>
              ))}
              {submissions.filter(s => s.pejuangId === selectedDrilldownPejuang.id).length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">Belum ada histori pengisian form.</p>
              )}
            </div>
            
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700/50">
              <button onClick={() => setSelectedDrilldownPejuang(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

