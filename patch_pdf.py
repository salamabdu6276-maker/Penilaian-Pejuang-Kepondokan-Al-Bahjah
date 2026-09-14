import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Replace exportFormToPDF strings
replacements = {
    '"NOMOR STATISTIK PESANTREN (NSP): 510032090039"': 'translateText("NOMOR STATISTIK PESANTREN (NSP): 510032090039")',
    '"Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611"': 'translateText("Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611")',
    '"Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id"': 'translateText("Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id")',
    '"LAPORAN BULANAN KINERJA PEJUANG"': 'translateText("LAPORAN BULANAN KINERJA PEJUANG")',
    '`Nama: ${pejuang.nama}`': '`${translateText("Nama")}: ${translateText(pejuang.nama)}`',
    '`Sub Divisi: ${pejuang.subDivisi}`': '`${translateText("Sub Divisi")}: ${translateText(pejuang.subDivisi)}`',
    '`Amanah: ${pejuang.amanah}`': '`${translateText("Amanah")}: ${translateText(pejuang.amanah)}`',
    '`Periode: ${periodStr}`': '`${translateText("Periode")}: ${translateText(periodStr)}`',
    '`Performa Rata-Rata: ${avgPct}%`': '`${translateText("Performa Rata-Rata")}: ${avgPct}%`',
    '`Total Form Pekan: ${totalWeeks}`': '`${translateText("Total Form Pekan")}: ${totalWeeks}`',
    '["No", "Uraian Kegiatan", "Kategori", "Total Ceklis Bulan Ini"]': '["No", translateText("Uraian Kegiatan"), translateText("Kategori"), translateText("Total Ceklis Bulan Ini")]',
    'tItem.uraian,': 'translateText(tItem.uraian),',
    'tItem.kategori,': 'translateText(tItem.kategori),',
    '"Grafik Kinerja:"': 'translateText("Grafik Kinerja") + ":"',
    '"Dokumentasi Checklist (Fisik):"': 'translateText("Dokumentasi Checklist (Fisik)") + ":"',
    '"Mengetahui,"': 'translateText("Mengetahui,")',
    '"Kepala Pondok Pesantren"': 'translateText("Kepala Pondok Pesantren")',
    '`Laporan_Bulanan_${pejuang.nama.replace(/\\s+/g, "_")}_${periodStr.replace(/\\s+/g, "_")}.pdf`': '`${translateText("Laporan_Bulanan")}_${translateText(pejuang.nama).replace(/\\s+/g, "_")}_${translateText(periodStr).replace(/\\s+/g, "_")}.pdf`',
    
    # exportRekapToPDF replacements
    '"LAPORAN KONSOLIDASI KINERJA"': 'translateText("LAPORAN KONSOLIDASI KINERJA")',
    '"PEJUANG KEPONDOKAN"': 'translateText("PEJUANG KEPONDOKAN")',
    '`Ringkasan Pejuang (${rekapData.length} Total):`': '`${translateText("Ringkasan Pejuang")} (${rekapData.length} ${translateText("Total")}):`',
    '`${i + 1}. ${d.pejuang.nama} (${d.pejuang.subDivisi})`': '`${i + 1}. ${translateText(d.pejuang.nama)} (${translateText(d.pejuang.subDivisi)})`',
    '["Peringkat", "Nama Pejuang", "Divisi", "Amanah", "Form Disubmit", "Rata-Rata", "Predikat"]': '["Peringkat", translateText("Nama Pejuang"), translateText("Divisi"), translateText("Amanah"), translateText("Form Disubmit"), translateText("Rata-Rata"), translateText("Predikat")]',
    'd.pejuang.nama,': 'translateText(d.pejuang.nama),',
    'd.pejuang.subDivisi,': 'translateText(d.pejuang.subDivisi),',
    'd.pejuang.amanah,': 'translateText(d.pejuang.amanah),',
    '"Grafik Peringkat Performa:"': 'translateText("Grafik Peringkat Performa") + ":"',
    '`Laporan_Konsolidasi_${periodStr.replace(/\\s+/g, "_")}.pdf`': '`${translateText("Laporan_Konsolidasi")}_${translateText(periodStr).replace(/\\s+/g, "_")}.pdf`',
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

