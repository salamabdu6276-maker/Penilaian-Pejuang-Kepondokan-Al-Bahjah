import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target = re.search(r'  const handleExportExcel = \(\) => \{.*?  \};\n\n  // Trigger End of Period Notification', content, re.DOTALL)

if target:
    replace = """  const handleExportExcel = () => {
    if (isExportDisabled) {
      setExportError("No data found for the selected period");
      return;
    }
    setExportError("");

    setPreviewTitle("Preview Laporan (Excel)");
    
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
      exportToExcel(exportRows, fileName);
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

  // Trigger End of Period Notification"""
    
    content = content.replace(target.group(0), replace)

target_btn = re.search(r'              <button\n                disabled={isExportDisabled}\n                onClick={handleExportExcel}.*?              </button>', content, re.DOTALL)

if target_btn and 'handleExportCSV' not in target_btn.group(0) and 'handleExportCSV' not in content[target_btn.end():target_btn.end()+200]:
    csv_btn = """              <button
                disabled={isExportDisabled}
                onClick={handleExportCSV}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>"""
    content = content.replace(target_btn.group(0), target_btn.group(0) + "\n" + csv_btn)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
