import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

target = """  (doc as any).autoTable({
    startY: 75,"""

replacement = """  autoTable(doc, {
    startY: 75,"""

content = content.replace(target, replacement)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
