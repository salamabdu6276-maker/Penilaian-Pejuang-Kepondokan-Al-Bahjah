import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    '`Form_Checklist_${submission.pejuangNama.replace(/\\s+/g, \'_\')}_${submission.periodeStr.replace(/\\s+/g, \'_\')}.pdf`': '`${translateText("Form_Checklist")}_${translateText(submission.pejuangNama).replace(/\\s+/g, "_")}_${translateText(submission.periodeStr).replace(/\\s+/g, "_")}.pdf`',
    '`Laporan_Bulanan_${pejuang.nama.replace(/\\s+/g, \'_\')}_${periodStr.replace(/\\s+/g, \'_\')}.pdf`': '`${translateText("Laporan_Bulanan")}_${translateText(pejuang.nama).replace(/\\s+/g, "_")}_${translateText(periodStr).replace(/\\s+/g, "_")}.pdf`',
    '`${title.replace(/\\s+/g, \'_\')}_${periodStr.replace(/\\s+/g, \'_\')}.pdf`': '`${translateText(title).replace(/\\s+/g, "_")}_${translateText(periodStr).replace(/\\s+/g, "_")}.pdf`',
    '`${titleStr.replace(/\\s+/g, \'_\')}_${periodStr.replace(/\\s+/g, \'_\')}.pdf`': '`${translateText(titleStr).replace(/\\s+/g, "_")}_${translateText(periodStr).replace(/\\s+/g, "_")}.pdf`'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

print("Names patched!")
