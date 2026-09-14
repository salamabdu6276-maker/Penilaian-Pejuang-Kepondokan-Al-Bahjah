import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

content = content.replace('"Ustadz Muhammad Hamdani"', 'translateText("Ustadz Muhammad Hamdani")')

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

print("More texts patched 5!")
