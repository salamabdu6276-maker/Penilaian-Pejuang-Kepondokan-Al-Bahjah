const fs = require('fs');
let content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');

// Replace "Kategori Utama:" with "Predikat:"
content = content.replace('<span>Kategori Utama:</span>', '<span>Predikat:</span>');

// Replace \`Kategori \${targetSubmission.kategoriTertinggi}\` with predikat
const oldKategori = '`Kategori ${targetSubmission.kategoriTertinggi}`';
const newPredikat = '`Predikat ${targetSubmission.percentage >= 91 ? "A" : targetSubmission.percentage >= 76 ? "B" : targetSubmission.percentage >= 40 ? "C" : "D"}`';
content = content.replace(oldKategori, newPredikat);

// Also change "Performa Pekan {selectedWeek}:" to "Performa:" 
// Because if it is bulan, it's not pekan!
content = content.replace(
  '<span>Performa Pekan {selectedWeek}:</span>',
  '<span>{reportType === "bulan" ? "Performa Bulanan:" : `Performa Pekan ${selectedWeek}:`}</span>'
);

fs.writeFileSync('src/components/ReportsView.tsx', content);

let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
dashboard = dashboard.replace(/s\.percentage >= 75 \? 'B'/g, "s.percentage >= 76 ? 'B'");
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

let exportTs = fs.readFileSync('src/utils/export.ts', 'utf-8');
exportTs = exportTs.replace(/submission\.percentage >= 75\) predikat = "B"/g, 'submission.percentage >= 76) predikat = "B"');
fs.writeFileSync('src/utils/export.ts', exportTs);
