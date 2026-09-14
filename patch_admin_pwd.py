import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# 1. State variable
target = """  const [adminNama, setAdminNama] = useState("");
  const [adminEmail, setAdminEmail] = useState("");"""
replacement = """  const [adminNama, setAdminNama] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");"""
content = content.replace(target, replacement)

# 2. handleAdminSubmit
target = """    const newAdmin: AdminUser = {
      id: editingAdminId || `adm_${Date.now()}`,
      nama: adminNama.trim(),
      username: adminEmail.trim(), 
      password: "password",
      subDivisi: adminSubDivisi,
      role,
      status: adminStatus
    };"""
replacement = """    const newAdmin: AdminUser = {
      id: editingAdminId || `adm_${Date.now()}`,
      nama: adminNama.trim(),
      username: adminEmail.trim(), 
      password: adminPassword,
      subDivisi: adminSubDivisi,
      role,
      status: adminStatus
    };"""
content = content.replace(target, replacement)

# 3. handleAdminSubmit clear
target = """    setAdminNama("");
    setAdminEmail("");
    setAdminStatus("aktif");
    setEditingAdminId(null);"""
replacement = """    setAdminNama("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminStatus("aktif");
    setEditingAdminId(null);"""
content = content.replace(target, replacement)

# 4. handleEditAdmin
target = """  const handleEditAdmin = (a: AdminUser) => {
    setEditingAdminId(a.id);
    setAdminNama(a.nama);
    setAdminEmail(a.username);
    setAdminSubDivisi(a.subDivisi || SUB_DIVISI_LIST[0]);"""
replacement = """  const handleEditAdmin = (a: AdminUser) => {
    setEditingAdminId(a.id);
    setAdminNama(a.nama);
    setAdminEmail(a.username);
    setAdminPassword(a.password || "");
    setAdminSubDivisi(a.subDivisi || SUB_DIVISI_LIST[0]);"""
content = content.replace(target, replacement)

# 5. cancel edit clear
target = """                  onClick={() => {
                    setEditingAdminId(null);
                    setAdminNama("");
                    setAdminEmail("");
                    setAdminStatus("aktif");
                  }}"""
replacement = """                  onClick={() => {
                    setEditingAdminId(null);
                    setAdminNama("");
                    setAdminEmail("");
                    setAdminPassword("");
                    setAdminStatus("aktif");
                  }}"""
content = content.replace(target, replacement)

# 6. Form input field
target = """              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email / Akun Login</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin.cirebon1@albahjah.or.id"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>"""
replacement = """              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email / Akun Login</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin.cirebon1@albahjah.or.id"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  placeholder="Password untuk login"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>"""
content = content.replace(target, replacement)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
