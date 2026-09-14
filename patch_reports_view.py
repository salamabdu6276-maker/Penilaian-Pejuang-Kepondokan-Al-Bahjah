import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { exportFormToPDF", "import { fetchSholatAttendances } from '../services/dbService';\nimport { exportFormToPDF")
content = content.replace("await exportFormToPDF(targetSubmission, activePejuang, submissions, chartBase64, dokumenUrls);", 
"""
      let sholatData = [];
      try {
        const allSholat = await fetchSholatAttendances();
        // filter by pejuangId and date range (within submission.dates)
        if (targetSubmission && targetSubmission.pejuangId) {
            sholatData = allSholat.filter(s => s.pejuangId === targetSubmission.pejuangId && targetSubmission.dates.some(d => s.date.endsWith(String(d).padStart(2, '0'))));
        }
      } catch(e) {}
      await exportFormToPDF(targetSubmission, activePejuang, submissions, chartBase64, dokumenUrls, sholatData);
""")

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

