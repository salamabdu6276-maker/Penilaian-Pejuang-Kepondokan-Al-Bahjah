import fs from 'fs';

let content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');

// Replace handleExportPDF
content = content.replace(
  /const handleExportPDF = async \(\) => \{[\s\S]*?\};\n/,
  `const handleExportPDF = async () => {
    if (!targetSubmission) {
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
  };\n`
);

// Replace handleExportPNG
content = content.replace(
  /const handleExportPNG = async \(\) => \{[\s\S]*?\};\n/,
  `const handleExportPNG = async () => {
    if (!targetSubmission) {
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
        await exportElementToImage("official-print-paper", \`Laporan_Checklist_\${activePejuang?.nama || 'Pejuang'}\`);
      }
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };\n`
);

// Replace handleExportExcel
content = content.replace(
  /const handleExportExcel = \(\) => \{[\s\S]*?\};\n/,
  `const handleExportExcel = () => {
    if (!targetSubmission) {
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
      exportToExcel(exportRows, \`Checklist_\${targetSubmission.pejuangNama}_Pekan\${selectedWeek}\`);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };\n`
);

fs.writeFileSync('src/components/ReportsView.tsx', content);
