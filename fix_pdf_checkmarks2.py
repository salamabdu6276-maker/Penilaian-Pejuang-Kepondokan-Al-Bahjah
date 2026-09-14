import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '''const checkCols = dates.map(d => (task.realisasiChecks?.[d] ? "V" : "X"));''',
    '''const checkCols = dates.map(d => (task.realisasiChecks?.[d] ? "v" : "x"));'''
)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
