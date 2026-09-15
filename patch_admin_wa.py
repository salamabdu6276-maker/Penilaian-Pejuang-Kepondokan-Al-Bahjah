import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# 1. Add state for WA
content = content.replace(
    'const [pejuangAmanah, setPejuangAmanah] = useState("");',
    'const [pejuangAmanah, setPejuangAmanah] = useState("");\n  const [pejuangWa, setPejuangWa] = useState("");'
)

# 2. Add WA to handleSavePejuang
handle_save_target = """    const newPejuang: Pejuang = {
      id: editingPejuangId || `pejuang_${Date.now()}`,
      nama: pejuangNama,
      subDivisi: pejuangSubDivisi,
      amanah: pejuangAmanah,
      fotoUrl: pejuangFotoUrl,
      status: pejuangStatus,
      createdAt: editingPejuangId ? pejuangList.find(p => p.id === editingPejuangId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };"""

handle_save_new = """    const newPejuang: Pejuang = {
      id: editingPejuangId || `pejuang_${Date.now()}`,
      nama: pejuangNama,
      subDivisi: pejuangSubDivisi,
      amanah: pejuangAmanah,
      whatsapp: pejuangWa,
      fotoUrl: pejuangFotoUrl,
      status: pejuangStatus,
      createdAt: editingPejuangId ? pejuangList.find(p => p.id === editingPejuangId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };"""

content = content.replace(handle_save_target, handle_save_new)

# 3. Reset WA on save and cancel
content = content.replace('setPejuangAmanah("");', 'setPejuangAmanah("");\n    setPejuangWa("");')

# 4. Set WA on edit
content = content.replace(
    'setPejuangAmanah(p.amanah);',
    'setPejuangAmanah(p.amanah);\n    setPejuangWa(p.whatsapp || "");'
)

# 5. Add UI Input for WA
ui_target = """              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Keaktifan</label>"""
ui_new = """              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. 628123456789"
                  value={pejuangWa}
                  onChange={(e) => setPejuangWa(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Keaktifan</label>"""
content = content.replace(ui_target, ui_new)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
