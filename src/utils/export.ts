import { translateText } from "./translate";
import { getWeeksInMonth } from "./hijri";
import { fetchAppLogo, fetchSignatureLogo } from "../services/dbService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import * as htmlToImage from "html-to-image";
import { ChecklistFormSubmission, Pejuang } from "../types";

// Export to CSV
export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;

  const translatedData = data.map(row => {
    const newRow: Record<string, any> = {};
    for (const key in row) {
      newRow[translateText(key)] = typeof row[key] === 'string' ? translateText(row[key]) : row[key];
    }
    return newRow;
  });

  const headers = Object.keys(translatedData[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.join(","));

  for (const row of translatedData) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to Excel XLSX
export function exportToExcel(data: Record<string, any>[], filename: string, sheetName = "Laporan") {
  const translatedData = data.map(row => {
    const newRow: Record<string, any> = {};
    for (const key in row) {
      newRow[translateText(key)] = typeof row[key] === 'string' ? translateText(row[key]) : row[key];
    }
    return newRow;
  });
  const worksheet = XLSX.utils.json_to_sheet(translatedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, translateText(sheetName));
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Export Element to Image PNG
export async function exportElementToImage(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      filter: (node) => { if (node.dataset && node.dataset.html2canvasIgnore === "true") return false; return true; }
    });
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export image:", err);
  }
}


async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch(e) {
    return null;
  }
}

