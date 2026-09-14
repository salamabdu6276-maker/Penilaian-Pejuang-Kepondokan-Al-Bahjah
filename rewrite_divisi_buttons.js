import fs from 'fs';

let content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');

const divisiPdfRegex = /<button[\s\S]*?Unduh PDF[\s\S]*?<\/button>/;
const divisiPdfMatch = content.match(divisiPdfRegex);

if (divisiPdfMatch) {
  const replacement = `
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,
                    "Sub Divisi": d.pejuang.subDivisi,
                    W1: d.w1, W2: d.w2, W3: d.w3, W4: d.w4, W5: d.w5,
                    "Persentase (%)": d.performa,
                    Evaluasi: d.evaluasi
                  }));
                  
                  setPreviewTitle(\`Preview Laporan Divisi \${selectedDivisi} (PDF)\`);
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportSummaryToPDF(summaryData, \`\${GREGORIAN_MONTHS_ID[selectedMonth - 1]} \${selectedYear}\`, \`Laporan Divisi \${selectedDivisi}\`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={\`\${isExportDisabled ? "opacity-50 cursor-not-allowed" : ""} flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors\`}
              >
                <FileText className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>`;
  content = content.replace(divisiPdfRegex, replacement);
}

const divisiExcelRegex = /<button[\s\S]*?Unduh Excel[\s\S]*?<\/button>/;
const divisiExcelMatch = content.match(divisiExcelRegex);

if (divisiExcelMatch) {
  const replacement = `
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,
                    SubDivisi: d.pejuang.subDivisi,
                    Pekan1: d.w1, Pekan2: d.w2, Pekan3: d.w3, Pekan4: d.w4, Pekan5: d.w5,
                    Performa: d.performa, Evaluasi: d.evaluasi
                  }));
                  
                  setPreviewTitle(\`Preview Laporan Divisi \${selectedDivisi} (Excel)\`);
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportToExcel(summaryData, \`Laporan_Divisi_\${selectedDivisi.replace(/ /g,"_")}\`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={\`\${isExportDisabled ? "opacity-50 cursor-not-allowed" : ""} flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors\`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Excel</span>
              </button>`;
  content = content.replace(divisiExcelRegex, replacement);
}

fs.writeFileSync('src/components/ReportsView.tsx', content);
