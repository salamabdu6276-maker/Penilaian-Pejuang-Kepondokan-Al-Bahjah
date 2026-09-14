import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Make rekapData work for reportType === 'pejuang' (same as 'pekan' for calculating rank)
content = content.replace(
    '''if (reportType !== "bulan" && reportType !== "pekan" && reportType !== "rentang") return [];''',
    '''// Calculate always for pejuang ranking as well'''
)

content = content.replace(
    '''} else if (reportType === "pekan") {''',
    '''} else if (reportType === "pekan" || reportType === "pejuang") {'''
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("done")
