import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# 1. State variables
target_states = """  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");"""
replacement_states = """  const [adminEmail, setAdminEmail] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");"""
content = content.replace(target_states, replacement_states)

# 2. Edit Admin clear
target_clear = """    setAdminNama("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminStatus("aktif");
    setEditingAdminId(null);"""
replacement_clear = """    setAdminNama("");
    setAdminEmail("");
    setAdminUsername("");
    setAdminPassword("");
    setAdminStatus("aktif");
    setEditingAdminId(null);"""
content = content.replace(target_clear, replacement_clear)

# 3. Cancel edit clear
target_cancel_clear = """                  onClick={() => {
                    setEditingAdminId(null);
                    setAdminNama("");
                    setAdminEmail("");
                    setAdminPassword("");
                    setAdminStatus("aktif");
                  }}"""
replacement_cancel_clear = """                  onClick={() => {
                    setEditingAdminId(null);
                    setAdminNama("");
                    setAdminEmail("");
                    setAdminUsername("");
                    setAdminPassword("");
                    setAdminStatus("aktif");
                  }}"""
content = content.replace(target_cancel_clear, replacement_cancel_clear)

# 4. handleAdminSubmit logic
target_submit = """  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNama.trim() || !adminEmail.trim()) return;

    let role: "superadmin" | "admin" = "admin";
    if (editingAdminId) {
       const existingAdmin = adminList.find(a => a.id === editingAdminId);
       if (existingAdmin) role = existingAdmin.role;
    }

    const newAdmin: AdminUser = {
      id: editingAdminId || `adm_${Date.now()}`,
      nama: adminNama.trim(),
      username: adminEmail.trim(), 
      password: "password",
      subDivisi: adminSubDivisi,
      role: role,
      status: adminStatus,
      createdAt: new Date().toISOString()
    };

    onSaveAdmin(newAdmin);"""
replacement_submit = """  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNama.trim() || !adminEmail.trim() || !adminUsername.trim()) return;

    if (adminPassword.length > 0 && adminPassword.length < 6) {
      alert("Password terlalu lemah. Harus memiliki minimal 6 karakter.");
      return;
    }

    let role: "superadmin" | "admin" = "admin";
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

    const newAdmin: AdminUser = {
      id: editingAdminId || `adm_${Date.now()}`,
      nama: adminNama.trim(),
      username: adminUsername.trim(), 
      email: adminEmail.trim(),
      password: adminPassword,
      subDivisi: adminSubDivisi,
      role: role,
      status: adminStatus,
      createdAt: editingAdminId ? (adminList.find(a => a.id === editingAdminId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      avatarUrl: finalAvatarUrl
    };

    onSaveAdmin(newAdmin);"""
content = content.replace(target_submit, replacement_submit)

# 5. handleEditAdmin mapping
target_edit_mapping = """  const handleEditAdmin = (a: AdminUser) => {
    setEditingAdminId(a.id);
    setAdminNama(a.nama);
    setAdminEmail(a.username);
    setAdminPassword(a.password || "");"""
replacement_edit_mapping = """  const handleEditAdmin = (a: AdminUser) => {
    setEditingAdminId(a.id);
    setAdminNama(a.nama);
    setAdminEmail(a.email || "");
    setAdminUsername(a.username || "");
    setAdminPassword(a.password || "");"""
content = content.replace(target_edit_mapping, replacement_edit_mapping)

# 6. Form UI
target_form = """              <div>
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password (Min. 6 Karakter)</label>"""
replacement_form = """              <div>
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username (Untuk Login)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ustadz.gunawan"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password (Min. 6 Karakter)</label>"""
content = content.replace(target_form, replacement_form)


with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
