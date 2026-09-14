import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target_excel_hook = """    setPreviewAction(() => () => {
      exportToExcel(exportRows, fileName);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };"""

csv_hook = """
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
      fileName = `Checklist_${targetSubmission.pejuangNama}_Pekan${selectedWeek}`;
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
      fileName = `Rekapitulasi_Kinerja_${reportType === 'bulan' ? 'Bulanan' : reportType === 'pekan' ? 'Mingguan' : 'Rentang'}_${selectedMonth}_${selectedYear}`;
    }

    setPreviewData(exportRows);
    setPreviewAction(() => () => {
      exportToCSV(exportRows, fileName);
      setShowPreviewModal(false);
    });
    setShowPreviewModal(true);
  };
"""

content = content.replace(target_excel_hook, target_excel_hook + csv_hook)

target_btn = """              <button
                disabled={isExportDisabled}
                onClick={handleExportExcel}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>"""

csv_btn = """              <button
                disabled={isExportDisabled}
                onClick={handleExportCSV}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>"""

content = content.replace(target_btn, target_btn + "\n" + csv_btn)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
