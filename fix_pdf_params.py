import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

old_code = """      const periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`;
      const pejuangBadges = calculateBadges(monthSubmissions, pejuang.id);
      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, dokumenUrls, pejuangBadges);"""

new_code = """      const periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`;
      const pejuangBadges = calculateBadges(monthSubmissions, pejuang.id);
      
      const pKeseluruhanIdx = rekapData.findIndex(d => d.pejuang.id === pejuang.id);
      const peringkatKeseluruhan = pKeseluruhanIdx !== -1 ? `#${pKeseluruhanIdx + 1} dari ${rekapData.length}` : "-";
      
      const divisiDataList = rekapData.filter(d => d.pejuang.subDivisi === pejuang.subDivisi);
      const pDivisiIdx = divisiDataList.findIndex(d => d.pejuang.id === pejuang.id);
      const peringkatDivisi = pDivisiIdx !== -1 ? `#${pDivisiIdx + 1} dari ${divisiDataList.length}` : "-";
      
      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, dokumenUrls, pejuangBadges, peringkatKeseluruhan, peringkatDivisi);"""

content = content.replace(old_code, new_code)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
