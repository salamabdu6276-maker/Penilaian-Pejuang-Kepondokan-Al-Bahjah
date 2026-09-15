import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "fotoUrl?: string;\n  status: 'aktif' | 'nonaktif';",
    "fotoUrl?: string;\n  whatsapp?: string;\n  status: 'aktif' | 'nonaktif';"
)

with open('src/types.ts', 'w') as f:
    f.write(content)
