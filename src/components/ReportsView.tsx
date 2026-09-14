import React, { useState, useRef } from "react";
import { useAppLogo } from '../hooks/useAppLogo';
import CertificateModal from "./CertificateModal";
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  User,
  Printer, 
  Building2, 
  Award, 
  Medal,
  Star,
  Zap,
  Calendar, 
  BarChart2, 
  Send,
  CheckCircle2,
  XCircle 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, ReferenceLine, LineChart, Line, Legend, 
  Cell

} from "recharts";
import { 
  Pejuang, 
  ChecklistFormSubmission, 
  Role 
} from "../types";
import { GREGORIAN_MONTHS_ID, getWeeksInMonth } from "../utils/hijri";
import * as htmlToImage from "html-to-image";
import { SUB_DIVISI_LIST } from "../utils/defaultTasks";
import { translateText } from "../utils/translate";
import { fetchSholatAttendances, fetchNotifications } from '../services/dbService';
import { SystemNotification } from '../types';
import { exportFormToPDF, exportMonthlyPejuangToPDF, exportToExcel, exportToCSV, exportElementToImage, exportSummaryToPDF, exportElementToPDF } from "../utils/export";
import { AnimatedDownloadButton } from './AnimatedDownloadButton';
import { fetchDocumentUploads } from "../services/dbService";
import { calculateBadges } from "../utils/badges";
import ReactMarkdown from 'react-markdown';

