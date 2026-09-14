import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    'allTasksMap.set(translateText(t.uraian), { ...t, totalChecks: 0 });': 'allTasksMap.set(t.uraian, { ...t, totalChecks: 0 });',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
