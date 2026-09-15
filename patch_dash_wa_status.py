import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add statusFilter state
content = content.replace(
    'const [subDivisiFilter, setSubDivisiFilter] = useState<string>("Semua Divisi");',
    'const [subDivisiFilter, setSubDivisiFilter] = useState<string>("Semua Divisi");\n  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "nonaktif">("semua");'
)

# 2. Add statusFilter to activePejuangList logic
target_pejuang_filter = """  const activePejuangList = React.useMemo(() => {
    return subDivisiFilter === "Semua Divisi" 
      ? pejuangList 
      : pejuangList.filter(p => p.subDivisi === subDivisiFilter);
  }, [pejuangList, subDivisiFilter]);"""

new_pejuang_filter = """  const activePejuangList = React.useMemo(() => {
    return pejuangList.filter(p => {
      const matchDivisi = subDivisiFilter === "Semua Divisi" ? true : p.subDivisi === subDivisiFilter;
      const matchStatus = statusFilter === "semua" ? true : p.status === statusFilter;
      return matchDivisi && matchStatus;
    });
  }, [pejuangList, subDivisiFilter, statusFilter]);"""

content = content.replace(target_pejuang_filter, new_pejuang_filter)

# 3. Add Status filter dropdown UI in Dashboard
target_controls = """          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3 lg:justify-end">
            {/* Sub-Divisi Filter */}"""

new_controls = """          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3 lg:justify-end">
            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-3 pr-8 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg py-1.5 font-semibold focus:ring-2 focus:ring-emerald-500 appearance-none outline-none"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>
            </div>
            
            {/* Sub-Divisi Filter */}"""

content = content.replace(target_controls, new_controls)

# 4. Add WA icon import
content = content.replace('MessageSquare,', 'MessageSquare, Phone,') # just in case, but let's just add it manually below
if 'import { MessageCircle } from "lucide-react";' not in content:
    content = content.replace('import { \n  Users,', 'import { MessageCircle, Phone, \n  Users,')

# 5. Add WA Button in historyModalPejuang
target_modal_header = """              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{historyModalPejuang.nama}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{historyModalPejuang.subDivisi} • {historyModalPejuang.amanah}</p>
              </div>
            </div>

            {(() => {"""

new_modal_header = """              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{historyModalPejuang.nama}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{historyModalPejuang.subDivisi} • {historyModalPejuang.amanah}</p>
              </div>
              
              {historyModalPejuang.whatsapp && (
                <button
                  onClick={() => {
                    const latestSub = submissions.filter(s => s.pejuangId === historyModalPejuang.id).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
                    let templateMsg = `Assalamu'alaikum, Pejuang ${historyModalPejuang.nama}. `;
                    if (latestSub) {
                       templateMsg += `Ini adalah info terkait performa checklist Anda untuk pekan ${latestSub.pekan} bulan ${latestSub.bulan}, dengan capaian ${latestSub.percentage}%. `;
                    } else {
                       templateMsg += `Mohon segera mengisi checklist performa Anda.`;
                    }
                    window.open(`https://wa.me/${historyModalPejuang.whatsapp}?text=${encodeURIComponent(templateMsg)}`, '_blank');
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi via WA
                </button>
              )}
            </div>

            {(() => {"""

content = content.replace(target_modal_header, new_modal_header)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
