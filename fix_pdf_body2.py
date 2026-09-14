import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    'doc.text(titleStr, 105, 46, { align: "center" });': 'doc.text(translateText(titleStr), 105, 46, { align: "center" });',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
