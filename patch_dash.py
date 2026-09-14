import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('import "jspdf-autotable";', 'import autoTable from "jspdf-autotable";')
content = content.replace('(doc as any).autoTable({', 'autoTable(doc, {')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
