import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# 1. Add import
content = content.replace("exportFormToPDF, exportRekapToPDF, exportToExcel", "exportFormToPDF, exportRekapToPDF, exportMonthlyPejuangToPDF, exportToExcel")

# 2. Add handleExportBulanPejuangPDF
target_func = """  const handleExportPDF = async () => {"""

new_func = """  const handleExportBulanPejuangPDF = async () => {
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
      const chartEl = document.getElementById("category-chart-container");
      if (chartEl) {
        try {
          chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });
        } catch(e) {
          console.error("Failed to capture chart", e);
        }
      }
      
      const periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;
      const periodDocs: string[] = [];
      monthSubmissions.forEach(s => {
         if (s.dokumenUrls) {
            periodDocs.push(...s.dokumenUrls);
         }
      });
      
      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, periodDocs);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };

  const handleExportPDF = async () => {"""

content = content.replace(target_func, new_func)

# 3. Add button in UI for export Bulanan Pejuang
# Let's find where the buttons for reportType === "bulan" are.
ui_target = """          {(reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && (
            <>
              <button
                disabled={isExportDisabled}
                onClick={() => window.print()}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Summary</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={() => window.print()}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Summary</span>
              </button>"""

# Fix duplicated print summary and add new button if selectedPejuangId
ui_replacement = """          {(reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && (
            <>
              <button
                disabled={isExportDisabled}
                onClick={() => window.print()}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Summary</span>
              </button>
              {reportType === "bulan" && selectedPejuangId && (
                 <button
                   onClick={handleExportBulanPejuangPDF}
                   data-html2canvas-ignore="true" 
                   className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
                 >
                   <FileText className="w-4 h-4" />
                   <span>Unduh Bulanan Pejuang</span>
                 </button>
              )}"""

content = content.replace(ui_target, ui_replacement)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
