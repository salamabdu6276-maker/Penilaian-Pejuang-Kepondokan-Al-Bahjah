import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    '"Kepala Pondok Pesantren Al-Bahjah"': 'translateText("Kepala Pondok Pesantren Al-Bahjah")',
    '"Cabang Cirebon 1"': 'translateText("Cabang Cirebon 1")',
    'pejuang?.amanah || "Pejuang Kepondokan"': 'translateText(pejuang?.amanah || "Pejuang Kepondokan")',
    '"Ustadz Muhammad Hamdani"': 'translateText("Ustadz Muhammad Hamdani")'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

print("More texts patched!")
