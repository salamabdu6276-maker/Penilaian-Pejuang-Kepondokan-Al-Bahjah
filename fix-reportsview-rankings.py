import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add getWeeksInMonth import
if "getWeeksInMonth" not in content:
    content = content.replace('import { GREGORIAN_MONTHS_ID } from "../utils/hijri";', 'import { GREGORIAN_MONTHS_ID, getWeeksInMonth } from "../utils/hijri";')

# Divisi logic replacement
old_divisi = """      const sBulan = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      const count = sBulan.length;
      const performa = count > 0 ? Math.round(sBulan.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;"""

new_divisi = """      const sBulan = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      const count = sBulan.length;
      const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
      const expectedCount = reportType === "divisi" ? totalWeeksInMonth : 1;
      const performa = Math.round(sBulan.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);"""

content = content.replace(old_divisi, new_divisi)

# Rekap logic replacement
old_rekap = """      const count = filteredSubs.length;
      const performa = count > 0 ? Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;"""

new_rekap = """      const count = filteredSubs.length;
      const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
      // For rentang, we could count the weeks, but let's default to totalWeeksInMonth if it's month
      const expectedCount = reportType === "bulan" ? totalWeeksInMonth : reportType === "pekan" ? 1 : Math.max(1, count); // fallback for rentang
      const performa = Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);"""

content = content.replace(old_rekap, new_rekap)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done ReportsView logic")
