import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Replace export call
old_call = """      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, dokumenUrls, pejuangBadges, peringkatKeseluruhan, peringkatDivisi);"""
new_call = """      await exportMonthlyPejuangToPDF(pejuang, monthSubmissions, periodStr, chartBase64, dokumenUrls, pejuangBadges, peringkatKeseluruhan, peringkatDivisi, submissions);"""

content = content.replace(old_call, new_call)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
