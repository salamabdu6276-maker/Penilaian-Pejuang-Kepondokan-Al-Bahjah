import re

with open('src/components/SholatAttendanceRecap.tsx', 'r') as f:
    content = f.read()

# Fix lucide-react imports
if 'Download' not in content:
    content = content.replace("import { Loader2, Activity } from 'lucide-react';", "import { Loader2, Activity, Download } from 'lucide-react';")

# Add jsPDF imports
if 'import jsPDF' not in content:
    content = content.replace("import { GREGORIAN_MONTHS_ID } from '../utils/hijri';", "import { GREGORIAN_MONTHS_ID } from '../utils/hijri';\nimport jsPDF from 'jspdf';\nimport 'jspdf-autotable';")

# Add handleExportPDF function
hook_target = "  if (loading) {"
hook_replacement = """  const handleExportPDF = () => {
    const doc = new jsPDF();
    const monthName = GREGORIAN_MONTHS_ID[localMonth - 1];
    
    doc.setFontSize(16);
    doc.text(`Rekap Kehadiran Sholat - ${monthName} ${localYear}`, 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    const tableData = aggregatedData.filter(d => d.totalDays > 0).map((row, index) => [
      index + 1,
      row.pejuang.nama,
      row.totalDays,
      row.subuh,
      row.dzuhur,
      row.ashar,
      row.maghrib,
      row.isya,
      row.qiyamul_lail
    ]);

    (doc as any).autoTable({
      startY: 35,
      head: [['No', 'Nama Pejuang', 'Hari', 'Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Q.Lail']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129] }, // emerald-500
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' },
        8: { halign: 'center' },
      }
    });

    doc.save(`Rekap_Sholat_${monthName}_${localYear}.pdf`);
  };

  if (loading) {"""
if "handleExportPDF" not in content:
    content = content.replace(hook_target, hook_replacement)

# Add Export Button
button_target = """        <div className="flex space-x-2">
          <select"""
button_replacement = """        <div className="flex space-x-2">
          {aggregatedData.length > 0 && aggregatedData.some(d => d.totalDays > 0) && (
            <button
              onClick={handleExportPDF}
              className="bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-sm"
              title="Export ke PDF"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}
          <select"""
content = content.replace(button_target, button_replacement)

with open('src/components/SholatAttendanceRecap.tsx', 'w') as f:
    f.write(content)
