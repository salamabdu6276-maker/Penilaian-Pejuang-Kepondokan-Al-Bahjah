import React, { useState } from "react";
import { AnimatedDeleteButton } from "./AnimatedDeleteButton";
import { 
  UserPlus, History, 
  ShieldCheck, 
  Users, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Plus, 
  Image as ImageIcon,
  Download,
  Eye,
  EyeOff,
  Loader2,
  FileDown
} from "lucide-react";
import CryptoJS from "crypto-js";
import { Pejuang, AdminUser, ChecklistFormSubmission } from "../types";
import { SUB_DIVISI_LIST } from "../utils/defaultTasks";
import { handleFileUpload } from "../utils/file";
import { fetchAppLogo, saveAppLogo, fetchSignatureLogo, saveSignatureLogo } from "../services/dbService";

interface AdminSettingsProps {
  pejuangList: Pejuang[];
  adminList: AdminUser[];
  submissions: ChecklistFormSubmission[];
  onSavePejuang: (pejuang: Pejuang) => void;
  onDeletePejuang: (id: string) => void;
  onSaveAdmin: (admin: AdminUser) => void;
  onDeleteAdmin: (id: string) => void;
  onDeleteAllChecklistsByMonth: (bulan: number, tahun: number) => void;
  onDeleteChecklist: (id: string) => void;
  onLoadSampleData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  pejuangList,
  adminList,
  submissions,
  onSavePejuang,
  onDeletePejuang,
  onSaveAdmin,
  onDeleteAdmin,
  onDeleteAllChecklistsByMonth,
  onDeleteChecklist,
  onLoadSampleData
}) => {
  const [activeTab, setActiveTab] = useState<"pejuang" | "admin" | "riwayat" | "manajemen">("pejuang");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());

  const [appLogo, setAppLogo] = useState<string>("/logo.png");
  const [appSignature, setAppSignature] = useState<string | null>(null);

  React.useEffect(() => {
    fetchAppLogo().then(url => {
      if (url) setAppLogo(url);
    });
    fetchSignatureLogo().then(url => {
      if (url) setAppSignature(url);
    });
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, async (url: string) => {
      setAppLogo(url);
      await saveAppLogo(url);
      alert("Logo berhasil diperbarui! Muat ulang halaman jika logo belum berubah di semua tempat.");
      window.dispatchEvent(new Event("logo-updated"));
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, async (url: string) => {
      setAppSignature(url);
      await saveSignatureLogo(url);
      alert("Tanda tangan berhasil diperbarui!");
    });
  };

  const [weeklyTarget, setWeeklyTarget] = useState<number>(() => {
    return Number(localStorage.getItem("weeklyTarget")) || 80;
  });

  const handleSaveTarget = () => {
    localStorage.setItem("weeklyTarget", weeklyTarget.toString());
    alert("Target ketercapaian berhasil disimpan!");
  };
  // Pejuang Form State
  const [pejuangNama, setPejuangNama] = useState("");
  const [pejuangSubDivisi, setPejuangSubDivisi] = useState(SUB_DIVISI_LIST[0]);
  const [pejuangAmanah, setPejuangAmanah] = useState("");
  const [pejuangWa, setPejuangWa] = useState("");
  const [pejuangStatus, setPejuangStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "nonaktif">("semua");
  const [subDivisiFilter, setSubDivisiFilter] = useState<string>("Semua Divisi");
  const [pejuangFotoUrl, setPejuangFotoUrl] = useState("");
  const [editingPejuangId, setEditingPejuangId] = useState<string | null>(null);
  const [historyModalPejuang, setHistoryModalPejuang] = useState<Pejuang | null>(null);

  // Admin Form State
  const [adminNama, setAdminNama] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSubDivisi, setAdminSubDivisi] = useState(SUB_DIVISI_LIST[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [adminStatus, setAdminStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  // Handle Submit Pejuang
  
  const handlePejuangSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pejuangNama.trim() || !pejuangAmanah.trim()) return;

    let historyToKeep = [];
    if (editingPejuangId) {
       const existingPejuang = pejuangList.find(p => p.id === editingPejuangId);
       if (existingPejuang) {
          historyToKeep = existingPejuang.history || [];
          
          if (existingPejuang.amanah !== pejuangAmanah.trim()) {
            historyToKeep.push({
              date: new Date().toISOString(),
              field: 'Amanah',
              oldValue: existingPejuang.amanah,
              newValue: pejuangAmanah.trim()
            });
          }
          if (existingPejuang.subDivisi !== pejuangSubDivisi) {
            historyToKeep.push({
              date: new Date().toISOString(),
              field: 'Sub Divisi',
              oldValue: existingPejuang.subDivisi,
              newValue: pejuangSubDivisi
            });
          }
       }
    }

    const newPejuang: Pejuang = {
      id: editingPejuangId || `pj_${Date.now()}`,
      nama: pejuangNama.trim(),
      subDivisi: pejuangSubDivisi,
      amanah: pejuangAmanah.trim(),
      fotoUrl: pejuangFotoUrl.trim() || undefined,
      status: pejuangStatus,
      createdAt: new Date().toISOString(),
      history: historyToKeep
    };

    onSavePejuang(newPejuang);

    setPejuangNama("");
    setPejuangAmanah("");
    setPejuangWa("");
    setPejuangFotoUrl("");
    setPejuangStatus("aktif");
    setEditingPejuangId(null);
    alert(`Data Pejuang ${newPejuang.nama} berhasil disimpan.`);
  };

  // Edit Pejuang
  const handleEditPejuang = (p: Pejuang) => {
    setEditingPejuangId(p.id);
    setPejuangNama(p.nama);
    setPejuangSubDivisi(p.subDivisi);
    setPejuangAmanah(p.amanah);
    setPejuangWa(p.whatsapp || "");
    setPejuangFotoUrl(p.fotoUrl || "");
    setPejuangStatus(p.status);
  };

  // Handle Submit Admin
  const handleAdminSubmit = async (e: React.FormEvent) => {
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

    onSaveAdmin(newAdmin);
    setAdminNama("");
    setAdminEmail("");
    setAdminUsername("");
    setAdminPassword("");
    setAdminStatus("aktif");
    setEditingAdminId(null);
    alert(`Admin ${newAdmin.nama} berhasil disimpan.`);
  };

  // Edit Admin
  const handleBulkBackup = () => {
    try {
      const data = {
        pejuangList,
        adminList,
        submissions,
        timestamp: new Date().toISOString()
      };
      
      const jsonStr = JSON.stringify(data);
      // Encrypt with AES
      const secretKey = "albahjah-backup-key"; // Simple static key for demo, ideally prompt for it
      const encrypted = CryptoJS.AES.encrypt(jsonStr, secretKey).toString();
      
      const blob = new Blob([encrypted], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Backup_Sistem_${Date.now()}.enc`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert("Data berhasil di-backup. Simpan file .enc dengan aman.");
    } catch (e) {
      alert("Gagal melakukan backup data.");
    }
  };

  const handleExportAdminCSV = () => {
    const header = ["ID,Nama,Email,Sub Divisi,Role,Status,Dibuat Pada"];
    const rows = adminList.map(a => 
      `${a.id},"${a.nama}","${a.username}","${a.subDivisi || ''}",${a.role},${a.status},"${new Date(a.createdAt).toLocaleString('id-ID')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + header.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Daftar_Admin_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditAdmin = (a: AdminUser) => {
    setEditingAdminId(a.id);
    setAdminNama(a.nama);
    setAdminEmail(a.email || "");
    setAdminUsername(a.username || "");
    setAdminPassword(a.password || "");
    setAdminSubDivisi(a.subDivisi || SUB_DIVISI_LIST[0]);
    setAdminStatus(a.status || "aktif");
  };

  // Filtered lists
  const filteredPejuang = pejuangList.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.subDivisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.amanah.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'semua' ? true : p.status === statusFilter;
    const matchDivisi = subDivisiFilter === "Semua Divisi" ? true : p.subDivisi === subDivisiFilter;
    return matchSearch && matchStatus && matchDivisi;
  });

  return (
    <div id="admin-settings-view" className="space-y-6 pb-12">
      
      {/* Title & Section Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Pengaturan Master Data
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Setting Input Admin Baru & Input Data Pejuang
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola daftar pengurus, sub divisi, dan hak akses administrator Al-Bahjah
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("pejuang")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "pejuang"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Pejuang ({pejuangList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "admin"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin System ({adminList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("manajemen")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "manajemen"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Manajemen Data</span>
          </button>
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
          </button>
        </div>
      </div>

      {/* SECTION 1: PEJUANG MANAGEMENT */}
      {activeTab === "pejuang" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Input Pejuang (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                {editingPejuangId ? "Edit Data Pejuang" : "Input Data Pejuang Baru"}
              </h3>
              {editingPejuangId && (
                <button
                  onClick={() => {
                    setEditingPejuangId(null);
                    setPejuangNama("");
                    setPejuangAmanah("");
    setPejuangWa("");
                    setPejuangFotoUrl("");
                    setPejuangStatus("aktif");
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handlePejuangSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Pejuang</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Rosyad, S.Pd"
                  value={pejuangNama}
                  onChange={(e) => setPejuangNama(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sub Divisi Kepondokan</label>
                <select
                  value={pejuangSubDivisi}
                  onChange={(e) => setPejuangSubDivisi(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  {SUB_DIVISI_LIST.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amanah / Jabatan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kepala Pondok Cabang Cirebon 1"
                  value={pejuangAmanah}
                  onChange={(e) => setPejuangAmanah(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Foto Pejuang (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setPejuangFotoUrl)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
                {pejuangFotoUrl && <div className="mt-2 h-16 w-16 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700"><img src={pejuangFotoUrl} className="w-full h-full object-cover" /></div>}
                <p className="text-[10px] text-slate-400 mt-1">Pilih foto jika ingin mengubah.</p>
              </div>

              {editingPejuangId && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Keaktifan</label>
                  <select
                    value={pejuangStatus}
                    onChange={(e) => setPejuangStatus(e.target.value as "aktif" | "nonaktif")}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="aktif">Aktif (Bertugas)</option>
                    <option value="nonaktif">Non-aktif (Resign / Cuti)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{editingPejuangId ? "Simpan Perubahan Pejuang" : "Tambah Data Pejuang"}</span>
              </button>
            </form>

            {/* Quick Sample Template Loader */}
            {pejuangList.length === 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={onLoadSampleData}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Muat Contoh Template 5 Pejuang Al-Bahjah</span>
                </button>
              </div>
            )}
          </div>

          {/* List Data Pejuang (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Daftar Pejuang Terdaftar ({filteredPejuang.length})
              </h3>

              {/* Search input */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <select
                    value={subDivisiFilter}
                    onChange={(e) => setSubDivisiFilter(e.target.value)}
                    className="pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 appearance-none outline-none"
                  >
                    <option value="Semua Divisi">Semua Divisi</option>
                    {SUB_DIVISI_LIST.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 appearance-none outline-none"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-aktif</option>
                  </select>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari pejuang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs w-full sm:w-48 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {filteredPejuang.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                Data pejuang masih kosong. Silakan gunakan form di samping untuk memasukkan data pejuang.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredPejuang.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/50/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:bg-slate-700/80 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center overflow-hidden border border-emerald-300">
                        {p.fotoUrl ? (
                          <img src={p.fotoUrl} alt={p.nama} className="w-full h-full object-cover" />
                        ) : (
                          p.nama.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.nama}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{p.subDivisi} • {p.amanah}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {p.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {p.history && p.history.length > 0 && (
                        <button
                          onClick={() => setHistoryModalPejuang(p)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Lihat Riwayat Perubahan"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditPejuang(p)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <AnimatedDeleteButton 
                        label="Hapus" 
                        onDelete={() => onDeletePejuang(p.id)} 
                        className="" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SECTION 2: ADMIN MANAGEMENT */}
      {activeTab === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   {/* Add Admin Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  {editingAdminId ? "Edit Admin" : "Setting Input Admin Baru"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mendaftarkan administrator pengelola form checklist</p>
              </div>
              {editingAdminId && (
                <button
                  onClick={() => {
                    setEditingAdminId(null);
                    setAdminNama("");
                    setAdminEmail("");
                    setAdminUsername("");
                    setAdminPassword("");
                    setAdminStatus("aktif");
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Administrator</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ustadz Gunawan, M.Pd"
                  value={adminNama}
                  onChange={(e) => setAdminNama(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sub Divisi Pengawasan</label>
                <select
                  value={adminSubDivisi}
                  onChange={(e) => setAdminSubDivisi(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  {SUB_DIVISI_LIST.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {editingAdminId && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Admin</label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value as "aktif" | "nonaktif")}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-aktif</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isGeneratingAvatar}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                {isGeneratingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isGeneratingAvatar ? "Generate Avatar..." : (editingAdminId ? "Simpan Perubahan Admin" : "Daftarkan Admin Baru")}</span>
              </button>
            </form>
          </div>

          {/* List Admin Users */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 flex justify-between items-center">
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
            </div>

            {adminList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                Belum ada data admin terdaftar. Gunakan form di samping untuk mendaftarkan admin baru.
              </div>
            ) : (
              <div className="space-y-3">
                {adminList.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                        {a.avatarUrl ? (
                          <img src={a.avatarUrl} alt={a.nama} className="w-full h-full object-cover" />
                        ) : (
                          a.nama.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{a.nama}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{a.username} • {a.subDivisi || "Semua Sub Divisi"}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${a.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {a.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md border border-emerald-300">
                        ADMIN
                      </span>
                      <button
                        onClick={() => handleEditAdmin(a)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Admin"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus admin ${a.nama}?`)) {
                            onDeleteAdmin(a.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}


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
                        sub.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400' :
                        sub.status === 'submitted' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400' :
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

      {/* SECTION 3: MANAJEMEN DATA */}
      {activeTab === "manajemen" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          {/* Pengaturan Logo Aplikasi */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Logo Aplikasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unggah logo resmi yang akan digunakan di Dashboard dan Kop Surat Piagam.</p>
            </div>
            
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-2 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 relative overflow-hidden">
                {appLogo ? (
                  <img src={appLogo} alt="App Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-colors w-full text-center">
                Pilih & Unggah Logo Baru
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
          </div>

          
          {/* Pengaturan Tanda Tangan */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                Tanda Tangan Kepala Pondok
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unggah tanda tangan transparan (PNG) untuk laporan PDF otomatis.</p>
            </div>
            
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-48 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-2 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 relative overflow-hidden">
                {appSignature ? (
                  <img src={appSignature} alt="App Signature" className="w-full h-full object-contain" />
                ) : (
                  <Edit3 className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-colors w-full text-center">
                Pilih & Unggah Tanda Tangan
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleSignatureUpload}
                />
              </label>
            </div>
          </div>

          {/* Target Kinerja */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Pengaturan Target Kinerja
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Atur persentase target ketercapaian minimal (default 80%).</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Mingguan (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={handleSaveTarget}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-colors"
              >
                Simpan Target
              </button>
            </div>
          </div>
          
                    {/* Manajemen Data Laporan */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                Manajemen Data Laporan (Hapus Form per Pejuang per Pekan)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hapus laporan form checklist spesifik berdasarkan pejuang dan pekannya jika terjadi kesalahan input.</p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {submissions.sort((a,b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()).map(sub => (
                <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/30 gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{sub.pejuangNama}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bulan: {sub.bulan} | Tahun: {sub.tahun} | Pekan: {sub.pekan}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Performa: {sub.percentage}%</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Hapus form laporan untuk ${sub.pejuangNama} pekan ke-${sub.pekan}?`)) {
                        onDeleteChecklist(sub.id);
                        alert("Laporan berhasil dihapus!");
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Hapus Data
                  </button>
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="text-center p-6 text-slate-500 text-sm">Belum ada laporan form checklist.</div>
              )}
            </div>
          </div>

          {/* Bulk Backup */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <FileDown className="w-5 h-5 text-indigo-600" />
                Backup Data Sistem (Ter-enkripsi)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unduh seluruh data Pejuang, Submissions, dan Admin sebagai satu file ter-enkripsi (.enc).</p>
            </div>
            
            <button
              onClick={handleBulkBackup}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Encrypted Backup</span>
            </button>
          </div>
          {/* Backup Data */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" />
                Backup Data Aplikasi (JSON)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unduh seluruh data (Pejuang, Admin, Checklist) ke file JSON sebagai cadangan lokal.</p>
            </div>
            
            <button
              onClick={() => {
                const data = {
                  exportDate: new Date().toISOString(),
                  pejuangList,
                  adminList,
                  submissions
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `backup_penilaian_pejuang_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Unduh Backup JSON</span>
            </button>
          </div>

          {/* Hapus Data Massal */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                Penghapusan Data Massal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hati-hati! Fitur ini akan menghapus data form checklist pada bulan yang dipilih.</p>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const bulan = parseInt(formData.get("bulan") as string);
                const tahun = parseInt(formData.get("tahun") as string);
                
                if (confirm(`PERINGATAN: Anda yakin ingin menghapus SELURUH data form checklist untuk bulan ${bulan} tahun ${tahun}? Data yang dihapus tidak dapat dikembalikan.`)) {
                  onDeleteAllChecklistsByMonth(bulan, tahun);
                  alert(`Proses penghapusan data form checklist bulan ${bulan} tahun ${tahun} telah dijalankan.`);
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bulan</label>
                  <select name="bulan" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i+1} value={i+1}>{new Date(2000, i, 1).toLocaleString('id-ID', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tahun</label>
                  <select name="tahun" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500" defaultValue={new Date().getFullYear()}>
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                <p className="text-xs text-rose-800 font-medium flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Dengan menekan tombol di bawah, seluruh form checklist dari semua pejuang di bulan tersebut akan dihapus secara permanen dari database.</span>
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Hapus Semua Form Checklist</span>
              </button>
            </form>
          </div>
        </div>
      )}


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
          
                    {/* Manajemen Data Laporan */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                Manajemen Data Laporan (Hapus Form per Pejuang per Pekan)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hapus laporan form checklist spesifik berdasarkan pejuang dan pekannya jika terjadi kesalahan input.</p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {submissions.sort((a,b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()).map(sub => (
                <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/30 gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{sub.pejuangNama}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bulan: {sub.bulan} | Tahun: {sub.tahun} | Pekan: {sub.pekan}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Performa: {sub.percentage}%</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Hapus form laporan untuk ${sub.pejuangNama} pekan ke-${sub.pekan}?`)) {
                        onDeleteChecklist(sub.id);
                        alert("Laporan berhasil dihapus!");
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Hapus Data
                  </button>
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="text-center p-6 text-slate-500 text-sm">Belum ada laporan form checklist.</div>
              )}
            </div>
          </div>

          {/* Bulk Backup */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <FileDown className="w-5 h-5 text-indigo-600" />
                Backup Data Sistem (Ter-enkripsi)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unduh seluruh data Pejuang, Submissions, dan Admin sebagai satu file ter-enkripsi (.enc).</p>
            </div>
            
            <button
              onClick={handleBulkBackup}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Encrypted Backup</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
