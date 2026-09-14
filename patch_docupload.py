import re

with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

target1 = """  const [status, setStatus] = useState<'Sudah Setor' | 'Belum Menyerahkan'>("Belum Menyerahkan");
  const [isLoading, setIsLoading] = useState(false);"""

replacement1 = """  const [status, setStatus] = useState<'Sudah Setor' | 'Belum Menyerahkan'>("Belum Menyerahkan");
  const [isLoading, setIsLoading] = useState(false);
  
  const currentDate = new Date();
  const [bulan, setBulan] = useState(currentDate.getMonth() + 1);
  const [tahun, setTahun] = useState(currentDate.getFullYear());
  const [pekan, setPekan] = useState(1);"""

content = content.replace(target1, replacement1)

target2 = """      status,
      waktuSetor: new Date().toISOString()
    };"""

replacement2 = """      bulan,
      tahun,
      pekan,
      status,
      waktuSetor: new Date().toISOString()
    };"""

content = content.replace(target2, replacement2)

target3 = """            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status Penyerahan</label>"""

replacement3 = """            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Bulan</label>
                <select value={bulan} onChange={e => setBulan(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500">
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tahun</label>
                <input type="number" value={tahun} onChange={e => setTahun(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pekan</label>
                <select value={pekan} onChange={e => setPekan(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500">
                  <option value={1}>Pekan 1</option>
                  <option value={2}>Pekan 2</option>
                  <option value={3}>Pekan 3</option>
                  <option value={4}>Pekan 4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status Penyerahan</label>"""

content = content.replace(target3, replacement3)

target4 = """                  <th className="py-3 px-4">Sub Divisi</th>
                  <th className="py-3 px-4">Status</th>"""

replacement4 = """                  <th className="py-3 px-4">Sub Divisi</th>
                  <th className="py-3 px-4">Periode</th>
                  <th className="py-3 px-4">Status</th>"""

content = content.replace(target4, replacement4)

target5 = """                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">{d.subDivisi}</td>
                    <td className="py-3 px-4">"""

replacement5 = """                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">{d.subDivisi}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">Bulan {d.bulan}/{d.tahun} Pekan {d.pekan}</td>
                    <td className="py-3 px-4">"""

content = content.replace(target5, replacement5)

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
