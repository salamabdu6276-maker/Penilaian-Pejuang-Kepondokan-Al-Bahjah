import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

target = """export async function exportRekapToPDF(
  rekapData: any[],
  periodStr: string,
  titleStr: string
) {"""

replacement = """export async function exportRekapToPDF(
  rekapData: any[],
  periodStr: string,
  titleStr: string,
  chartBase64?: string,
  dokumenUrls?: string[]
) {"""

content = content.replace(target, replacement)

# Add chart and document rendering logic at the end of exportRekapToPDF
footer_target = """  const finalY = (doc as any).lastAutoTable.finalY + 20;
  if (finalY < 260) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Mengetahui,", 150, finalY);
    doc.text("Kepala Pondok Pesantren", 150, finalY + 4);
    doc.setFont("helvetica", "bold");
    doc.text("Ustadz Muhammad Hamdani", 150, finalY + 24);
  }

  doc.save(`${titleStr.replace(/\s+/g, '_')}_${periodStr.replace(/\s+/g, '_')}.pdf`);"""

footer_replacement = """  let currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // Attach Chart
  if (chartBase64) {
    if (currentY + 60 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Grafik Peringkat Performa:", 15, currentY);
    doc.addImage(chartBase64, "PNG", 15, currentY + 5, 120, 50);
    currentY += 60;
  }
  
  // Attach Documents
  if (dokumenUrls && dokumenUrls.length > 0) {
    if (currentY + 60 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Dokumentasi Checklist (Fisik):", 15, currentY);
    
    let xOffset = 15;
    dokumenUrls.forEach((url, i) => {
       if (xOffset > 150) {
         currentY += 55;
         xOffset = 15;
         if (currentY + 50 > 280) {
           doc.addPage();
           currentY = 20;
         }
       }
       try {
         doc.addImage(url, "JPEG", xOffset, currentY + 5, 50, 50);
       } catch(e) {}
       xOffset += 55;
    });
    currentY += 60;
  }

  const finalY = currentY + 5;
  if (finalY < 260) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Mengetahui,", 150, finalY);
    doc.text("Kepala Pondok Pesantren", 150, finalY + 4);
    doc.setFont("helvetica", "bold");
    doc.text("Ustadz Muhammad Hamdani", 150, finalY + 24);
  }

  doc.save(`${titleStr.replace(/\s+/g, '_')}_${periodStr.replace(/\s+/g, '_')}.pdf`);"""

content = content.replace(footer_target, footer_replacement)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
