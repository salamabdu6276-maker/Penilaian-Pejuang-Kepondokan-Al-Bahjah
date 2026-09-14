const fs = require('fs');
let code = fs.readFileSync('src/components/ReportsView.tsx', 'utf8');

code = code.replace(
`      const periodDocs: string[] = [];
      monthSubmissions.forEach(s => {
         if (s.dokumenUrls) {
            periodDocs.push(...s.dokumenUrls);
         }
      });
      
      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, periodDocs);`,
`      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, dokumenUrls);`
);
fs.writeFileSync('src/components/ReportsView.tsx', code);
console.log('done');
