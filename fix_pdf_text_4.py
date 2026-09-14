import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    '`${i+1}. ${d.pejuang.nama} (${d.pejuang.subDivisi})`': '`${i+1}. ${translateText(d.pejuang.nama)} (${translateText(d.pejuang.subDivisi)})`',
    '"YAYASAN AL-BAHJAH CABANG CIREBON 1"': 'translateText("YAYASAN AL-BAHJAH CABANG CIREBON 1")',
    '"PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1"': 'translateText("PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1")'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

print("More texts patched 4!")
