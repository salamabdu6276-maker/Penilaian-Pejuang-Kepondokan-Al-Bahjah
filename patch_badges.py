import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Rekap Semua Pejuang (Excel)
old_nama_rekap = """                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";

                    return {
                      No: idx + 1,
                      Nama: p.nama,"""

new_nama_rekap = """                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const statusText = reportType === "bulan" && filteredSubs.length < expectedWeeks ? ` (${filteredSubs.length < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${filteredSubs.length}/${expectedWeeks})` : "";

                    return {
                      No: idx + 1,
                      Nama: p.nama + statusText,"""
content = content.replace(old_nama_rekap, new_nama_rekap)


# Rekap Semua Pejuang (PDF) - same signature but with evaluasi
old_nama_rekap2 = """                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const evaluasi = percentage >= 91 ? "Sangat Baik" : percentage >= 76 ? "Baik" : percentage >= 40 ? "Cukup" : "Kurang";

                    return {
                      No: idx + 1,
                      Nama: p.nama,"""

new_nama_rekap2 = """                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const evaluasi = percentage >= 91 ? "Sangat Baik" : percentage >= 76 ? "Baik" : percentage >= 40 ? "Cukup" : "Kurang";
                    const statusText = reportType === "bulan" && filteredSubs.length < expectedWeeks ? ` (${filteredSubs.length < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${filteredSubs.length}/${expectedWeeks})` : "";

                    return {
                      No: idx + 1,
                      Nama: p.nama + statusText,"""
content = content.replace(old_nama_rekap2, new_nama_rekap2)

# Divisi (PDF)
old_divisi_pdf = """                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,"""

new_divisi_pdf = """                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama + (d.submissionsCount < d.expectedCount ? ` (${d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${d.submissionsCount}/${d.expectedCount})` : ""),"""
content = content.replace(old_divisi_pdf, new_divisi_pdf)

# Divisi (Excel)
old_divisi_excel = """                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,"""

new_divisi_excel = """                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama + (d.submissionsCount < d.expectedCount ? ` (${d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'}: ${d.submissionsCount}/${d.expectedCount})` : ""),"""

# Note: The above replace will replace both Divisi occurrences if I just do one replace. Let's adjust so it catches both.
content = content.replace(old_divisi_pdf, new_divisi_pdf)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Updated ReportsView.tsx")
