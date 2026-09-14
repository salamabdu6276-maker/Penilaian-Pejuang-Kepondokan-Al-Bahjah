import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

modal_code = """
      {/* HISTORY MODAL WITH QUICK NOTES */}
      {historyModalPejuang && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                Riwayat Pejuang & Catatan
              </h3>
              <button 
                onClick={() => setHistoryModalPejuang(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2">{historyModalPejuang.nama}</h4>
              <p className="text-xs text-slate-500 mb-4">{historyModalPejuang.amanah} &bull; {historyModalPejuang.subDivisi}</p>
            </div>

            <div className="space-y-4">
              {/* Quick Notes Section */}
              <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                <label className="block text-xs font-bold text-amber-800 dark:text-amber-500 mb-2 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" /> Quick Notes / Remarks
                </label>
                <textarea
                  className="w-full p-3 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700/50 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                  placeholder="Tambahkan catatan khusus, teguran, atau memo evaluasi untuk pejuang ini..."
                  defaultValue={historyModalPejuang.quickNotes || ""}
                  onBlur={(e) => {
                    const newNotes = e.target.value;
                    if (newNotes !== historyModalPejuang.quickNotes) {
                      const updatedPejuang = { ...historyModalPejuang, quickNotes: newNotes };
                      onSavePejuang(updatedPejuang);
                      setHistoryModalPejuang(updatedPejuang);
                    }
                  }}
                ></textarea>
                <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1.5">Catatan akan tersimpan otomatis saat Anda selesai mengetik (klik di luar kotak).</p>
              </div>

              {/* History Changes Section */}
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm pt-2 border-t border-slate-100 dark:border-slate-700/50">Histori Perubahan Data</h4>
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {historyModalPejuang.history && historyModalPejuang.history.length > 0 ? (
                  historyModalPejuang.history.slice().reverse().map((h, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Perubahan {h.field}</span>
                        <span className="text-[10px] text-slate-500">{new Date(h.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-1">
                        <span className="line-through opacity-70">{h.oldValue}</span>
                        <span className="text-emerald-600 dark:text-emerald-500 font-medium">&rarr; {h.newValue}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">Belum ada riwayat perubahan data untuk pejuang ini.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setHistoryModalPejuang(null)} 
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
"""

target = "    </div>\n  );\n};"
if "HISTORY MODAL WITH QUICK NOTES" not in content:
    content = content.replace(target, modal_code + target)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)

