import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# I need to pass the actual badges to exportMonthlyPejuangToPDF
content = content.replace(
"""      const pejuangBadges = calculateBadges(monthSubmissions);""",
"""      const pejuangBadges = calculateBadges(monthSubmissions, pejuang.id);"""
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("done")
