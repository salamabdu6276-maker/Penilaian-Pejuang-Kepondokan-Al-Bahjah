import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

target = """export async function exportRekapToPDF(
  rekapData: any[],
  periodStr: string,
  titleStr: string,
  chartBase64?: string,
  dokumenUrls?: string[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Header Al-Bahjah
  doc.setFont("helvetica", "bold");"""

replacement = """export async function exportRekapToPDF(
  rekapData: any[],
  periodStr: string,
  titleStr: string,
  chartBase64?: string,
  dokumenUrls?: string[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // COVER PAGE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(4, 120, 87);
  doc.text("LAPORAN KONSOLIDASI KINERJA", 105, 80, { align: "center" });
  doc.setFontSize(18);
  doc.text("PEJUANG KEPONDOKAN", 105, 90, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text(`Periode: ${periodStr}`, 105, 110, { align: "center" });
  
  // Summary list on cover
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Ringkasan Pejuang (${rekapData.length} Total):`, 20, 140);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let covY = 150;
  let colX = 20;
  rekapData.forEach((d, i) => {
    if (covY > 260) {
      colX += 90;
      covY = 150;
    }
    doc.text(`${i+1}. ${d.pejuang.nama} (${d.pejuang.subDivisi})`, colX, covY);
    covY += 7;
  });
  
  doc.addPage();

  // Header Al-Bahjah for Content Page
  doc.setFont("helvetica", "bold");"""

content = content.replace(target, replacement)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
