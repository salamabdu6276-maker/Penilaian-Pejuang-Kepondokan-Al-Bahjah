import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Replace export call
old_chart_query = """      const chartEl = document.getElementById("rekap-chart-container");"""
new_chart_query = """      const chartEl = document.getElementById("pejuang-monthly-trend-chart");"""

content = content.replace(old_chart_query, new_chart_query)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
