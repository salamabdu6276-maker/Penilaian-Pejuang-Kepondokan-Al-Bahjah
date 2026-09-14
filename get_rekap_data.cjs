const fs = require('fs');
const content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');
const excelLogic = content.substring(content.indexOf('const summaryData = pejuangList.map'), content.indexOf('exportToExcel(summaryData, `Rekap_Semua_Pejuang_${periodStr}`);'));
console.log("EXCEL LOGIC:\n", excelLogic);