// Export Checklist Form or Summary to PDF with official header styling
export async function exportSummaryToPDF(
  summaryData: any[],
  periodStr: string,
  title: string
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Header Al-Bahjah
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(4, 120, 87); // Emerald color
  doc.text(translateText(translateText("YAYASAN AL-BAHJAH CABANG CIREBON 1")), 105, 15, { align: "center" });
  
  try {
    const logoBase64 = await fetchAppLogo() || await getBase64ImageFromUrl("/logo.png");
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 20, 10, 22, 22);
    }
  } catch (err) {}

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(translateText(translateText("PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1")), 105, 21, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(translateText("NOMOR STATISTIK PESANTREN (NSP): 510032090039"), 105, 26, { align: "center" });
  doc.text(translateText("Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611"), 105, 30, { align: "center" });
  doc.text(translateText("Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id"), 105, 34, { align: "center" });

  // Divider Line
  doc.setLineWidth(0.8);
  doc.setDrawColor(4, 120, 87);
  doc.line(15, 37, 195, 37);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(translateText(title), 105, 44, { align: "center" });
  doc.text(`${translateText("PERIODE")}: ${translateText(periodStr)}`, 105, 49, { align: "center" });

  const hasWeeklyData = summaryData.length > 0 && summaryData[0]["W1"] !== undefined;

  let tableHead: any[][] = [];
  let tableBody: any[][] = [];
  let colStyles: any = {};

  if (hasWeeklyData) {
    tableHead = [
      [translateText("Peringkat"), translateText("Nama"), translateText("Sub Divisi"), translateText("Pekan 1"), translateText("Pekan 2"), translateText("Pekan 3"), translateText("Pekan 4"), translateText("Pekan 5"), translateText("Rata-Rata"), translateText("Evaluasi")]
    ];
    tableBody = summaryData.map(row => [
      row.Peringkat || row.No,
      translateText(row.Nama),
      translateText(row["Sub Divisi"]),
      row.W1 !== "-" ? `${row.W1}%` : "-",
      row.W2 !== "-" ? `${row.W2}%` : "-",
      row.W3 !== "-" ? `${row.W3}%` : "-",
      row.W4 !== "-" ? `${row.W4}%` : "-",
      row.W5 !== "-" ? `${row.W5}%` : "-",
      `${row["Persentase (%)"]}%`,
      translateText(row.Evaluasi)
    ]);
    colStyles = {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 33 },
      2: { cellWidth: 27 },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 12, halign: "center" },
      5: { cellWidth: 12, halign: "center" },
      6: { cellWidth: 12, halign: "center" },
      7: { cellWidth: 12, halign: "center" },
      8: { cellWidth: 15, halign: "center", fontStyle: 'bold' },
      9: { cellWidth: 20, halign: "center", fontStyle: 'bold' }
    };
  } else {
    tableHead = [
      [translateText("Peringkat"), translateText("Nama"), translateText("Sub Divisi"), translateText("Target"), translateText("Realisasi"), translateText("Persentase"), translateText("Predikat")]
    ];
    tableBody = summaryData.map(row => [
      row.Peringkat || row.No,
      translateText(row.Nama),
      translateText(row["Sub Divisi"]),
      row["Total Target (Item)"],
      row["Total Realisasi (Item)"],
      `${row["Persentase (%)"]}%`,
      translateText(row.Predikat)
    ]);
    colStyles = {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 45 },
      2: { cellWidth: 40 },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 25, halign: "center" },
      6: { cellWidth: 20, halign: "center" }
    };
  }

  autoTable(doc, {
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
}

export async function exportFormToPDF(
  submission: ChecklistFormSubmission, 
  pejuang?: Pejuang,
  allSubmissions?: ChecklistFormSubmission[],
  chartBase64?: string,
  dokumenUrls?: string[],
  sholatData?: any[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Header Al-Bahjah
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(4, 120, 87); // Emerald color
  doc.text(translateText(translateText("YAYASAN AL-BAHJAH CABANG CIREBON 1")), 105, 15, { align: "center" });
  
  try {
    const logoBase64 = await fetchAppLogo() || await getBase64ImageFromUrl("/logo.png");
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 20, 10, 22, 22);
    }
  } catch (err) {}

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(translateText(translateText("PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1")), 105, 21, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(translateText("NOMOR STATISTIK PESANTREN (NSP): 510032090039"), 105, 26, { align: "center" });
  doc.text(translateText("Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611"), 105, 30, { align: "center" });
  doc.text(translateText("Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id"), 105, 34, { align: "center" });

  // Divider Line
  doc.setLineWidth(0.8);
  doc.setDrawColor(4, 120, 87);
  doc.line(15, 37, 195, 37);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(translateText("FORM CHECKLIST PENGURUS KEPONDOKAN AL BAHJAH CABANG 1"), 105, 44, { align: "center" });

  // Calculate Ranking
  let rankingText = "-";
  if (allSubmissions && allSubmissions.length > 0) {
    const periodSubmissions = allSubmissions.filter(
      s => s.bulan === submission.bulan && s.tahun === submission.tahun
    ).sort((a, b) => b.percentage - a.percentage);
    
    const rank = periodSubmissions.findIndex(s => s.id === submission.id) + 1;
    if (rank > 0) {
      rankingText = `${translateText("Peringkat")} ${rank} ${translateText("dari")} ${periodSubmissions.length} ${translateText("Pejuang")}`;
    }
  }

  // Metadata
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(translateText("NAMA"), 15, 52);
  doc.text(translateText("AMANAH"), 15, 57);
  doc.text(translateText("PERIODE"), 15, 62);

  doc.setFont("helvetica", "normal");
  doc.text(`: ${submission.pejuangNama}`, 40, 52);
  doc.text(`: ${submission.amanah} (${submission.subDivisi})`, 40, 57);
  doc.text(`: ${submission.pekan === 99 || submission.pekan === 0 ? submission.periodeStr : "Pekan " + submission.pekan + " Tgl " + submission.periodeStr}`, 40, 62);


  doc.setFont("helvetica", "bold");
  doc.text(`${translateText("PERFORMA")}: ${submission.percentage}%`, 150, 52);

  let predikat = "D";
  if (submission.percentage >= 91) predikat = "A";
  else if (submission.percentage >= 76) predikat = "B";
  else if (submission.percentage >= 40) predikat = "C";
  doc.text(`${translateText("PREDIKAT")}: ${translateText(predikat)}`, 150, 57);

  doc.text(`${translateText("STATUS")}: ${translateText(submission.status.toUpperCase())}`, 150, 62);
  doc.text(`${translateText("RANGKING")}: ${rankingText}`, 150, 67);
  
  // Try adding foto
  if (pejuang?.fotoUrl) {
    try {
       // Just adding text indicating Photo location or try to addImage if we have a data URL
       if (pejuang.fotoUrl.startsWith("data:image")) {
          doc.addImage(pejuang.fotoUrl, "JPEG", 175, 48, 20, 20);
       } else {
          doc.setFontSize(7);
          doc.text("(Foto Profil)", 185, 58, { align: "center" });
       }
    } catch (e) {
      console.error(e);
    }
  }
  

  // Table Columns
  const dates = submission.dates;
  const dateHeaders = dates.map(d => String(d).padStart(2, '0'));

  const tableHead = [
    ["No", translateText("Waktu"), translateText("Uraian Tugas/Kegiatan"), ...dateHeaders, translateText("Kat"), translateText("Catatan")]
  ];

  const tableBody = submission.tasks.map((task, idx) => {
    const checkCols = dates.map(d => (task.realisasiChecks?.[d] ? "v" : "x"));
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
    startY: 67,
    head: tableHead,
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: [4, 120, 87],
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: "center"
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      valign: "middle"
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 22, halign: "center" },
      2: { cellWidth: 60 },
      ...dates.reduce((acc, _, i) => ({ ...acc, [3 + i]: { cellWidth: 8, halign: "center" } }), {}),
      [3 + dates.length]: { cellWidth: 10, halign: "center" },
      [4 + dates.length]: { cellWidth: 25 }
    },
    didParseCell: (data) => {
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

// Chart and Signatures at the bottom
  let currentY = (doc as any).lastAutoTable.finalY + 10;
  
  if (chartBase64) {
    if (currentY + 50 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(translateText("Grafik Kegiatan per Kategori:"), 15, currentY);
    doc.addImage(chartBase64, "PNG", 15, currentY + 5, 120, 45);
    currentY += 55;
  }
  
  // Attach Document Uploads
  if (dokumenUrls && dokumenUrls.length > 0) {
    if (currentY + 60 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(translateText("Dokumentasi Fisik (Bukti Checklist):"), 15, currentY);
    
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
    doc.text(translateText("Diperiksa Oleh,"), 30, finalY - 5);
    doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 30, finalY);
    doc.text(translateText("Cabang Cirebon 1"), 30, finalY + 4);
    
    doc.text(translateText("Pejuang Ybs,"), 140, finalY - 5);

    try {
      const ttdBase64 = await fetchSignatureLogo();
      if (ttdBase64) {
        doc.addImage(ttdBase64, "PNG", 30, finalY + 6, 35, 15);
      }
    } catch(err) {}

    doc.setFont("helvetica", "bold");
    doc.text(translateText("Ustadz M Hamdani, B.Sc"), 30, finalY + 24);
    doc.text(submission.pejuangNama, 140, finalY + 24);
  }

  doc.save(`${translateText("Form_Checklist")}_${translateText(submission.pejuangNama).replace(/\s+/g, "_")}_${translateText(submission.periodeStr).replace(/\s+/g, "_")}.pdf`);
}

export async function exportElementToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      filter: (node) => { if (node.dataset && node.dataset.html2canvasIgnore === "true") return false; return true; }
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
    
    // If the height exceeds one page, we might need multiple pages, 
    // but for simplicity, let's just scale it or let it run off, 
    // or set the orientation to landscape if width > height
    
    // Better yet, just add the image to the pdf and save
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);

  } catch (err) {
    console.error("Failed to export PDF:", err);
  }
}


