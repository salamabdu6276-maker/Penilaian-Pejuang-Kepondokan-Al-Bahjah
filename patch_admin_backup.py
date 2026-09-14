import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# 1. Add crypto-js import and FileDown
target_imports = """  Loader2
} from "lucide-react";"""
replacement_imports = """  Loader2,
  FileDown
} from "lucide-react";
import CryptoJS from "crypto-js";"""
content = content.replace(target_imports, replacement_imports)

# 2. Add handleBulkBackup
target_handler = """  const handleExportAdminCSV = () => {"""
replacement_handler = """  const handleBulkBackup = () => {
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

  const handleExportAdminCSV = () => {"""
content = content.replace(target_handler, replacement_handler)

# 3. Add UI Button in "Manajemen Data" Tab
target_ui = """              </button>
            </div>
          </div>"""
replacement_ui = """              </button>
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
          </div>"""
content = content.replace(target_ui, replacement_ui)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
