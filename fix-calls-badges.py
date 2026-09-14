import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace('const pejuangBadges = calculateBadges(monthSubmissions, pejuang.id);', 'const pejuangBadges = calculateBadges(monthSubmissions, pejuang.id, getWeeksInMonth(selectedYear, selectedMonth));')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('const badges = calculateBadges(submissions, selectedDrilldownPejuang.id);', 'const badges = calculateBadges(submissions, selectedDrilldownPejuang.id); // Historical, no strict expected count')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Done")
