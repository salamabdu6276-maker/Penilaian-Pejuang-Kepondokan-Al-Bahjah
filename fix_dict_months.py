with open('src/components/TranslationDictionary.tsx', 'r') as f:
    content = f.read()

words_to_add = [
    "Pekan",
    "s/d",
    "sd",
    "Rekap Semua Pejuang",
    "Laporan Divisi",
    "Laporan_Divisi",
    "Laporan_Checklist",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
    "Waktu",
    "Catatan"
]

for word in words_to_add:
    if f'"{word}"' not in content:
        content = content.replace('"Laporan Bulanan",', f'"{word}",\n  "Laporan Bulanan",')

with open('src/components/TranslationDictionary.tsx', 'w') as f:
    f.write(content)

print("Months and more added to dict")
