import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Add signature to exportSummaryToPDF
old_summary_end = """
  autoTable(doc, {
    startY: 55,
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
  
  doc.save(`${translateText(title).replace(/\s+/g, "_")}_${translateText(periodStr).replace(/\s+/g, "_")}.pdf`);
"""

new_summary_end = """
  autoTable(doc, {
    startY: 55,
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
  
  const finalY = (doc as any).autoTable.previous.finalY + 15;
  if (finalY < 260) {
    const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${translateText("Cirebon")}, ${currentDate}`, 140, finalY);
    doc.text(translateText("Diperiksa Oleh,"), 140, finalY + 5);
    doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 140, finalY + 10);
    doc.text(translateText("Cabang Cirebon 1"), 140, finalY + 15);
    
    try {
      const ttdBase64 = await fetchSignatureLogo();
      if (ttdBase64) {
        doc.addImage(ttdBase64, "PNG", 140, finalY + 18, 35, 15);
      }
    } catch(err) {}
    
    doc.setFont("helvetica", "bold");
    doc.text(translateText("Ustadz M Hamdani, B.Sc"), 140, finalY + 38);
  }

  doc.save(`${translateText(title).replace(/\s+/g, "_")}_${translateText(periodStr).replace(/\s+/g, "_")}.pdf`);
"""

content = content.replace(old_summary_end, new_summary_end)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
