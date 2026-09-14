import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add IDs to the chart containers so they can be snapshotted
content = content.replace('<div className="h-72 w-full">', '<div className="h-72 w-full bg-white" id="rekap-chart-container">', 1)
content = content.replace('<div className="h-72 w-full">', '<div className="h-72 w-full bg-white" id="divisi-chart-container">', 1)

# Now fix the handleExportPDF for all three modes: pejuang, divisi, (bulan/pekan/rentang)
target = """    } else if ((reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && rekapData.length > 0) {
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
        setToastMsg("Mempersiapkan PDF Laporan Konsolidasi...");
        setTimeout(() => setToastMsg(null), 3000);
        
        const periodStr = reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` :
                          reportType === 'pekan' ? `Pekan ${selectedWeek} ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` :
                          `${dateRange.start} s/d ${dateRange.end}`;
        
        let chartBase64;
        const chartEl = document.getElementById("rekap-chart-container");
        if (chartEl) {
          try {
            chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });
          } catch(e) {
            console.error("Failed to capture chart", e);
          }
        }
        
        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN", chartBase64, dokumenUrls);
        setShowPreviewModal(false);
      });
      setShowPreviewModal(true);
    }
  };"""

replacement = """    } else if (reportType === "divisi" && divisiData.length > 0) {
      setPreviewTitle(`Preview Laporan Divisi ${selectedSubDivisi} (PDF)`);
      const previewRows = divisiData.map((d, idx) => ({
        Peringkat: idx + 1,
        NamaPejuang: d.pejuang.nama,
        Amanah: d.pejuang.amanah,
        FormDisubmit: d.submissionsCount,
        PerformaRataRata: `${d.performa}%`
      }));
      setPreviewData(previewRows);
      setPreviewAction(() => async () => {
        setToastMsg("Mempersiapkan PDF Laporan Divisi...");
        setTimeout(() => setToastMsg(null), 3000);
        
        const periodStr = `DIVISI ${selectedSubDivisi.toUpperCase()} - ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;
        
        let chartBase64;
        const chartEl = document.getElementById("divisi-chart-container");
        if (chartEl) {
          try {
            chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });
          } catch(e) {
            console.error("Failed to capture chart", e);
          }
        }
        
        // Collect all documents for this division's submissions
        const divDocs: string[] = [];
        submissions
          .filter(s => s.bulan === selectedMonth && s.tahun === selectedYear && s.subDivisi === selectedSubDivisi)
          .forEach(s => {
             if (s.dokumenUrls) {
                divDocs.push(...s.dokumenUrls);
             }
          });
        
        await exportRekapToPDF(divisiData, periodStr, "LAPORAN PERFORMA KINERJA DIVISI", chartBase64, divDocs);
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
        setToastMsg("Mempersiapkan PDF Laporan Konsolidasi...");
        setTimeout(() => setToastMsg(null), 3000);
        
        const periodStr = reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` :
                          reportType === 'pekan' ? `Pekan ${selectedWeek} ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` :
                          `${dateRange.start} s/d ${dateRange.end}`;
        
        let chartBase64;
        const chartEl = document.getElementById("rekap-chart-container");
        if (chartEl) {
          try {
            chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });
          } catch(e) {
            console.error("Failed to capture chart", e);
          }
        }
        
        // Collect all documents for this period
        const periodDocs: string[] = [];
        submissions
          .filter(s => s.bulan === selectedMonth && s.tahun === selectedYear)
          .forEach(s => {
             if (s.dokumenUrls) {
                periodDocs.push(...s.dokumenUrls);
             }
          });
        
        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN", chartBase64, periodDocs);
        setShowPreviewModal(false);
      });
      setShowPreviewModal(true);
    }
  };"""

content = content.replace(target, replacement)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
