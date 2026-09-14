import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

import_statement = 'import { handleFileUpload } from "../utils/file";'
new_import = 'import { handleFileUpload } from "../utils/file";\nimport { fetchAppLogo, saveAppLogo } from "../services/dbService";'

if 'fetchAppLogo' not in content:
    content = content.replace(import_statement, new_import)

state_statement = 'const [weeklyTarget, setWeeklyTarget]'
new_state = """const [appLogo, setAppLogo] = useState<string>("/logo.png");
  React.useEffect(() => {
    fetchAppLogo().then(url => {
      if (url) setAppLogo(url);
    });
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await handleFileUpload(e.target.files[0]);
      setAppLogo(url);
      await saveAppLogo(url);
      alert("Logo berhasil diperbarui! Muat ulang halaman jika logo belum berubah di semua tempat.");
      window.dispatchEvent(new Event("logo-updated"));
    }
  };

  const [weeklyTarget, setWeeklyTarget]"""

if 'const [appLogo' not in content:
    content = content.replace(state_statement, new_state)

target_ui = """          {/* Target Kinerja */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">"""

replace_ui = """          {/* Pengaturan Logo Aplikasi */}
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

          {/* Target Kinerja */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">"""

if 'Pengaturan Logo Aplikasi' not in content:
    content = content.replace(target_ui, replace_ui)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)

