import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Replace the ternary operator that generates "√" and "-"
content = content.replace(
    '''const checkCols = dates.map(d => (task.realisasiChecks?.[d] ? "√" : "-"));''',
    '''const checkCols = dates.map(d => (task.realisasiChecks?.[d] ? "V" : "X"));'''
)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
