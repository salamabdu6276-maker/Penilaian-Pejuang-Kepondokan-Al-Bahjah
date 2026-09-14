import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace("exportFormToPDF, exportRekapToPDF, exportRekapToPDF", "exportFormToPDF, exportRekapToPDF")

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
