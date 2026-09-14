import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Update chart
old_chart = """              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Grafik Peringkat Kinerja Seluruh Pejuang</h4>
              <div className="h-72 w-full bg-white" id="rekap-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rekapData.map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>"""

new_chart = """              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Grafik Top 5 Pejuang (Rata-Rata Tertinggi)</h4>
              <div className="h-72 w-full bg-white" id="rekap-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rekapData.slice(0, 5).map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>"""

content = content.replace(old_chart, new_chart)

# Update "Tidak Istiqomah" to "Kurang Istiqomah" logic
old_badge = """                      {d.submissionsCount < d.expectedCount && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200" title={`Hanya mengisi ${d.submissionsCount} dari ${d.expectedCount} pekan yang dinilai`}>
                          Tidak Istiqomah ({d.submissionsCount}/{d.expectedCount})
                        </span>
                      )}"""

new_badge = """                      {d.submissionsCount < d.expectedCount && (
                        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${d.submissionsCount < 3 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`} title={`Hanya mengisi ${d.submissionsCount} dari ${d.expectedCount} pekan yang dinilai`}>
                          {d.submissionsCount < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'} ({d.submissionsCount}/{d.expectedCount})
                        </span>
                      )}"""

content = content.replace(old_badge, new_badge)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

print("Done updating ReportsView.tsx")