interface ReportsViewProps {
  pejuangList: Pejuang[];
  submissions: ChecklistFormSubmission[];
  role: Role;
  onTriggerPeriodNotification: (message: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  pejuangList,
  submissions,
  role,
  onTriggerPeriodNotification
}) => {
  const appLogo = useAppLogo();
  const [reportType, setReportType] = useState<"pejuang" | "divisi" | "bulan" | "pekan" | "rentang">("pejuang");
  const [selectedPejuangId, setSelectedPejuangId] = useState<string>("");
  const [selectedDivisi, setSelectedDivisi] = useState<string>("Kepondokan");
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Juni
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [filterSubDivisi, setFilterSubDivisi] = useState<string>("Semua Divisi");
  const [selectedCertData, setSelectedCertData] = useState<{name: string, divisi: string, performa: number} | null>(null);
  const weeklyTarget = Number(localStorage.getItem("weeklyTarget")) || 80;

  const printAreaRef = useRef<HTMLDivElement>(null);

  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string>("");
  const [previewAction, setPreviewAction] = useState<() => void>(() => {});
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [coachingHistory, setCoachingHistory] = useState<SystemNotification[]>([]);

  React.useEffect(() => {
    fetchNotifications().then(notifs => {
      setCoachingHistory(notifs.filter(n => n.type === 'coaching'));
    });
  }, []);

  // Set default pejuang if none selected
  React.useEffect(() => {
    if (!selectedPejuangId && pejuangList.length > 0) {
      setSelectedPejuangId(pejuangList[0].id);
    }
  }, [pejuangList, selectedPejuangId]);

  const activePejuang = pejuangList.find(p => p.id === selectedPejuangId);

  // Filter submission for selected Pejuang, Month, Year, Week, or Rentang
  const targetSubmission = React.useMemo(() => {
    if (reportType === "bulan" || reportType === "rentang") {
      let filteredSubs = [];
      if (reportType === "bulan") {
        filteredSubs = submissions.filter(
          s => s.pejuangId === selectedPejuangId &&
               s.bulan === selectedMonth &&
               s.tahun === selectedYear
        );
      } else {
        // Rentang Waktu (filter by updatedAt)
        if (!startDate || !endDate) return undefined;
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime() + 86400000; // include full end day
        filteredSubs = submissions.filter(s => {
          if (!s.updatedAt || s.pejuangId !== selectedPejuangId) return false;
          const subTime = new Date(s.updatedAt).getTime();
          return subTime >= start && subTime < end;
        });
      }

      if (filteredSubs.length === 0) return undefined;
      
      const firstSub = filteredSubs[0];
      const mergedTasksMap = new Map();
      let totalChecked = 0;
      let totalPossible = 0;
      let allDates = [];

      filteredSubs.forEach(sub => {
        totalChecked += sub.totalChecked || 0;
        totalPossible += sub.totalPossible || 0;
        sub.dates.forEach(d => {
          if (!allDates.includes(d)) allDates.push(d);
        });

        sub.tasks.forEach(task => {
          if (!mergedTasksMap.has(task.taskId)) {
            mergedTasksMap.set(task.taskId, { ...task, realisasiChecks: { ...task.realisasiChecks }, rencanaChecks: { ...task.rencanaChecks } });
          } else {
            const existing = mergedTasksMap.get(task.taskId);
            existing.realisasiChecks = { ...existing.realisasiChecks, ...task.realisasiChecks };
            existing.rencanaChecks = { ...existing.rencanaChecks, ...task.rencanaChecks };
          }
        });
      });

      allDates.sort((a, b) => a - b);
      let totalPercentageSum = 0;
      filteredSubs.forEach(sub => {
        totalPercentageSum += (sub.percentage || 0);
      });
      const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
      const percentage = Math.round(totalPercentageSum / expectedWeeks);

      return {
        ...firstSub,
        pekan: 99,
        periodeStr: reportType === "bulan" 
          ? `Sebulan Penuh (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`
          : `Rentang Tanggal (${startDate} s/d ${endDate})`,
        dates: allDates,
        tasks: Array.from(mergedTasksMap.values()).sort((a, b) => a.no - b.no),
        totalChecked,
        totalPossible,
        percentage,
        submissionsCount: filteredSubs.length,
        expectedCount: expectedWeeks
      };
    } else {
      return submissions.find(
        s => s.pejuangId === selectedPejuangId &&
             s.bulan === selectedMonth &&
             s.tahun === selectedYear &&
             s.pekan === selectedWeek
      );
    }
  }, [reportType, submissions, selectedPejuangId, selectedMonth, selectedYear, selectedWeek, startDate, endDate]);

  const [dokumenUrls, setDokumenUrls] = React.useState<string[]>([]);
  const [aiInsight, setAiInsight] = React.useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = React.useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  React.useEffect(() => {
    if (selectedPejuangId) {
      fetchDocumentUploads().then(docs => {
        let pejuangDocs = docs.filter(d => d.pejuangId === selectedPejuangId);
        if (reportType === 'pejuang') {
          pejuangDocs = pejuangDocs.filter(d => d.bulan === selectedMonth && d.tahun === selectedYear && d.pekan === selectedWeek);
        } else if (reportType === 'bulan') {
          pejuangDocs = pejuangDocs.filter(d => d.bulan === selectedMonth && d.tahun === selectedYear);
        } else if (reportType === 'rentang' && startDate && endDate) {
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime() + 86400000;
          pejuangDocs = pejuangDocs.filter(d => {
            const subTime = new Date(d.waktuSetor || 0).getTime();
            return subTime >= start && subTime < end;
          });
        }
        if (pejuangDocs.length > 0) {
          const urls = [];
          pejuangDocs.forEach(doc => {
            if (doc.foto1) urls.push(doc.foto1);
            if (doc.foto2) urls.push(doc.foto2);
            if (doc.foto3) urls.push(doc.foto3);
          });
          setDokumenUrls(urls);
        } else {
          setDokumenUrls([]);
        }
      });
    }
  }, [selectedPejuangId, reportType, selectedMonth, selectedYear, selectedWeek, startDate, endDate]);

  // Data for Category breakdown chart
  const divisiData = React.useMemo(() => {
    if (reportType !== "divisi") return [];
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");
    return divPejuangs.map(p => {
      const getW = (wk: number) => {
         const s = submissions.find(s => s.pejuangId === p.id && s.pekan === wk && s.bulan === selectedMonth && s.tahun === selectedYear);
         return s ? s.percentage : "-";
      };
      
      const w1 = getW(1);
      const w2 = getW(2);
      const w3 = getW(3);
      const w4 = getW(4);
      const w5 = getW(5);

      const sBulan = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      const count = sBulan.length;
      const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
      const expectedCount = reportType === "divisi" ? totalWeeksInMonth : 1;
      const performa = Math.round(sBulan.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);
      
      return { 
         pejuang: p, 
         w1, w2, w3, w4, w5, 
         performa, 
         submissionsCount: count,
         expectedCount,
         evaluasi: performa >= 91 ? "A" : performa >= 76 ? "B" : performa >= 40 ? "C" : "D"
      };
    }).sort((a, b) => b.performa - a.performa);
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);

  const subdivisiAverages = React.useMemo(() => {
    const map: Record<string, { total: number, count: number }> = {};
    pejuangList.forEach(p => {
      if (p.status === "aktif") {
        if (!map[p.subDivisi]) map[p.subDivisi] = { total: 0, count: 0 };
      }
    });

    const rekap = pejuangList.filter(p => p.status === "aktif").map(p => {
      let filteredSubs = [];
      if (reportType === "bulan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "pekan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "rentang") {
        if (startDate && endDate) {
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime() + 86400000;
          filteredSubs = submissions.filter(s => {
            if (!s.updatedAt || s.pejuangId !== p.id) return false;
            const subTime = new Date(s.updatedAt).getTime();
            return subTime >= start && subTime < end;
          });
        }
      }
      
      const count = filteredSubs.length;
      const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
      const expectedCount = reportType === "bulan" ? totalWeeksInMonth : reportType === "pekan" ? 1 : Math.max(1, count);
      const performa = Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);
      return { subDivisi: p.subDivisi, performa };
    });

    rekap.forEach(r => {
      if (map[r.subDivisi]) {
        map[r.subDivisi].total += r.performa;
        map[r.subDivisi].count += 1;
      }
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      Performa: data.count > 0 ? Math.round(data.total / data.count) : 0
    })).sort((a, b) => b.Performa - a.Performa);
  }, [pejuangList, submissions, reportType, selectedMonth, selectedYear, selectedWeek, startDate, endDate]);

  const rekapData = React.useMemo(() => {
    // Calculate always for pejuang ranking as well
    
    return pejuangList.filter(p => p.status === "aktif").map(p => {
      let filteredSubs = [];
      if (reportType === "bulan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "pekan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "rentang") {
        if (startDate && endDate) {
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime() + 86400000;
          filteredSubs = submissions.filter(s => {
            if (!s.updatedAt || s.pejuangId !== p.id) return false;
            const subTime = new Date(s.updatedAt).getTime();
            return subTime >= start && subTime < end;
          });
        }
      }
      
      const count = filteredSubs.length;
      const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
      // For rentang, we could count the weeks, but let's default to totalWeeksInMonth if it's month
      const expectedCount = reportType === "bulan" ? totalWeeksInMonth : reportType === "pekan" ? 1 : Math.max(1, count); // fallback for rentang
      const performa = Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);
      
      // Calculate W1-W5 if reportType is bulan
      const getW = (wk: number) => {
         const s = submissions.find(s => s.pejuangId === p.id && s.pekan === wk && s.bulan === selectedMonth && s.tahun === selectedYear);
         return s ? s.percentage : "-";
      };
      
      return { 
         pejuang: p, 
         w1: reportType === "bulan" ? getW(1) : "-",
         w2: reportType === "bulan" ? getW(2) : "-",
         w3: reportType === "bulan" ? getW(3) : "-",
         w4: reportType === "bulan" ? getW(4) : "-",
         w5: reportType === "bulan" ? getW(5) : "-",
         performa, 
         submissionsCount: count,
         expectedCount,
         evaluasi: performa >= 91 ? "A" : performa >= 76 ? "B" : performa >= 40 ? "C" : "D"
      };
    }).sort((a, b) => b.performa - a.performa);
  }, [reportType, pejuangList, submissions, selectedMonth, selectedYear, selectedWeek, startDate, endDate]);

  const trendData = React.useMemo(() => {
    if (reportType !== "divisi") return [];
    
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");
    const divPejuangIds = new Set(divPejuangs.map(p => p.id));
    
    const months = [];
    let currentM = selectedMonth;
    let currentY = selectedYear;
    
    for (let i = 0; i < 3; i++) {
      months.unshift({ month: currentM, year: currentY });
      currentM--;
      if (currentM < 1) {
        currentM = 12;
        currentY--;
      }
    }
    
    return months.map(m => {
      const monthSubs = submissions.filter(s => s.bulan === m.month && s.tahun === m.year && divPejuangIds.has(s.pejuangId));
      let totalPercentage = 0;
      let count = 0;
      
      divPejuangs.forEach(p => {
         const pSubs = monthSubs.filter(s => s.pejuangId === p.id);
         if (pSubs.length > 0) {
           totalPercentage += pSubs.reduce((sum, s) => sum + s.percentage, 0) / pSubs.length;
           count++;
         }
      });
      
      const avg = count > 0 ? Math.round(totalPercentage / count) : 0;
      return {
        name: `${GREGORIAN_MONTHS_ID[m.month - 1].substring(0, 3)} ${m.year}`,
        RataRata: avg
      };
    });
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);


  const trend3BulanDivisiData = React.useMemo(() => {
    if (reportType !== "divisi") return [];
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");
    const divPejuangIds = divPejuangs.map(p => p.id);
    
    // last 3 months including selected month
    const months = [];
    let curM = selectedMonth;
    let curY = selectedYear;
    for (let i = 0; i < 3; i++) {
      months.push({ month: curM, year: curY });
      curM -= 1;
      if (curM === 0) {
        curM = 12;
        curY -= 1;
      }
    }
    months.reverse(); // oldest to newest
    
    return months.map(m => {
      const subs = submissions.filter(s => 
        divPejuangIds.includes(s.pejuangId) && 
        s.bulan === m.month && 
        s.tahun === m.year
      );
      const count = subs.length;
      const totalPct = subs.reduce((sum, s) => sum + s.percentage, 0);
      const avg = count > 0 ? Math.round(totalPct / count) : 0;
      return {
        name: `${GREGORIAN_MONTHS_ID[m.month - 1].substring(0, 3)} ${m.year}`,
        RataRata: avg
      };
    });
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);

  const top3DivisiData = React.useMemo(() => {
    if (reportType !== "divisi" || divisiData.length === 0) return [];
    return [...divisiData]
      .sort((a, b) => b.performa - a.performa)
      .slice(0, 3)
      .map(d => ({
        name: d.pejuang.nama.split(" ")[0],
        Performa: d.performa
      }));
  }, [reportType, divisiData]);


  const pejuangTrendData = React.useMemo(() => {
    if (reportType !== "pejuang" || !activePejuang) return [];
    
    const pejuangMonthSubs = submissions.filter(s => s.pejuangId === activePejuang.id && s.bulan === selectedMonth && s.tahun === selectedYear);
    const trend = [];
    for (let i = 1; i <= 5; i++) {
      const sub = pejuangMonthSubs.find(s => s.pekan === i);
      trend.push({
        name: `Pekan ${i}`,
        Performa: sub ? sub.percentage : 0
      });
    }
    return trend;
  }, [reportType, activePejuang, submissions, selectedMonth, selectedYear]);

  const pejuang6MonthTrendData = React.useMemo(() => {
    if (reportType !== "pejuang" || !activePejuang) return [];
    
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i;
      let y = selectedYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      const monthSubs = submissions.filter(s => s.pejuangId === activePejuang.id && s.bulan === m && s.tahun === y);
      const count = monthSubs.length;
      const expectedCount = getWeeksInMonth(y, m);
      const performa = Math.round(monthSubs.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);
      trend.push({
        name: `${GREGORIAN_MONTHS_ID[m - 1].substring(0,3)} ${y}`,
        Performa: performa || 0
      });
    }
    return trend;
  }, [reportType, activePejuang, submissions, selectedMonth, selectedYear]);

  const categoryData = React.useMemo(() => {
    if (!targetSubmission) return [];
    const catMap: Record<string, number> = {};
    targetSubmission.tasks.forEach(t => {
      let cCount = 0;
      targetSubmission.dates.forEach(d => {
        if (t.realisasiChecks?.[d]) cCount++;
      });
      catMap[t.kategori] = (catMap[t.kategori] || 0) + cCount;
    });

    return Object.entries(catMap).map(([cat, count]) => ({
      category: `Kat ${cat}`,
      Ceklis: count
    }));
  }, [targetSubmission]);

  const isExportDisabled = React.useMemo(() => {
    if (reportType === "pejuang") return !targetSubmission;
    if (reportType === "divisi") return divisiData.length === 0 || divisiData.every(d => d.submissionsCount === 0);
    if (reportType === "bulan" || reportType === "pekan" || reportType === "rentang") return rekapData.length === 0 || rekapData.every(d => d.submissionsCount === 0);
    return false;
  }, [reportType, targetSubmission, divisiData, rekapData]);

  const handleExportBulanPejuangPDF = async () => {
    if (!selectedPejuangId) return;
    
    const pejuang = pejuangList.find(p => p.id === selectedPejuangId);
    const monthSubmissions = submissions.filter(s => s.pejuangId === selectedPejuangId && s.bulan === selectedMonth && s.tahun === selectedYear);
    
    if (monthSubmissions.length === 0 || !pejuang) {
      setExportError("Belum ada submission untuk pejuang ini di bulan terpilih.");
      return;
    }
    
    setExportError("");
    setPreviewTitle(`Preview Laporan Bulanan ${pejuang.nama} (PDF)`);
    setPreviewData([{ info: `Laporan Konsolidasi Bulanan Pejuang: ${pejuang.nama}` }]);
    setPreviewAction(() => async () => {
      setToastMsg("Mempersiapkan PDF Bulanan Pejuang...");
      setTimeout(() => setToastMsg(null), 3000);
      
      let chartBase64;
      const chartEl = document.getElementById("pejuang-monthly-trend-chart");
      if (chartEl) {
        try {
          chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff", filter: (node) => { if (node.dataset && node.dataset.html2canvasIgnore === "true") return false; return true; } });
        } catch(e) {
          console.error("Failed to capture chart", e);
        }
      }
      
      const periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`;
      const pejuangBadges = calculateBadges(monthSubmissions, pejuang.id, getWeeksInMonth(selectedYear, selectedMonth));
      
      const pKeseluruhanIdx = rekapData.findIndex(d => d.pejuang.id === pejuang.id);
      const peringkatKeseluruhan = pKeseluruhanIdx !== -1 ? `#${pKeseluruhanIdx + 1} dari ${rekapData.length}` : "-";
      
      const divisiDataList = rekapData.filter(d => d.pejuang.subDivisi === pejuang.subDivisi);
      const pDivisiIdx = divisiDataList.findIndex(d => d.pejuang.id === pejuang.id);
      const peringkatDivisi = pDivisiIdx !== -1 ? `#${pDivisiIdx + 1} dari ${divisiDataList.length}` : "-";
      
      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, dokumenUrls, pejuangBadges, peringkatKeseluruhan, peringkatDivisi, submissions);
      setIsGeneratingPDF(false);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };

  const handleExportPDF = async () => {
    if (isExportDisabled) {
      setExportError("No data found for the selected period");
      return;
    }
    setExportError("");
    setPreviewTitle("Preview Laporan Checklist (PDF)");
    
    const previewRows = targetSubmission.tasks.map((t, idx) => ({
      No: idx + 1,
      UraianKegiatan: t.uraian,
      TotalCheck: targetSubmission.dates.filter(d => t.realisasiChecks?.[d]).length
    }));
    setPreviewData(previewRows);

    setPreviewAction(() => async () => {
      let chartBase64;
      const chartEl = document.getElementById("category-chart-container");
      if (chartEl) {
        try {
          chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff", filter: (node) => { if (node.dataset && node.dataset.html2canvasIgnore === "true") return false; return true; } });
        } catch(e) {
          console.error("Failed to capture chart", e);
        }
      }
      
      let sholatData = [];
      try {
        const allSholat = await fetchSholatAttendances();
        // filter by pejuangId and date range (within submission.dates)
        if (targetSubmission && targetSubmission.pejuangId) {
            sholatData = allSholat.filter(s => s.pejuangId === targetSubmission.pejuangId && targetSubmission.dates.some(d => s.date.endsWith(String(d).padStart(2, '0'))));
        }
      } catch(e) {}
      await exportFormToPDF(targetSubmission, activePejuang, submissions, chartBase64, dokumenUrls, sholatData);

      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };

  const handleExportPNG = async () => {
    if (isExportDisabled) {
      setExportError("No data found for the selected period");
      return;
    }
    setExportError("");
    setPreviewTitle("Preview Laporan Checklist (PNG)");
    const previewRows = targetSubmission.tasks.map((t, idx) => ({
      No: idx + 1,
      UraianKegiatan: t.uraian,
      TotalCheck: targetSubmission.dates.filter(d => t.realisasiChecks?.[d]).length
    }));
    setPreviewData(previewRows);

    setPreviewAction(() => async () => {
      if (printAreaRef.current) {
        await exportElementToImage("official-print-paper", `${translateText("Laporan_Checklist")}_${translateText(activePejuang?.nama || 'Pejuang')}`);
      }
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };

  const handleExportExcel = () => {
    if (isExportDisabled) {
      setExportError("No data found for the selected period");
      return;
    }
    setExportError("");
    setPreviewTitle("Preview Laporan Checklist (Excel)");
    const exportRows = targetSubmission.tasks.map((t, idx) => ({
      No: idx + 1,
      Waktu: t.waktu,
      UraianKegiatan: t.uraian,
      Kategori: t.kategori,
      TotalCheck: targetSubmission.dates.filter(d => t.realisasiChecks?.[d]).length,
      Catatan: t.catatan || ""
    }));
    setPreviewData(exportRows);

    setPreviewAction(() => () => {
      setToastMsg("Menyiapkan dokumen Excel...");
      setTimeout(() => setToastMsg(null), 3000);
      exportToExcel(exportRows, `${translateText("Checklist")}_${translateText(targetSubmission.pejuangNama)}_${translateText("Pekan")}${selectedWeek}`);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };
  const handleExportCSV = () => {
    if (isExportDisabled) {
      setExportError("No data found for the selected period");
      return;
    }
    setExportError("");

    setPreviewTitle("Preview Laporan (CSV)");
    
    let exportRows: any[] = [];
    let fileName = "";

    if (reportType === "pejuang" && targetSubmission) {
      exportRows = targetSubmission.tasks.map((t, idx) => ({
        No: idx + 1,
        Waktu: t.waktu,
        UraianKegiatan: t.uraian,
        Kategori: t.kategori,
        TotalCheck: targetSubmission.dates.filter(d => t.realisasiChecks?.[d]).length,
        Catatan: t.catatan || ""
      }));
      fileName = `${translateText("Checklist")}_${translateText(targetSubmission.pejuangNama)}_${translateText("Pekan")}${selectedWeek}`;
    } else if ((reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && rekapData.length > 0) {
      exportRows = rekapData.map((d, idx) => ({
        Peringkat: idx + 1,
        NamaPejuang: d.pejuang.nama,
        SubDivisi: d.pejuang.subDivisi,
        Amanah: d.pejuang.amanah,
        FormDisubmit: d.submissionsCount,
        PerformaRataRata: `${d.performa}%`,
        Evaluasi: d.evaluasi
      }));
      fileName = `${translateText("Rekapitulasi_Kinerja")}_${translateText(reportType === 'bulan' ? 'Bulanan' : reportType === 'pekan' ? 'Mingguan' : 'Rentang')}_${selectedMonth}_${selectedYear}`;
    }

    setPreviewData(exportRows);
    setPreviewAction(() => () => {
      setToastMsg("Menyiapkan dokumen CSV...");
      setTimeout(() => setToastMsg(null), 3000);
      exportToCSV(exportRows, fileName);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };

  // Trigger End of Period Notification
  const handleTriggerAutoNotification = () => {
    const periodName = `Pekan ${selectedWeek} ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;
    onTriggerPeriodNotification(
      `Pengingat Otomatis Akhir Periode: Laporan checklist periode ${periodName} telah ditutup. Silakan lakukan verifikasi & penganugerahan pejuang terbaik!`
    );
    alert(`Notifikasi akhir periode (${periodName}) telah dikirimkan ke seluruh tim!`);
  };

  return (
    <div id="reports-view" className="space-y-6 pb-12">
      {toastMsg && (
        <div className="fixed bottom-[5.5rem] md:bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}
      
      {/* Top Header & Switcher */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Pusat Pelaporan & Dokumen
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Laporan Per Pejuang, Divisi & Laporan Bulanan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cetak laporan resmi ber-Kop Al-Bahjah dalam format PDF, Excel, maupun Gambar (PNG)
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setReportType("pejuang")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "pejuang"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            Laporan Per Pejuang
          </button>
          <button
            onClick={() => setReportType("divisi")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "divisi"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            Laporan Per Divisi
          </button>
          <button
            onClick={() => setReportType("bulan")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "bulan"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            Laporan Per Bulan
          </button>
          <button
            onClick={() => setReportType("rentang")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "rentang"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            Rentang Tanggal
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Divisi Selector */}
          {reportType === "divisi" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Pilih Divisi</label>
              <select
                value={selectedDivisi}
                onChange={(e) => setSelectedDivisi(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-2 text-slate-800 dark:text-slate-200"
              >
                {SUB_DIVISI_LIST.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Pejuang Selector */}
          {(reportType === "pejuang" || reportType === "bulan" || reportType === "rentang") && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Pilih Pejuang</label>
              <select
                value={selectedPejuangId}
                onChange={(e) => setSelectedPejuangId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-2 text-slate-800 dark:text-slate-200"
              >
                {pejuangList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama} ({p.subDivisi})</option>
                ))}
              </select>
            </div>
          )}

          {/* Month & Year */}
          {reportType !== "rentang" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Bulan & Tahun</label>
              <div className="flex space-x-1">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-2 text-slate-800 dark:text-slate-200"
                >
                  {GREGORIAN_MONTHS_ID.map((m, idx) => (
                    <option key={idx} value={idx + 1}>{m}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-2 text-slate-800 dark:text-slate-200"
                >
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>
          )}

          {/* Date Range Filters */}
          {reportType === "rentang" && (
            <div className="flex space-x-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-1.5 text-slate-800 dark:text-slate-200 h-[34px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Sampai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-1.5 text-slate-800 dark:text-slate-200 h-[34px]"
                />
              </div>
            </div>
          )}

          {/* Week */}
          {reportType !== "bulan" && reportType !== "rentang" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Pekan</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 font-bold text-xs rounded-xl p-2 text-slate-800 dark:text-slate-200"
              >
                <option value={1}>Pekan 1 (Tanggal 01 - 07)</option>
                <option value={2}>Pekan 2 (Tanggal 08 - 14)</option>
                <option value={3}>Pekan 3 (Tanggal 15 - 21)</option>
                <option value={4}>Pekan 4 (Tanggal 22 - 28)</option>
                <option value={5}>Pekan 5 (Tanggal 29 - 31)</option>
              </select>
            </div>
          )}

        </div>

        {/* Export & Auto Notif Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {reportType === "pejuang" && (
            <>
              <button
                disabled={isExportDisabled}
                onClick={() => window.print()}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Preview</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={handleExportPDF}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Format PDF</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={handleExportExcel}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={handleExportCSV}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={handleExportPNG}
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gambar PNG</span>
              </button>
            </>
          )}

          {(reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && (
            <>
              <button
                disabled={isExportDisabled}
                onClick={() => window.print()}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Preview</span>
              </button>
              {reportType === "bulan" && selectedPejuangId && (
                 <button
                   disabled={isGeneratingPDF}
                   onClick={handleExportBulanPejuangPDF}
                   data-html2canvas-ignore="true" 
                   className={`flex items-center space-x-1.5 ${isGeneratingPDF ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
                 >
                   {isGeneratingPDF ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <FileText className="w-4 h-4" />}
                   <span>{isGeneratingPDF ? "Memproses PDF..." : "Unduh Bulanan Pejuang"}</span>
                 </button>
              )}
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = pejuangList.map((p, idx) => {
                    let filteredSubs = [];
                    if (reportType === "bulan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "pekan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "rentang") {
                      if (!startDate || !endDate) return null;
                      const start = new Date(startDate).getTime();
                      const end = new Date(endDate).getTime() + 86400000;
                      filteredSubs = submissions.filter(s => {
                        if (!s.updatedAt || s.pejuangId !== p.id) return false;
                        const subTime = new Date(s.updatedAt).getTime();
                        return subTime >= start && subTime < end;
                      });
                    }
                    if (!filteredSubs) return null;

                    let totalChecked = 0;
                    let totalPossible = 0;
                    
                    let totalPercentageSum = 0;
                    filteredSubs.forEach(sub => {
                      totalPercentageSum += (sub.percentage || 0);
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const statusText = reportType === "bulan" && filteredSubs.length < expectedWeeks ? ` (${filteredSubs.length < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${filteredSubs.length}/${expectedWeeks})` : "";

                    return {
                      No: idx + 1,
                      Nama: p.nama + statusText,
                      "Sub Divisi": p.subDivisi,
                      Amanah: p.amanah,
                      "Total Target (Item)": totalPossible,
                      "Total Realisasi (Item)": totalChecked,
                      "Persentase (%)": percentage,
                      Predikat: percentage > 0 ? predikat : "-"
                    };
                  }).filter(Boolean);

                  let periodStr = "";
                  if (reportType === "bulan") periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])}_${selectedYear}`;
                  else if (reportType === "pekan") periodStr = `${translateText("Pekan")}_${selectedWeek}_${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])}_${selectedYear}`;
                  else if (reportType === "rentang") periodStr = `${startDate}_${translateText("sd")}_${endDate}`;

                  setPreviewTitle("Preview Rekap Semua Pejuang (Excel)");
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportToExcel(summaryData, `${translateText("Rekap Semua Pejuang")}_${periodStr}`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Rekap Semua Pejuang (Excel)</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = pejuangList.map((p, idx) => {
                    let filteredSubs = [];
                    if (reportType === "bulan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "pekan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "rentang") {
                      if (!startDate || !endDate) return null;
                      const start = new Date(startDate).getTime();
                      const end = new Date(endDate).getTime() + 86400000;
                      filteredSubs = submissions.filter(s => {
                        if (!s.updatedAt || s.pejuangId !== p.id) return false;
                        const subTime = new Date(s.updatedAt).getTime();
                        return subTime >= start && subTime < end;
                      });
                    }
                    if (!filteredSubs) return null;

                    let totalChecked = 0;
                    let totalPossible = 0;
                    
                    const w1 = filteredSubs.find(s => s.pekan === 1);
                    const w2 = filteredSubs.find(s => s.pekan === 2);
                    const w3 = filteredSubs.find(s => s.pekan === 3);
                    const w4 = filteredSubs.find(s => s.pekan === 4);
                    const w5 = filteredSubs.find(s => s.pekan === 5);
                    
                    let totalPercentageSum = 0;
                    filteredSubs.forEach(sub => {
                      totalPercentageSum += (sub.percentage || 0);
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const evaluasi = percentage >= 91 ? "Sangat Baik" : percentage >= 76 ? "Baik" : percentage >= 40 ? "Cukup" : "Kurang";
                    const statusText = reportType === "bulan" && filteredSubs.length < expectedWeeks ? ` (${filteredSubs.length < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${filteredSubs.length}/${expectedWeeks})` : "";

                    return {
                      No: idx + 1,
                      Nama: p.nama + statusText,
                      "Sub Divisi": p.subDivisi,
                      Amanah: p.amanah,
                      "W1": w1 ? w1.percentage : "-",
                      "W2": w2 ? w2.percentage : "-",
                      "W3": w3 ? w3.percentage : "-",
                      "W4": w4 ? w4.percentage : "-",
                      "W5": w5 ? w5.percentage : "-",
                      "Total Target (Item)": totalPossible,
                      "Total Realisasi (Item)": totalChecked,
                      "Persentase (%)": percentage,
                      Predikat: percentage > 0 ? predikat : "-",
                      Evaluasi: percentage > 0 ? evaluasi : "Belum Ada Data"
                    };
                  }).filter(Boolean);

                  let periodStr = "";
                  if (reportType === "bulan") periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`;
                  else if (reportType === "pekan") periodStr = `${translateText("Pekan")} ${selectedWeek} (${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear})`;
                  else if (reportType === "rentang") periodStr = `${startDate} ${translateText("s/d")} ${endDate}`;

                  setPreviewTitle("Preview Rekap Semua Pejuang (PDF)");
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportSummaryToPDF(
                      summaryData,
                      periodStr,
                      "LAPORAN KINERJA PENGURUS KEPONDOKAN"
                    );
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Unduh Rekap Semua Pejuang (PDF)</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <button
              onClick={handleTriggerAutoNotification}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
              title="Fitur Notifikasi Otomatis Setiap Akhir Periode Pelaporan"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Notif Akhir Periode</span>
            </button>
          )}
        </div>
      </div>

      {/* Explicit UI Message */}
      {isExportDisabled && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-4 rounded-2xl flex items-center gap-2 print:hidden shadow-sm">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          No data found for the selected period. Silakan ubah filter periode atau pastikan ada pejuang yang mengisi laporan.
        </div>
      )}
      {exportError && !isExportDisabled && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-4 rounded-2xl flex items-center gap-2 print:hidden shadow-sm">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          {exportError}
        </div>
      )}

      {/* GRAPH SUMMARY FOR SELECTED PEJUANG */}
      {/* LAPORAN REKAP SEMUA PEJUANG */}
      {(reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && rekapData.length > 0 && (
        <div id="laporan-rekap-container" className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Rekapitulasi Kinerja Seluruh Pejuang</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {reportType === "bulan" && `Bulan: ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`}
                {reportType === "pekan" && `Pekan: ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`}
                {reportType === "rentang" && `Rentang: ${startDate} s/d ${endDate}`}
              </p>
            </div>
          </div>
          
          {/* TOP 3 PEJUANG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {rekapData.slice(0, 3).map((d, i) => (
              <div key={i} className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden flex flex-col items-center text-center
                ${i === 0 ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" : 
                  i === 1 ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 dark:border-slate-700" : 
                  "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"}`}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md text-white font-extrabold text-2xl" 
                     style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}>
                  #{i + 1}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{d.pejuang.nama}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{d.pejuang.subDivisi}</p>
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 w-full">
                  <span className="text-3xl font-extrabold" style={{ color: i === 0 ? '#b45309' : i === 1 ? '#475569' : '#92400e' }}>
                    {d.performa}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Top 5 Pejuang</h4>
                <div className="flex gap-2 print:hidden" data-html2canvas-ignore="true">
                  <AnimatedDownloadButton 
                    label="PDF" 
                    className="!text-[10px] !bg-rose-100 !text-rose-700 hover:!bg-rose-200" 
                    onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportSummaryToPDF(summaryData, reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` : 'Periode', 'Top 5 Pejuang Terbaik');
                  }} />
                  <AnimatedDownloadButton 
                    label="Excel" 
                    className="!text-[10px] !bg-emerald-100 !text-emerald-700 hover:!bg-emerald-200" 
                    onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportToExcel(summaryData, 'Top_5_Pejuang');
                  }} />
                </div>
              </div>
              <div className="h-72 w-full bg-white" id="rekap-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rekapData.slice(0, 5).map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                    <Tooltip 
                      cursor={{ fill: "#f1f5f9" }} 
                      contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                      formatter={(value: number, name: string) => [name === 'Performa' ? `${value}%` : value, name]} 
                    />
                    <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                    <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                      {rekapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.performa >= weeklyTarget ? "#10b981" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Rata-Rata Performa Sub-Divisi</h4>
              <div className="h-72 w-full bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subdivisiAverages} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} formatter={(value) => [`${value}%`, 'Rata-rata']} />
                    <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" />
                    <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                      {subdivisiAverages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.Performa >= weeklyTarget ? "#3b82f6" : "#f59e0b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold text-center">
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Peringkat</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2 text-left">Nama</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2 text-left">Sub Divisi</th>
                  {reportType === "bulan" && (
                    <>
                      <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 1</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 2</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 3</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 4</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 5</th>
                    </>
                  )}
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Rata-Rata</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Evaluasi</th>
                  
                </tr>
              </thead>
              <tbody>
                {rekapData.map((d, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-800 text-center" : "bg-slate-50 dark:bg-slate-700/50 text-center"}>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-slate-700 dark:text-slate-300">#{idx + 1}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-medium text-slate-800 dark:text-slate-200 text-left">
                      {d.pejuang.nama}
                      {d.submissionsCount < d.expectedCount && (
                        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${d.submissionsCount < 3 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`} title={`Hanya mengisi ${d.submissionsCount} dari ${d.expectedCount} pekan yang dinilai`}>
                          {d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'} ({d.submissionsCount}/{d.expectedCount})
                        </span>
                      )}
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 text-left">{d.pejuang.subDivisi}</td>
                    {reportType === "bulan" && (
                      <>
                        <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w1 !== "-" ? `${d.w1}%` : "-"}</td>
                        <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w2 !== "-" ? `${d.w2}%` : "-"}</td>
                        <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w3 !== "-" ? `${d.w3}%` : "-"}</td>
                        <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w4 !== "-" ? `${d.w4}%` : "-"}</td>
                        <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w5 !== "-" ? `${d.w5}%` : "-"}</td>
                      </>
                    )}
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-emerald-700">{d.performa}%</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{d.evaluasi}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* LAPORAN DIVISI */}
      {reportType === "divisi" && (
        <div id="laporan-divisi-container" className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Laporan Divisi: {selectedDivisi}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}</p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden" data-html2canvas-ignore="true">
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama + (d.submissionsCount < d.expectedCount ? ` (${d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${d.submissionsCount}/${d.expectedCount})` : ""),
                    "Sub Divisi": d.pejuang.subDivisi,
                    W1: d.w1, W2: d.w2, W3: d.w3, W4: d.w4, W5: d.w5,
                    "Persentase (%)": d.performa,
                    Evaluasi: d.evaluasi
                  }));
                  setPreviewTitle(`Preview Laporan Divisi ${selectedDivisi} (PDF)`);
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportSummaryToPDF(summaryData, `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`, `${translateText("Laporan Divisi")} ${translateText(selectedDivisi)}`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama + (d.submissionsCount < d.expectedCount ? ` (${d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${d.submissionsCount}/${d.expectedCount})` : ""),
                    SubDivisi: d.pejuang.subDivisi,
                    Pekan1: d.w1, Pekan2: d.w2, Pekan3: d.w3, Pekan4: d.w4, Pekan5: d.w5,
                    Performa: d.performa, Evaluasi: d.evaluasi
                  }));
                  setPreviewTitle(`Preview Laporan Divisi ${selectedDivisi} (Excel)`);
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportToExcel(summaryData, `${translateText("Laporan_Divisi")}_${translateText(selectedDivisi).replace(/ /g,"_")}`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Excel</span>
              </button>
            </div>
          </div>
          
          
          
          {/* TOP 3 PEJUANG DIVISI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {divisiData.slice(0, 3).map((d, i) => (
              <div key={i} className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden flex flex-col items-center text-center
                ${i === 0 ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" : 
                  i === 1 ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 dark:border-slate-700" : 
                  "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"}`}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md text-white font-extrabold text-2xl" 
                     style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}>
                  #{i + 1}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{d.pejuang.nama}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{d.pejuang.subDivisi}</p>
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 w-full">
                  <span className="text-3xl font-extrabold" style={{ color: i === 0 ? '#b45309' : i === 1 ? '#475569' : '#92400e' }}>
                    {d.performa}%
                  </span>
                </div>
              </div>
            ))}
          </div>
            {divisiData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Grafik Peringkat 1, 2, 3 Performa</h4>
                <div className="h-72 w-full bg-white" id="divisi-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top3DivisiData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                      <Tooltip 
                        cursor={{ fill: "#f1f5f9" }} 
                        contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                        formatter={(value: number, name: string) => [name === 'Performa' ? `${value}%` : value, name]} 
                      />
                      <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                      <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                        {divisiData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.performa >= weeklyTarget ? "#10b981" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Tren Performa 3 Bulan Terakhir</h4>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend3BulanDivisiData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                        formatter={(value: number) => [`${value}%`, 'Rata-Rata Divisi']} 
                      />
                      <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                      <Line type="monotone" dataKey="RataRata" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold text-center">
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Peringkat</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2 text-left">Nama</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 1</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 2</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 3</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 4</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Pekan 5</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Rata-Rata</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2">Evaluasi</th>
                  
                </tr>
              </thead>
              <tbody>
                {divisiData.map((d, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-800 text-center" : "bg-slate-50 dark:bg-slate-700/50 text-center"}>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-slate-700 dark:text-slate-300">#{idx + 1}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-medium text-slate-800 dark:text-slate-200 text-left">
                      {d.pejuang.nama}
                      {d.submissionsCount < d.expectedCount && (
                        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${d.submissionsCount < 3 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`} title={`Hanya mengisi ${d.submissionsCount} dari ${d.expectedCount} pekan yang dinilai`}>
                          {d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'} ({d.submissionsCount}/{d.expectedCount})
                        </span>
                      )}
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w1 !== "-" ? `${d.w1}%` : "-"}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w2 !== "-" ? `${d.w2}%` : "-"}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w3 !== "-" ? `${d.w3}%` : "-"}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w4 !== "-" ? `${d.w4}%` : "-"}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2">{d.w5 !== "-" ? `${d.w5}%` : "-"}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold text-emerald-700">{d.performa}%</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{d.evaluasi}</td>
                    
                  </tr>
                ))}
                {divisiData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-slate-200 dark:border-slate-700 p-4 text-center text-slate-500 dark:text-slate-400">
                      Belum ada data anggota aktif di divisi ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "pejuang" && activePejuang && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pejuang Profile Card (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="text-center space-y-2">
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-3xl flex items-center justify-center mx-auto overflow-hidden border-4 border-emerald-300 shadow-md">
                {activePejuang.fotoUrl ? (
                  <img src={activePejuang.fotoUrl} alt={activePejuang.nama} className="w-full h-full object-cover" />
                ) : (
                  activePejuang.nama.charAt(0)
                )}
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{activePejuang.nama}</h3>
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200 inline-block">
                {activePejuang.subDivisi}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activePejuang.amanah}</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{`Performa Pekan ${selectedWeek}:`}</span>
                <span className="font-bold text-emerald-700">{targetSubmission ? `${targetSubmission.percentage}%` : 'Belum Terisi'}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Peringkat Divisi:</span>
                <span className="font-bold text-indigo-700">{rekapData.filter(d => d.pejuang.subDivisi === activePejuang.subDivisi).findIndex(d => d.pejuang.id === activePejuang.id) !== -1 ? `#${rekapData.filter(d => d.pejuang.subDivisi === activePejuang.subDivisi).findIndex(d => d.pejuang.id === activePejuang.id) + 1} dari ${rekapData.filter(d => d.pejuang.subDivisi === activePejuang.subDivisi).length}` : "-"}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Peringkat Keseluruhan:</span>
                <span className="font-bold text-blue-700">{rekapData.findIndex(d => d.pejuang.id === activePejuang.id) !== -1 ? `#${rekapData.findIndex(d => d.pejuang.id === activePejuang.id) + 1} dari ${rekapData.length}` : "-"}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Predikat:</span>
                <span className="font-bold text-amber-700">{targetSubmission ? `Predikat ${targetSubmission.percentage >= 91 ? "A" : targetSubmission.percentage >= 76 ? "B" : targetSubmission.percentage >= 40 ? "C" : "D"}` : '-'}</span>
              </div>
            </div>

            {(() => {
              const badges = calculateBadges(submissions, activePejuang.id);
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
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 text-center">Penghargaan (Badges)</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {badges.map((badge, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}
                        title={badge.description}
                      >
                        {getIcon(badge.icon)}
                        {badge.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>


          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 mt-6 lg:mt-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Grafik Perkembangan Performa (Bulan Ini)
            </h3>
            <div id="pejuang-monthly-trend-chart" className="h-56 w-full pt-2 bg-white flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-56">
                <h4 className="text-xs font-bold text-center text-slate-500 mb-2">Performa Mingguan (Bulan Ini)</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pejuangTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Performa" stroke="#047857" strokeWidth={3} dot={{ r: 4, fill: "#047857" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 h-56">
                <h4 className="text-xs font-bold text-center text-slate-500 mb-2">Tren Performa 6 Bulan Terakhir</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pejuang6MonthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Performa" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: "#0ea5e9" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity Category Graph (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Grafik Kegiatan per Kategori ({activePejuang.nama})
            </h3>

            {categoryData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                Belum ada data kegiatan terisi untuk pekan ini.
              </div>
            ) : (
              <div id="category-chart-container" className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="Ceklis" fill="#047857" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      )}

      {/* COACHING HISTORY SECTION */}
      {reportType === "pejuang" && activePejuang && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs mb-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-emerald-600" />
            Histori Coaching & Evaluasi ({activePejuang.nama})
          </h3>
          {coachingHistory.filter(n => n.pejuangId === activePejuang.id).length === 0 ? (
            <div className="text-center p-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-sm">Belum ada riwayat coaching untuk pejuang ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coachingHistory.filter(n => n.pejuangId === activePejuang.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(notif => (
                <div key={notif.id} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{notif.title}</h4>
                    <span className="text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded font-medium">
                      {new Date(notif.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    <ReactMarkdown>{notif.message}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OFFICIAL LETTERHEAD PRINTABLE PAPER SHEET */}
      <div className="bg-slate-200 p-4 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-600 shadow-inner flex justify-center overflow-x-auto">
        
        <div
          id="official-print-paper"
          ref={printAreaRef}
          className="bg-white dark:bg-slate-800 w-[210mm] min-h-[297mm] p-8 shadow-xl border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-sans relative text-xs"
        >
          {/* Header Al-Bahjah */}
          <div className="text-center space-y-1 border-b-2 border-emerald-800 pb-3 mb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img src={appLogo} alt="Logo Al-Bahjah" className="w-20 h-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div>
                <h1 className="text-lg font-black text-emerald-800 tracking-wide uppercase">
                  YAYASAN AL-BAHJAH CABANG CIREBON 1
                </h1>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase">
                  PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1
                </h2>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400">
              NOMOR STATISTIK PESANTREN (NSP): 510032090039
            </p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400">
              Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611
            </p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400">
              Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id
            </p>
          </div>

          {/* Document Title */}
          <div className="text-center my-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              FORM CHECKLIST PENGURUS KEPONDOKAN AL BAHJAH CABANG 1
            </h3>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-2 gap-4 my-4 font-semibold text-xs border-y border-slate-200 dark:border-slate-700 py-3">
            <div className="space-y-1">
              <p><span className="w-20 inline-block font-bold">NAMA</span>: {activePejuang?.nama || 'Muhammad Rosyad, S.Pd'}</p>
              <p><span className="w-20 inline-block font-bold">AMANAH</span>: {activePejuang?.amanah || 'Kepala Pondok Cabang Cirebon 1'}</p>
              <p><span className="w-20 inline-block font-bold">SUB DIVISI</span>: {activePejuang?.subDivisi || 'Kepondokan'}</p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="font-bold">PERIODE:</span> {reportType === "bulan" ? `Sebulan Penuh (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})` : `Pekan ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`}</p>
              <p><span className="font-bold">PERFORMA:</span> <span className="text-emerald-800 font-extrabold">{targetSubmission ? `${targetSubmission.percentage}%` : '0%'}</span></p>
              {reportType === "bulan" && targetSubmission && (
                <p><span className="font-bold">KEAKTIFAN:</span> <span className={`${targetSubmission.submissionsCount < targetSubmission.expectedCount ? 'text-rose-600' : 'text-emerald-700'} font-bold`}>{targetSubmission.submissionsCount} dari {targetSubmission.expectedCount} Pekan Terisi</span></p>
              )}
              <p><span className="font-bold">STATUS:</span> <span className="uppercase text-emerald-700 font-bold">TERVALIDASI</span></p>
            </div>
          </div>

          {/* Checklist Table */}
          <div className="my-6">
            <table className="w-full text-left text-[10px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold text-center">
                  <th className="border border-slate-400 p-1 w-6">No</th>
                  <th className="border border-slate-400 p-1 w-20">Waktu</th>
                  <th className="border border-slate-400 p-1">Uraian Tugas/Kegiatan</th>
                  <th className="border border-slate-400 p-1 w-24">Ceklis</th>
                  <th className="border border-slate-400 p-1 w-10">Kat</th>
                  <th className="border border-slate-400 p-1 w-32">Catatan/Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {targetSubmission ? (
                  targetSubmission.tasks.map((task, idx) => {
                    const checksCount = targetSubmission.dates.filter(d => task.realisasiChecks?.[d]).length;
                    return (
                      <tr key={idx} className="border-b border-slate-300 dark:border-slate-600">
                        <td className="border border-slate-300 dark:border-slate-600 p-1 text-center font-bold">{task.no}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-1 text-center">{task.waktu}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-1 font-medium">{task.uraian}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-1 text-center font-bold text-emerald-800">
                          <div className="flex items-center justify-center gap-0.5 flex-wrap">
                            {targetSubmission.dates.map(d => {
                              const isRencana = task.rencanaChecks?.[d];
                              const isRealisasi = task.realisasiChecks?.[d];
                              if (!isRencana) return <span key={d} className="w-3 h-3 text-[8px] text-slate-300 flex items-center justify-center">-</span>;
                              return isRealisasi 
                                ? <CheckCircle2 key={d} className="w-3 h-3 text-emerald-600" />
                                : <XCircle key={d} className="w-3 h-3 text-rose-500" />;
                            })}
                          </div>
                        </td>
                        <td className="border border-slate-300 dark:border-slate-600 p-1 text-center font-bold">{task.kategori}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-1">{task.catatan || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      Belum ada data checklist terisi pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures at Bottom */}
          <div className="mt-16 pt-8 flex justify-between items-end font-semibold text-xs text-slate-800 dark:text-slate-200">
            <div className="text-center space-y-12">
              <p>Ketua Al-Bahjah<br />Cabang Cirebon 1</p>
              <p className="font-extrabold underline">Gunawan, M.Pd</p>
            </div>

            <div className="text-center space-y-12">
              <p>Kepala Pondok / Pejuang</p>
              <p className="font-extrabold underline">{activePejuang?.nama || 'Muhammad Rosyad, S.Pd'}</p>
            </div>
          </div>

        </div>

      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">{previewTitle}</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    {previewData.length > 0 && Object.keys(previewData[0]).map((k, idx) => (
                      <th key={idx} className="border border-slate-300 dark:border-slate-600 p-2 font-bold whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-700/50"}>
                      {Object.values(row).map((val: any, jdx) => (
                        <td key={jdx} className="border border-slate-200 dark:border-slate-700 p-2">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length === 0 && (
                <div className="text-center p-4 text-slate-500 dark:text-slate-400">Tidak ada data untuk ditampilkan.</div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 bg-slate-50 dark:bg-slate-700/50">
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs">Tutup</button>
              <button onClick={previewAction} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-2">
                <Download className="w-4 h-4" /> Konfirmasi Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertData && (
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          pejuangName={selectedCertData.name}
          divisi={selectedCertData.divisi}
          bulan={selectedMonth}
          tahun={selectedYear}
          performa={selectedCertData.performa}
        />
      )}
    </div>
  );
};
