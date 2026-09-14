import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target = """  const handleExportExcel = () => {
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
  };"""

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
  };"""

content = content.replace(target, replace)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
