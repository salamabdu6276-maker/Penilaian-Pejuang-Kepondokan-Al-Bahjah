import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target1 = """  const [isExportDisabled, setIsExportDisabled] = React.useState(false);"""
replacement1 = """  const [isExportDisabled, setIsExportDisabled] = React.useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);"""
content = content.replace(target1, replacement1)

target2 = """      setPreviewAction(() => async () => {
        setToastMsg("Mempersiapkan PDF Laporan Pejuang...");"""
replacement2 = """      setPreviewAction(() => async () => {
        setIsGeneratingPDF(true);
        setToastMsg("Mempersiapkan PDF Laporan Pejuang...");"""
content = content.replace(target2, replacement2)

target2b = """        await exportFormToPDF(targetSubmission, activePejuang, submissions, chartBase64, dokumenUrls);
        setShowPreviewModal(false);
      });"""
replacement2b = """        await exportFormToPDF(targetSubmission, activePejuang, submissions, chartBase64, dokumenUrls);
        setIsGeneratingPDF(false);
        setShowPreviewModal(false);
      });"""
content = content.replace(target2b, replacement2b)

target3 = """      setPreviewAction(() => async () => {
        setToastMsg("Mempersiapkan PDF Laporan Divisi...");"""
replacement3 = """      setPreviewAction(() => async () => {
        setIsGeneratingPDF(true);
        setToastMsg("Mempersiapkan PDF Laporan Divisi, Mohon Tunggu...");"""
content = content.replace(target3, replacement3)

target3b = """        await exportRekapToPDF(divisiData, periodStr, "LAPORAN PERFORMA KINERJA DIVISI", chartBase64, divDocs);
        setShowPreviewModal(false);
      });"""
replacement3b = """        await exportRekapToPDF(divisiData, periodStr, "LAPORAN PERFORMA KINERJA DIVISI", chartBase64, divDocs);
        setIsGeneratingPDF(false);
        setShowPreviewModal(false);
      });"""
content = content.replace(target3b, replacement3b)

target4 = """      setPreviewAction(() => async () => {
        setToastMsg("Mempersiapkan PDF Laporan Konsolidasi...");"""
replacement4 = """      setPreviewAction(() => async () => {
        setIsGeneratingPDF(true);
        setToastMsg("Mempersiapkan PDF Batch Besar, Menggabungkan Dokumen...");"""
content = content.replace(target4, replacement4)

target4b = """        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN", chartBase64, periodDocs);
        setShowPreviewModal(false);
      });"""
replacement4b = """        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN", chartBase64, periodDocs);
        setIsGeneratingPDF(false);
        setShowPreviewModal(false);
      });"""
content = content.replace(target4b, replacement4b)

target5 = """      setPreviewAction(() => async () => {
      setToastMsg("Mempersiapkan PDF Bulanan Pejuang...");"""
replacement5 = """      setPreviewAction(() => async () => {
      setIsGeneratingPDF(true);
      setToastMsg("Mempersiapkan PDF Bulanan Pejuang, Memproses Lampiran...");"""
content = content.replace(target5, replacement5)

target5b = """      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, periodDocs);
      setShowPreviewModal(false);
    });"""
replacement5b = """      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, periodDocs);
      setIsGeneratingPDF(false);
      setShowPreviewModal(false);
    });"""
content = content.replace(target5b, replacement5b)

# Update buttons
target_btn1 = """              <button
                disabled={isExportDisabled}
                onClick={handleExportPDF}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Format PDF</span>
              </button>"""
replacement_btn1 = """              <button
                disabled={isExportDisabled || isGeneratingPDF}
                onClick={handleExportPDF}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled || isGeneratingPDF ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                {isGeneratingPDF ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>{isGeneratingPDF ? "Memproses PDF..." : "Format PDF"}</span>
              </button>"""
content = content.replace(target_btn1, replacement_btn1)

target_btn2 = """              <button
                disabled={isExportDisabled}
                onClick={handleExportPDF}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>PDF Konsolidasi</span>
              </button>"""
replacement_btn2 = """              <button
                disabled={isExportDisabled || isGeneratingPDF}
                onClick={handleExportPDF}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled || isGeneratingPDF ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                {isGeneratingPDF ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>{isGeneratingPDF ? "Memproses PDF..." : "PDF Konsolidasi"}</span>
              </button>"""
content = content.replace(target_btn2, replacement_btn2)

target_btn3 = """              {reportType === "bulan" && selectedPejuangId && (
                 <button
                   onClick={handleExportBulanPejuangPDF}
                   data-html2canvas-ignore="true" 
                   className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
                 >
                   <FileText className="w-4 h-4" />
                   <span>Unduh Bulanan Pejuang</span>
                 </button>
              )}"""
replacement_btn3 = """              {reportType === "bulan" && selectedPejuangId && (
                 <button
                   disabled={isGeneratingPDF}
                   onClick={handleExportBulanPejuangPDF}
                   data-html2canvas-ignore="true" 
                   className={`flex items-center space-x-1.5 ${isGeneratingPDF ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
                 >
                   {isGeneratingPDF ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <FileText className="w-4 h-4" />}
                   <span>{isGeneratingPDF ? "Memproses PDF..." : "Unduh Bulanan Pejuang"}</span>
                 </button>
              )}"""
content = content.replace(target_btn3, replacement_btn3)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
