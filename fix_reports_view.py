import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

replacements = {
    'const periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;': 'const periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`;',
    'if (reportType === "bulan") periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`;': 'if (reportType === "bulan") periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])}_${selectedYear}`;',
    'else if (reportType === "pekan") periodStr = `Pekan_${selectedWeek}_${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`;': 'else if (reportType === "pekan") periodStr = `${translateText("Pekan")}_${selectedWeek}_${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])}_${selectedYear}`;',
    'if (reportType === "bulan") periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;': 'if (reportType === "bulan") periodStr = `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`;',
    'else if (reportType === "pekan") periodStr = `Pekan ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`;': 'else if (reportType === "pekan") periodStr = `${translateText("Pekan")} ${selectedWeek} (${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear})`;',
    'else if (reportType === "rentang") periodStr = `${startDate} s/d ${endDate}`;': 'else if (reportType === "rentang") periodStr = `${startDate} ${translateText("s/d")} ${endDate}`;',
    'else if (reportType === "rentang") periodStr = `${startDate}_sd_${endDate}`;': 'else if (reportType === "rentang") periodStr = `${startDate}_${translateText("sd")}_${endDate}`;',
    'exportSummaryToPDF(summaryData, `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`, `Laporan Divisi ${selectedDivisi}`);': 'exportSummaryToPDF(summaryData, `${translateText(GREGORIAN_MONTHS_ID[selectedMonth - 1])} ${selectedYear}`, `${translateText("Laporan Divisi")} ${translateText(selectedDivisi)}`);',
    '`Rekap Semua Pejuang - ${periodStr}`': '`${translateText("Rekap Semua Pejuang")} - ${periodStr}`',
    '`Rekap_Semua_Pejuang_${periodStr}`': '`${translateText("Rekap Semua Pejuang")}_${periodStr}`',
    '`Laporan_Divisi_${selectedDivisi.replace(/ /g,"_")}`': '`${translateText("Laporan_Divisi")}_${translateText(selectedDivisi).replace(/ /g,"_")}`',
    'exportElementToImage("official-print-paper", `Laporan_Checklist_${activePejuang?.nama || \'Pejuang\'}`);': 'exportElementToImage("official-print-paper", `${translateText("Laporan_Checklist")}_${translateText(activePejuang?.nama || \'Pejuang\')}`);',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
