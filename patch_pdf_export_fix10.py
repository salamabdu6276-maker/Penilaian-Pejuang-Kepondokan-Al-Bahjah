import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

content = content.replace("  let currentY = (doc as any).lastAutoTable.finalY + 10;\n// Chart and Signatures at the bottom\n  let currentY = (doc as any).lastAutoTable.finalY + 10;", "// Chart and Signatures at the bottom\n  let currentY = (doc as any).lastAutoTable.finalY + 10;")
content = content.replace("  }  let currentY = (doc as any).lastAutoTable.finalY + 10;// Chart and Signatures at the bottom\n  let currentY = (doc as any).lastAutoTable.finalY + 10;", "  }\n// Chart and Signatures at the bottom\n  let currentY = (doc as any).lastAutoTable.finalY + 10;")

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
