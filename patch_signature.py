import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# I need to insert the signature logic before the `autoTable(doc...` if there is no more auto table? Wait, `autoTable` ends at `finalY`.
old_export_end = """  autoTable(doc, {
    startY: 55,
    margin: { left: 10, right: 10 },
    head: tableHead,
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: [4, 120, 87],
      textColor: [255, 255, 255],
      fontSize: 9,
      halign: "center"
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: "middle"
    },
    columnStyles: colStyles
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.save(`Laporan_${title.replace(/ /g, "_")}_${periodStr}.pdf`);"""

new_export_end = """  autoTable(doc, {
    startY: 55,
    margin: { left: 10, right: 10 },
    head: tableHead,
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: [4, 120, 87],
      textColor: [255, 255, 255],
      fontSize: 9,
      halign: "center"
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: "middle"
    },
    columnStyles: colStyles
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Signature Block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  doc.text(`Cirebon, ${dateStr}`, 145, finalY);
  doc.text("Kepala Pondok", 145, finalY + 5);
  doc.text("Pesantren Al-Bahjah Cabang Cirebon 1", 145, finalY + 10);
  
  doc.text("_______________________", 145, finalY + 30);
  doc.text("Muhammad Rosyad, S.Pd", 145, finalY + 35);

  doc.save(`Laporan_${title.replace(/ /g, "_")}_${periodStr}.pdf`);"""

content = content.replace(old_export_end, new_export_end)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Updated signature")
