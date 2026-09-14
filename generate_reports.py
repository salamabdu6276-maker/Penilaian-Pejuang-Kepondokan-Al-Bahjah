import re

content = """import React, { useState, useRef } from "react";
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
import { GREGORIAN_MONTHS_ID } from "../utils/hijri";
import * as htmlToImage from "html-to-image";
import { SUB_DIVISI_LIST } from "../utils/defaultTasks";
import { exportFormToPDF, exportToExcel, exportToCSV, exportElementToImage, exportSummaryToPDF, exportElementToPDF } from "../utils/export";
import { fetchDocumentUploads } from "../services/dbService";
import { calculateBadges } from "../utils/badges";

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
  const [reportType, setReportType] = useState<"pejuang" | "divisi" | "bulan" | "rentang">("pejuang");
  const [selectedPejuangId, setSelectedPejuangId] = useState<string>("");
  const [selectedDivisi, setSelectedDivisi] = useState<string>("Kepondokan");
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Juni
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const weeklyTarget = Number(localStorage.getItem("weeklyTarget")) || 80;

  const printAreaRef = useRef<HTMLDivElement>(null);

  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string>("");
  const [previewAction, setPreviewAction] = useState<() => void>(() => {});
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewData, setPreviewData] = useState<any[]>([]);

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
      const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;

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
        percentage
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
  React.useEffect(() => {
    if (selectedPejuangId) {
      fetchDocumentUploads().then(docs => {
        const pejuangDocs = docs.filter(d => d.pejuangId === selectedPejuangId);
        if (pejuangDocs.length > 0) {
          const latest = pejuangDocs.sort((a, b) => new Date(b.waktuSetor || 0).getTime() - new Date(a.waktuSetor || 0).getTime())[0];
          const urls = [];
          if (latest.foto1) urls.push(latest.foto1);
          if (latest.foto2) urls.push(latest.foto2);
          if (latest.foto3) urls.push(latest.foto3);
          setDokumenUrls(urls);
        } else {
          setDokumenUrls([]);
        }
      });
    }
  }, [selectedPejuangId]);

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
      const performa = count > 0 ? Math.round(sBulan.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;
      
      return { 
         pejuang: p, 
         w1, w2, w3, w4, w5, 
         performa, 
         submissionsCount: count,
         evaluasi: performa >= 91 ? "A" : performa >= 76 ? "B" : performa >= 40 ? "C" : "D"
      };
    }).sort((a, b) => b.performa - a.performa);
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);

  const rekapData = React.useMemo(() => {
    if (reportType !== "bulan" && reportType !== "pekan" && reportType !== "rentang") return [];
    
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
      const performa = count > 0 ? Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;
      
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
          chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });
        } catch(e) {
          console.error("Failed to capture chart", e);
        }
      }
      await exportFormToPDF(targetSubmission, activePejuang, submissions, chartBase64, dokumenUrls);
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
        await exportElementToImage("official-print-paper", `Laporan_Checklist_${activePejuang?.nama || 'Pejuang'}`);
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
      exportToExcel(exportRows, `Checklist_${targetSubmission.pejuangNama}_Pekan${selectedWeek}`);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };
"""

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
