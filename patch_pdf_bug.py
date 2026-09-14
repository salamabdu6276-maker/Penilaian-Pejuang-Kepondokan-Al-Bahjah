import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Fix the syntax error on line 345
content = content.replace("await exportFormToPDF, exportRekapToPDF(", "await exportFormToPDF(")

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
