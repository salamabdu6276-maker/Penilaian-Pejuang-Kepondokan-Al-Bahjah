import re

with open('src/components/SholatAttendanceRecap.tsx', 'r') as f:
    content = f.read()

# Fix import
content = content.replace("import 'jspdf-autotable';", "import autoTable from 'jspdf-autotable';")

# Fix function call
content = content.replace("(doc as any).autoTable({", "autoTable(doc, {")

with open('src/components/SholatAttendanceRecap.tsx', 'w') as f:
    f.write(content)
