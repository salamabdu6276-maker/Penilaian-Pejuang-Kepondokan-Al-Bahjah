import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# I want to change the one in handleExportPDF back to category-chart-container
# Let's find it. It's inside handleExportPDF which is after handleExportBulanPejuangPDF

split_content = content.split('const handleExportPDF = async () => {')
if len(split_content) == 2:
    split_content[1] = split_content[1].replace(
        'const chartEl = document.getElementById("rekap-chart-container");',
        'const chartEl = document.getElementById("category-chart-container");',
        1
    )
    new_content = 'const handleExportPDF = async () => {'.join(split_content)
    with open('src/components/ReportsView.tsx', 'w') as f:
        f.write(new_content)
    print("Fixed")
else:
    print("Could not find handleExportPDF")
