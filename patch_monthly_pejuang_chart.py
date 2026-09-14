import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''const chartEl = document.getElementById("category-chart-container");''',
    '''const chartEl = document.getElementById("rekap-chart-container");'''
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("done")
