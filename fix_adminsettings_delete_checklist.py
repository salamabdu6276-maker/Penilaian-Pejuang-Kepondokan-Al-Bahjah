import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Update interface
content = content.replace(
    "onDeleteAllChecklistsByMonth: (bulan: number, tahun: number) => void;",
    "onDeleteAllChecklistsByMonth: (bulan: number, tahun: number) => void;\n  onDeleteChecklist: (id: string) => void;"
)

content = content.replace(
    "onDeleteAllChecklistsByMonth,\n  onLoadSampleData",
    "onDeleteAllChecklistsByMonth,\n  onDeleteChecklist,\n  onLoadSampleData"
)

# Add the UI for Manajemen Data Laporan (Hapus Data) inside the activeTab === "manajemen"
ui_code = """          {/* Manajemen Data Laporan */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                Manajemen Data Laporan (Hapus Form per Pejuang per Pekan)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hapus laporan form checklist spesifik berdasarkan pejuang dan pekannya jika terjadi kesalahan input.</p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {submissions.sort((a,b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()).map(sub => (
                <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/30 gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{sub.pejuangNama}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bulan: {sub.bulan} | Tahun: {sub.tahun} | Pekan: {sub.pekan}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Performa: {sub.percentage}%</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Hapus form laporan untuk ${sub.pejuangNama} pekan ke-${sub.pekan}?`)) {
                        onDeleteChecklist(sub.id);
                        alert("Laporan berhasil dihapus!");
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Hapus Data
                  </button>
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="text-center p-6 text-slate-500 text-sm">Belum ada laporan form checklist.</div>
              )}
            </div>
          </div>"""

content = content.replace(
    "{/* Bulk Backup */}",
    ui_code + "\n\n          {/* Bulk Backup */}"
)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
print("Done")
