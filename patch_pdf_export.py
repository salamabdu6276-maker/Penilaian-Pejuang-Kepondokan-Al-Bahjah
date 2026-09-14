import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

sig = "export async function exportFormToPDF(\n  submission: ChecklistFormSubmission, \n  pejuang?: Pejuang,\n  allSubmissions?: ChecklistFormSubmission[],\n  chartBase64?: string,\n  dokumenUrls?: string[]"

new_sig = "export async function exportFormToPDF(\n  submission: ChecklistFormSubmission, \n  pejuang?: Pejuang,\n  allSubmissions?: ChecklistFormSubmission[],\n  chartBase64?: string,\n  dokumenUrls?: string[],\n  sholatData?: any[]"

content = content.replace(sig, new_sig)

insert_point = "// Chart and Signatures at the bottom"
sholat_table = """
  // Sholat Table
  if (sholatData && sholatData.length > 0) {
    const sholatHead = [
      ["Tanggal", "Dzuhur", "Ashar", "Maghrib", "Isya", "Qiyamul Lail", "Subuh"]
    ];
    const sholatBody = sholatData.map(s => [
      s.date,
      s.dzuhur || "-",
      s.ashar || "-",
      s.maghrib || "-",
      s.isya || "-",
      s.qiyamul_lail || "-",
      s.subuh || "-"
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: sholatHead,
      body: sholatBody,
      theme: "grid",
      headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255], fontSize: 8, halign: "center" },
      styles: { fontSize: 7, cellPadding: 1.5, halign: "center" }
    });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(translateText("Rekap Kehadiran Sholat:"), 15, (doc as any).lastAutoTable.finalY - (sholatData.length * 5) - 10);
    // Adjust currentY for chart
  }
  let currentY = (doc as any).lastAutoTable.finalY + 10;
"""

content = content.replace(insert_point, sholat_table + "\n" + insert_point)
content = content.replace("let currentY = (doc as any).lastAutoTable.finalY + 10;\n\n  // Chart and Signatures at the bottom\n  let currentY = (doc as any).lastAutoTable.finalY + 10;", "// Chart and Signatures at the bottom\n  let currentY = (doc as any).lastAutoTable.finalY + 10;")

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

