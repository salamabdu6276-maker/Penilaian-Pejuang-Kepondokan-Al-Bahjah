import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    'task.waktu,': 'translateText(task.waktu),',
    'task.uraian,': 'translateText(task.uraian),',
    'task.kategori,': 'translateText(task.kategori),',
    'task.catatan || ""': 'translateText(task.catatan || "")',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
