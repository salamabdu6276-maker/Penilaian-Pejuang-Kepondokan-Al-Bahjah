import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    'doc.text(title, 105, 44, { align: "center" });': 'doc.text(translateText(title), 105, 44, { align: "center" });',
    'row.Nama,': 'translateText(row.Nama),',
    'row["Sub Divisi"],': 'translateText(row["Sub Divisi"]),',
    'row.Evaluasi': 'translateText(row.Evaluasi)',
    'row.Predikat': 'translateText(row.Predikat)',
    '["Peringkat"': '[translateText("Peringkat")',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
