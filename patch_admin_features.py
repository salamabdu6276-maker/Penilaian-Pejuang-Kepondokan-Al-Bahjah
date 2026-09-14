import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# 1. Imports
target_imports = """import {
  Users,
  ShieldCheck,"""
replacement_imports = """import {
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,"""
content = content.replace(target_imports, replacement_imports)

# 2. States
target_states = """  const [adminPassword, setAdminPassword] = useState("");
  const [adminSubDivisi, setAdminSubDivisi] = useState(SUB_DIVISI_LIST[0]);"""
replacement_states = """  const [adminPassword, setAdminPassword] = useState("");
  const [adminSubDivisi, setAdminSubDivisi] = useState(SUB_DIVISI_LIST[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);"""
content = content.replace(target_states, replacement_states)

# 3. Export CSV function
target_export = """  const handleEditAdmin = (a: AdminUser) => {"""
replacement_export = """  const handleExportAdminCSV = () => {
    const header = ["ID,Nama,Email,Sub Divisi,Role,Status,Dibuat Pada"];
    const rows = adminList.map(a => 
      `${a.id},"${a.nama}","${a.username}","${a.subDivisi || ''}",${a.role},${a.status},"${new Date(a.createdAt).toLocaleString('id-ID')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + header.concat(rows).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Daftar_Admin_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditAdmin = (a: AdminUser) => {"""
content = content.replace(target_export, replacement_export)

# 4. handleAdminSubmit logic
target_submit = """  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let role: "admin" | "superadmin" = "admin";
    if (editingAdminId) {
       const existingAdmin = adminList.find(a => a.id === editingAdminId);
       if (existingAdmin) role = existingAdmin.role;
    }

    const newAdmin: AdminUser = {"""
replacement_submit = """  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminPassword.length > 0 && adminPassword.length < 6) {
      alert("Password terlalu lemah. Harus memiliki minimal 6 karakter.");
      return;
    }
    
    let role: "admin" | "superadmin" = "admin";
    let existingAvatarUrl = "";
    
    if (editingAdminId) {
       const existingAdmin = adminList.find(a => a.id === editingAdminId);
       if (existingAdmin) {
         role = existingAdmin.role;
         existingAvatarUrl = existingAdmin.avatarUrl || "";
       }
    }

    let finalAvatarUrl = existingAvatarUrl;
    if (!editingAdminId) {
      setIsGeneratingAvatar(true);
      try {
        const res = await fetch("/api/generate-avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: adminNama })
        });
        if (res.ok) {
          const data = await res.json();
          finalAvatarUrl = data.avatarUrl;
        }
      } catch (err) {
        console.warn("Gagal membuat avatar Gemini:", err);
      } finally {
        setIsGeneratingAvatar(false);
      }
    }

    const newAdmin: AdminUser = {"""
content = content.replace(target_submit, replacement_submit)

# Update newAdmin object
target_newAdmin = """    const newAdmin: AdminUser = {
      id: editingAdminId || `adm_${Date.now()}`,
      nama: adminNama.trim(),
      username: adminEmail.trim(), 
      password: adminPassword,
      subDivisi: adminSubDivisi,
      role,
      status: adminStatus
    };

    onSaveAdmin(newAdmin);"""
replacement_newAdmin = """    const newAdmin: AdminUser = {
      id: editingAdminId || `adm_${Date.now()}`,
      nama: adminNama.trim(),
      username: adminEmail.trim(), 
      password: adminPassword,
      subDivisi: adminSubDivisi,
      role,
      status: adminStatus,
      createdAt: editingAdminId ? (adminList.find(a => a.id === editingAdminId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      avatarUrl: finalAvatarUrl
    };

    onSaveAdmin(newAdmin);"""
content = content.replace(target_newAdmin, replacement_newAdmin)

# 5. Show/Hide Password UI
target_pwd_ui = """              <div>
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
replacement_pwd_ui = """              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password (Min. 6 Karakter)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password untuk login"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>"""
content = content.replace(target_pwd_ui, replacement_pwd_ui)

# 6. Button disable state during generation
target_submit_btn = """              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{editingAdminId ? "Simpan Perubahan Admin" : "Daftarkan Admin Baru"}</span>
              </button>"""
replacement_submit_btn = """              <button
                type="submit"
                disabled={isGeneratingAvatar}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                {isGeneratingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isGeneratingAvatar ? "Generate Avatar..." : (editingAdminId ? "Simpan Perubahan Admin" : "Daftarkan Admin Baru")}</span>
              </button>"""
content = content.replace(target_submit_btn, replacement_submit_btn)

# 7. Add Export button
target_admin_list = """            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Daftar Admin Terdaftar ({adminList.length})
              </h3>
            </div>"""
replacement_admin_list = """            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Daftar Admin Terdaftar ({adminList.length})
              </h3>
              <button 
                onClick={handleExportAdminCSV}
                className="flex items-center space-x-1 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors"
                title="Export Admin ke CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>"""
content = content.replace(target_admin_list, replacement_admin_list)

# 8. Display Avatar in List
target_avatar = """                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                        {a.nama.charAt(0)}
                      </div>
                      <div>"""
replacement_avatar = """                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                        {a.avatarUrl ? (
                          <img src={a.avatarUrl} alt={a.nama} className="w-full h-full object-cover" />
                        ) : (
                          a.nama.charAt(0)
                        )}
                      </div>
                      <div>"""
content = content.replace(target_avatar, replacement_avatar)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
