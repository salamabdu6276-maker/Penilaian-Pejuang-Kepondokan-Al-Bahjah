import fs from 'fs';

let content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');

// For rekap excel
const rekapExcelRegex = /<button[\s\S]*?Unduh Rekap Semua Pejuang \(Excel\)[\s\S]*?<\/button>/;
const rekapExcelMatch = content.match(rekapExcelRegex);

if (rekapExcelMatch) {
  const replacement = `
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
                    
                    filteredSubs.forEach(sub => {
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";

                    return {
                      No: idx + 1,
                      Nama: p.nama,
                      "Sub Divisi": p.subDivisi,
                      Amanah: p.amanah,
                      "Total Target (Item)": totalPossible,
                      "Total Realisasi (Item)": totalChecked,
                      "Persentase (%)": percentage,
                      Predikat: percentage > 0 ? predikat : "-"
                    };
                  }).filter(Boolean);

                  let periodStr = "";
                  if (reportType === "bulan") periodStr = \`\${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_\${selectedYear}\`;
                  else if (reportType === "pekan") periodStr = \`Pekan_\${selectedWeek}_\${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_\${selectedYear}\`;
                  else if (reportType === "rentang") periodStr = \`\${startDate}_sd_\${endDate}\`;

                  setPreviewTitle("Preview Rekap Semua Pejuang (Excel)");
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportToExcel(summaryData, \`Rekap_Semua_Pejuang_\${periodStr}\`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={\`\${isExportDisabled ? "opacity-50 cursor-not-allowed" : ""} flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors\`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Rekap Semua Pejuang (Excel)</span>
              </button>`;
  content = content.replace(rekapExcelRegex, replacement);
}

// For rekap PDF
const rekapPdfRegex = /<button[\s\S]*?Unduh Rekap Semua Pejuang \(PDF\)[\s\S]*?<\/button>/;
const rekapPdfMatch = content.match(rekapPdfRegex);

if (rekapPdfMatch) {
  const replacement = `
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
                    
                    filteredSubs.forEach(sub => {
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const evaluasi = percentage >= 91 ? "Sangat Baik" : percentage >= 76 ? "Baik" : percentage >= 40 ? "Cukup" : "Kurang";

                    return {
                      No: idx + 1,
                      Nama: p.nama,
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
                  if (reportType === "bulan") periodStr = \`\${GREGORIAN_MONTHS_ID[selectedMonth - 1]} \${selectedYear}\`;
                  else if (reportType === "pekan") periodStr = \`Pekan \${selectedWeek} (\${GREGORIAN_MONTHS_ID[selectedMonth - 1]} \${selectedYear})\`;
                  else if (reportType === "rentang") periodStr = \`\${startDate} s/d \${endDate}\`;

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
                data-html2canvas-ignore="true" className={\`\${isExportDisabled ? "opacity-50 cursor-not-allowed" : ""} flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors\`}
              >
                <FileText className="w-4 h-4" />
                <span>Unduh Rekap Semua Pejuang (PDF)</span>
              </button>`;
  content = content.replace(rekapPdfRegex, replacement);
}

fs.writeFileSync('src/components/ReportsView.tsx', content);
