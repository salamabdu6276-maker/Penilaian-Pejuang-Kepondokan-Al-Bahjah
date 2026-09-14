import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    't.uraian,': 'translateText(t.uraian),',
    't.kategori,': 'translateText(t.kategori),'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

print("More texts patched 3!")
