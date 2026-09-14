import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target_pdf = """  const handleExportPDF = async () => {
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
  };"""

replacement_pdf = """  const handleExportPDF = async () => {
    if (isExportDisabled) {
      setExportError("No data found for the selected period");
      return;
    }
    setExportError("");
    
    if (reportType === "pejuang" && targetSubmission) {
      setPreviewTitle("Preview Laporan Checklist (PDF)");
      const previewRows = targetSubmission.tasks.map((t, idx) => ({
        No: idx + 1,
        UraianKegiatan: t.uraian,
        TotalCheck: targetSubmission.dates.filter(d => t.realisasiChecks?.[d]).length
      }));
      setPreviewData(previewRows);
      setPreviewAction(() => async () => {
        setToastMsg("Mempersiapkan PDF Laporan Pejuang...");
        setTimeout(() => setToastMsg(null), 3000);
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
    } else if ((reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && rekapData.length > 0) {
      setPreviewTitle("Preview Rekapitulasi (PDF)");
      const previewRows = rekapData.map((d, idx) => ({
        Peringkat: idx + 1,
        NamaPejuang: d.pejuang.nama,
        SubDivisi: d.pejuang.subDivisi,
        Amanah: d.pejuang.amanah,
        FormDisubmit: d.submissionsCount,
        PerformaRataRata: `${d.performa}%`
      }));
      setPreviewData(previewRows);
      setPreviewAction(() => async () => {
        setToastMsg("Mempersiapkan PDF Consolidated Report...");
        setTimeout(() => setToastMsg(null), 3000);
        
        const periodStr = reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` :
                          reportType === 'pekan' ? `Pekan ${selectedWeek} ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` :
                          `${dateRange.start} s/d ${dateRange.end}`;
        
        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN");
        setShowPreviewModal(false);
      });
      setShowPreviewModal(true);
    }
  };"""

if "exportRekapToPDF" not in content:
    content = content.replace("exportFormToPDF", "exportFormToPDF, exportRekapToPDF")

if "setToastMsg" not in content:
    # Add toast state
    state_target = "  const [showPreviewModal, setShowPreviewModal] = useState(false);"
    state_replacement = state_target + "\n  const [toastMsg, setToastMsg] = useState<string | null>(null);"
    content = content.replace(state_target, state_replacement)
    
    # Add toast UI
    ui_target = '    <div id="reports-view" className="space-y-6 pb-12">'
    ui_replacement = ui_target + """
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}"""
    content = content.replace(ui_target, ui_replacement)
    
    # Add toast trigger to Excel and CSV
    # Excel:
    content = re.sub(r'(exportToExcel\(exportRows,.*?fileName\);)', r'setToastMsg("Menyiapkan dokumen Excel...");\n      setTimeout(() => setToastMsg(null), 3000);\n      \1', content)
    # CSV:
    content = re.sub(r'(exportToCSV\(exportRows,.*?fileName\);)', r'setToastMsg("Menyiapkan dokumen CSV...");\n      setTimeout(() => setToastMsg(null), 3000);\n      \1', content)

content = content.replace(target_pdf, replacement_pdf)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

