import re

with open('src/components/TranslationDictionary.tsx', 'r') as f:
    content = f.read()

additional_keys = [
    '"FORM CHECKLIST PENGURUS KEPONDOKAN AL BAHJAH CABANG 1"',
    '"NAMA"',
    '"AMANAH"',
    '"PERIODE"',
    '"PERFORMA"',
    '"PREDIKAT"',
    '"STATUS"',
    '"RANGKING"',
    '"Peringkat"',
    '"dari"',
    '"Pejuang"',
    '"Grafik Kegiatan per Kategori:"',
    '"Dokumentasi Fisik (Bukti Checklist):"',
    '"Kat"',
    '"Uraian Tugas/Kegiatan"',
    '"Target"',
    '"Realisasi"',
    '"Persentase"',
]

for key in additional_keys:
    if key not in content:
        content = content.replace('"Laporan Bulanan",', f'{key},\n  "Laporan Bulanan",')

with open('src/components/TranslationDictionary.tsx', 'w') as f:
    f.write(content)

print("Dictionary patched!")
