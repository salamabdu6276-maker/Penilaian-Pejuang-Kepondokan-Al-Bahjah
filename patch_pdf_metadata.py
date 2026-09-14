import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Modify exportMonthlyPejuangToPDF signature
content = content.replace(
    """  dokumenUrls?: string[],
  badges?: any[]
) {""",
    """  dokumenUrls?: string[],
  badges?: any[],
  peringkatKeseluruhan?: string,
  peringkatDivisi?: string
) {"""
)

# Add printing the ranks
content = content.replace(
    """  doc.text(`${translateText("Performa Rata-Rata")}: ${avgPct}%`, 130, 55);
  doc.text(`${translateText("Total Form Pekan")}: ${totalWeeks}`, 130, 60);""",
    """  doc.text(`${translateText("Performa Rata-Rata")}: ${avgPct}%`, 130, 55);
  doc.text(`${translateText("Total Form Pekan")}: ${totalWeeks}`, 130, 60);
  if (peringkatKeseluruhan) doc.text(`${translateText("Peringkat Keseluruhan")}: ${peringkatKeseluruhan}`, 130, 65);
  if (peringkatDivisi) doc.text(`${translateText("Peringkat Divisi")}: ${peringkatDivisi}`, 130, 70);"""
)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
