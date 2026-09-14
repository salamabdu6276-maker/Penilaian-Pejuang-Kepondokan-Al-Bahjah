import fs from 'fs';

let content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');

// 1. Add preview modal HTML right before the last closing div
const modalHtml = `
      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">{previewTitle}</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-500 hover:text-slate-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    {previewData.length > 0 && Object.keys(previewData[0]).map((k, idx) => (
                      <th key={idx} className="border border-slate-300 p-2">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      {Object.values(row).map((val: any, jdx) => (
                        <td key={jdx} className="border border-slate-200 p-2">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length === 0 && (
                <div className="text-center p-4 text-slate-500">Tidak ada data untuk ditampilkan.</div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs">Batal</button>
              <button onClick={previewAction} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace('    </div>\n  );\n};', modalHtml + '\n    </div>\n  );\n};');

// 2. Add explicit UI message below buttons (approx line 687)
const errorMessageHtml = `
          {role === 'admin' && (
            <button
              onClick={handleTriggerAutoNotification}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
              title="Fitur Notifikasi Otomatis Setiap Akhir Periode Pelaporan"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Notif Akhir Periode</span>
            </button>
          )}
        </div>
        
        {/* Guard Clause Explicit UI Message */}
        {isExportDisabled && (
          <div className="w-full mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            No data found for the selected period. File generation is disabled.
          </div>
        )}
        {exportError && !isExportDisabled && (
          <div className="w-full mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {exportError}
          </div>
        )}
      </div>
`;
content = content.replace(/\{\s*\/\*\s*GRAPH SUMMARY FOR SELECTED PEJUANG\s*\*\/\s*\}/, errorMessageHtml + '\n\n      {/* GRAPH SUMMARY FOR SELECTED PEJUANG */}');
// Actually, it's easier to just do string replacements

fs.writeFileSync('src/components/ReportsView.tsx', content);
