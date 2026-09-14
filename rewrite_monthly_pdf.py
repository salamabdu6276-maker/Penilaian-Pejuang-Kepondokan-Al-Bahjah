import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

parts = content.split('export async function exportMonthlyPejuangToPDF')
before = parts[0]
after_split = parts[1].split('export async function exportToExcel', 1)

if len(after_split) > 1:
    after = '\nexport async function exportToExcel' + after_split[1]
else:
    after = ''

new_func = """export async function exportMonthlyPejuangToPDF(
  pejuang: any,
  monthSubmissions: any[],
  periodStr: string,
  chartBase64?: string,
  dokumenUrls?: string[],
  badges?: any[],
  peringkatKeseluruhan?: string,
  peringkatDivisi?: string,
  allSubmissions?: any[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(4, 120, 87);
  doc.text(translateText("YAYASAN AL-BAHJAH CABANG CIREBON 1"), 105, 15, { align: "center" });
  
  try {
    const logoBase64 = await fetchAppLogo() || await getBase64ImageFromUrl("/logo.png");
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 20, 10, 22, 22);
    }
  } catch (err) {}

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(translateText("NOMOR STATISTIK PESANTREN (NSP): 510032090039"), 105, 26, { align: "center" });
  doc.text(translateText("Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611"), 105, 30, { align: "center" });

  doc.setLineWidth(0.8);
  doc.setDrawColor(4, 120, 87);
  doc.line(15, 37, 195, 37);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(translateText("LAPORAN KONSOLIDASI BULANAN PEJUANG"), 105, 45, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${translateText("Nama")}: ${translateText(pejuang.nama)}`, 15, 55);
  doc.text(`${translateText("Sub Divisi")}: ${translateText(pejuang.subDivisi)}`, 15, 60);
  doc.text(`${translateText("Amanah")}: ${translateText(pejuang.amanah)}`, 15, 65);
  doc.text(`${translateText("Periode")}: ${translateText(periodStr)}`, 15, 70);

  let badgeY = 78;
  if (badges && badges.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text(translateText("Badges Keaktifan") + ":", 15, badgeY);
    let badgeX = 15;
    badges.forEach((b: any) => {
       doc.setFontSize(8);
       doc.setFillColor(230, 240, 235);
       doc.rect(badgeX, badgeY + 2, 25, 12, "F");
       doc.setTextColor(4, 120, 87);
       doc.text(b.label, badgeX + 12.5, badgeY + 9, { align: "center" });
       badgeX += 28;
    });
    doc.setTextColor(0, 0, 0); // Reset
  }

  let totalWeeks = monthSubmissions.length;
  let totalPct = 0;
  monthSubmissions.forEach(sub => { totalPct += sub.percentage; });
  const avgPct = totalWeeks > 0 ? Math.round(totalPct / totalWeeks) : 0;

  doc.setFont("helvetica", "bold");
  doc.text(`${translateText("Performa Rata-Rata")}: ${avgPct}%`, 130, 55);
  doc.text(`${translateText("Total Form Pekan")}: ${totalWeeks}`, 130, 60);
  if (peringkatKeseluruhan) doc.text(`${translateText("Peringkat Keseluruhan")}: ${peringkatKeseluruhan}`, 130, 65);
  if (peringkatDivisi) doc.text(`${translateText("Peringkat Divisi")}: ${peringkatDivisi}`, 130, 70);

  // START LOOPING EACH WEEK
  let currentY = 100;
  
  const sortedSubs = [...monthSubmissions].sort((a, b) => a.pekan - b.pekan);
  
  sortedSubs.forEach((sub, wIdx) => {
      if (currentY > 250) {
          doc.addPage();
          currentY = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(4, 120, 87);
      doc.text(`Pekan ${sub.pekan} (${sub.periodeStr}) - Performa: ${sub.percentage}%`, 15, currentY);
      
      // Calculate rank for this specific week if allSubmissions is provided
      if (allSubmissions && allSubmissions.length > 0) {
          const periodSubmissions = allSubmissions.filter(
            s => s.bulan === sub.bulan && s.tahun === sub.tahun && s.pekan === sub.pekan
          ).sort((a, b) => b.percentage - a.percentage);
          const rank = periodSubmissions.findIndex(s => s.id === sub.id) + 1;
          if (rank > 0) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(0, 0, 0);
              doc.text(`(Peringkat Pekan: #${rank} dari ${periodSubmissions.length})`, 130, currentY);
          }
      }
      
      currentY += 5;
      doc.setTextColor(0, 0, 0);
      
      const dates = sub.dates;
      const dateHeaders = dates.map((d: any) => String(d).padStart(2, '0'));
      const tableHead = [
        ["No", translateText("Waktu"), translateText("Uraian Kegiatan"), ...dateHeaders, translateText("Kat"), translateText("Catatan")]
      ];
      
      const tableBody = sub.tasks.map((task: any, idx: number) => {
        const checkCols = dates.map((d: any) => (task.realisasiChecks?.[d] ? "v" : "x"));
        return [
          idx + 1,
          translateText(task.waktu),
          translateText(task.uraian),
          ...checkCols,
          translateText(task.kategori),
          translateText(task.catatan || "")
        ];
      });
      
      autoTable(doc, {
        startY: currentY,
        head: tableHead,
        body: tableBody,
        theme: "grid",
        headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255], fontSize: 8, halign: "center" },
        styles: { fontSize: 7, cellPadding: 1.5, valign: "middle" },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 20, halign: "center" },
          2: { cellWidth: 55 },
          ...dates.reduce((acc: any, _: any, i: number) => ({ ...acc, [3 + i]: { cellWidth: 8, halign: "center" } }), {}),
          [3 + dates.length]: { cellWidth: 10, halign: "center" },
          [4 + dates.length]: { cellWidth: 25 }
        },
        didParseCell: (data: any) => {
          if (data.section === 'body' && data.column.index >= 3 && data.column.index < 3 + dates.length) {
            if (data.cell.raw === 'v') {
              data.cell.styles.textColor = [4, 120, 87];
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.raw === 'x') {
              data.cell.styles.textColor = [225, 29, 72];
            } else {
              data.cell.styles.textColor = [150, 150, 150];
            }
          }
        }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
  });

  if (chartBase64) {
    if (currentY + 60 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(translateText("Grafik Perkembangan Performa Mingguan (Pekan 1 - 5)") + ":", 15, currentY);
    doc.addImage(chartBase64, "PNG", 15, currentY + 5, 120, 50);
    currentY += 60;
  }

  if (dokumenUrls && dokumenUrls.length > 0) {
    if (currentY + 60 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(translateText("Dokumentasi Seluruh Checklist Bulan Ini (Fisik)") + ":", 15, currentY);
    
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
  const pageHeight = doc.internal.pageSize.height;
  let ttdY = finalY;
  if (finalY + 30 > pageHeight - 20) {
    doc.addPage();
    ttdY = 20;
  }

  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${translateText("Cirebon")}, ${currentDate}`, 145, ttdY);
  doc.text(translateText("Diperiksa Oleh,"), 145, ttdY + 5);
  doc.text(translateText("Mudir / Divisi Kepondokan"), 145, ttdY + 30);

  doc.save(`${translateText("Laporan_Konsolidasi")}_${translateText(pejuang.nama.replace(/\s+/g, "_"))}_${translateText(periodStr).replace(/\s+/g, "_")}.pdf`);
}
"""

with open('src/utils/export.ts', 'w') as f:
    f.write(before + new_func + after)
print("Done")