export async function exportMonthlyPejuangToPDF(
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

  let submittedWeeks = monthSubmissions.length;
  let totalPct = 0;
  monthSubmissions.forEach(sub => { totalPct += sub.percentage; });
  
  let expectedWeeks = submittedWeeks;
  if (submittedWeeks > 0) {
    const y = monthSubmissions[0].tahun;
    const m = monthSubmissions[0].bulan;
    expectedWeeks = getWeeksInMonth(y, m);
  }
  
  const avgPct = expectedWeeks > 0 ? Math.round(totalPct / expectedWeeks) : 0;

  doc.setFont("helvetica", "bold");
  doc.text(`${translateText("Performa Rata-Rata")}: ${avgPct}%`, 130, 55);
  let weekStatus = "";
  if (submittedWeeks < expectedWeeks) {
     weekStatus = submittedWeeks < 3 ? " (Kurang Istiqomah)" : " (Tidak Lengkap)";
  }
  doc.text(`${translateText("Total Form Pekan")}: ${submittedWeeks} / ${expectedWeeks}${weekStatus}`, 130, 60);
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
  doc.text(`${translateText("Cirebon")}, ${currentDate}`, 30, ttdY);
  doc.text(translateText("Diperiksa Oleh,"), 30, ttdY + 5);
  doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 30, ttdY + 10);
  doc.text(translateText("Cabang Cirebon 1"), 30, ttdY + 15);
  
  doc.text(translateText("Pejuang Ybs,"), 140, ttdY + 5);

  try {
    const ttdBase64 = await fetchSignatureLogo();
    if (ttdBase64) {
      doc.addImage(ttdBase64, "PNG", 30, ttdY + 18, 35, 15);
    }
  } catch (err) {}

  doc.setFont("helvetica", "bold");
  doc.text(translateText("Ustadz M Hamdani, B.Sc"), 30, ttdY + 38);
  doc.text(translateText(pejuang?.nama || ""), 140, ttdY + 38);

  doc.save(`${translateText("Laporan_Konsolidasi")}_${translateText(pejuang.nama.replace(/\s+/g, "_"))}_${translateText(periodStr).replace(/\s+/g, "_")}.pdf`);
}
