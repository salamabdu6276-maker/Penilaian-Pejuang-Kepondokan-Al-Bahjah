import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add state
if 'const [filterSubDivisi' not in content:
    content = content.replace('  const [selectedCertData', '  const [filterSubDivisi, setFilterSubDivisi] = useState<string>("Semua Divisi");\n  const [selectedCertData')

# Update month filtering UI
target_ui = """                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bulan</label>
                <select
                  value={selectedMonth}"""

replace_ui = """                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter Divisi</label>
                <select
                  value={filterSubDivisi}
                  onChange={(e) => setFilterSubDivisi(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white text-sm rounded-lg px-3 py-2 w-full md:w-auto"
                >
                  <option value="Semua Divisi">Semua Divisi</option>
                  {Array.from(new Set(pejuangList.map(p => p.subDivisi))).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bulan</label>
                <select
                  value={selectedMonth}"""

if 'value={filterSubDivisi}' not in content:
    content = content.replace(target_ui, replace_ui)

# Apply filter to rekapData
target_rekap = '          const filteredPejuang = pejuangList.filter(p => {\n            const nameMatch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());\n            return nameMatch;\n          });'

replace_rekap = '          const filteredPejuang = pejuangList.filter(p => {\n            const nameMatch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());\n            const divisiMatch = filterSubDivisi === "Semua Divisi" || p.subDivisi === filterSubDivisi;\n            return nameMatch && divisiMatch;\n          });'

if 'const divisiMatch' not in content:
    content = content.replace(target_rekap, replace_rekap)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

