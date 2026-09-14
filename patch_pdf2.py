import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

replacements = {
    '`Rekap_Bulan_${pejuang.nama.replace(/\\s+/g, "_")}_${monthName}_${year}.pdf`': '`${translateText("Rekap_Bulan")}_${translateText(pejuang.nama).replace(/\\s+/g, "_")}_${translateText(monthName)}_${year}.pdf`',
    '`Laporan Bulanan Pejuang: ${pejuang.nama}`': '`${translateText("Laporan Bulanan Pejuang")}: ${translateText(pejuang.nama)}`',
    '["Pekan", "Form Disubmit", "Ceklis Tuntas", "Performa", "Status"]': '["Pekan", translateText("Form Disubmit"), translateText("Ceklis Tuntas"), translateText("Performa"), translateText("Status")]',
    '["No", "Uraian Kegiatan", "Kategori", "Pekan 1", "Pekan 2", "Pekan 3", "Pekan 4", "Pekan 5", "Total Ceklis"]': '["No", translateText("Uraian Kegiatan"), translateText("Kategori"), translateText("Pekan 1"), translateText("Pekan 2"), translateText("Pekan 3"), translateText("Pekan 4"), translateText("Pekan 5"), translateText("Total Ceklis")]',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
