import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Add History tab button
target_tab_buttons = """          <button
            onClick={() => setActiveTab("manajemen")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "manajemen"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Manajemen Data</span>
          </button>"""

new_tab_buttons = target_tab_buttons + """
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "riwayat"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>"""

content = content.replace(target_tab_buttons, new_tab_buttons)

# Add Riwayat tab state
content = content.replace('type TabType = "pejuang" | "admin" | "manajemen";', 'type TabType = "pejuang" | "admin" | "manajemen" | "riwayat";')


history_section = """
      {/* SECTION 4: AUDIT TRAIL / RIWAYAT */}
      {activeTab === "riwayat" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                Riwayat Aktivitas & Audit Trail
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mencatat aktivitas submisi form checklist dari user.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="p-4 rounded-tl-xl">Waktu Update (WIB)</th>
                  <th className="p-4">Pejuang Terkait</th>
                  <th className="p-4">Divisi / Amanah</th>
                  <th className="p-4">Aktivitas</th>
                  <th className="p-4 rounded-tr-xl text-center">Status Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {submissions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 50).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(sub.updatedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {sub.pejuangNama}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">{sub.subDivisi}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      Submit Form Checklist (Pekan {sub.pekan}, Bulan {sub.bulan})
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        sub.status === 'tuntas' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400' :
                        sub.status === 'perbaikan' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400' :
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                      Belum ada riwayat aktivitas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
"""

content = content.replace('      {/* SECTION 3: MANAJEMEN DATA */}', history_section + '\n      {/* SECTION 3: MANAJEMEN DATA */}')

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
