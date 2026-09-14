import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    "fetchAppLogo, saveAppLogo",
    "fetchAppLogo, saveAppLogo, fetchSignatureLogo, saveSignatureLogo"
)

# Add state
state_code = """
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [appSignature, setAppSignature] = useState<string | null>(null);
"""
content = re.sub(r'const \[appLogo, setAppLogo\] = useState<string \| null>\(null\);', state_code, content)

# Add load data
load_code = """
      const logo = await fetchAppLogo();
      if (logo) setAppLogo(logo);
      const sig = await fetchSignatureLogo();
      if (sig) setAppSignature(sig);
"""
content = re.sub(r'const logo = await fetchAppLogo\(\);\s*if \(logo\) setAppLogo\(logo\);', load_code, content)

# Add handler
handler_code = """
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setAppLogo(base64);
        await saveAppLogo(base64);
        alert("Logo berhasil disimpan!");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setAppSignature(base64);
        await saveSignatureLogo(base64);
        alert("Tanda Tangan berhasil disimpan!");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
"""
content = re.sub(r'const handleLogoUpload = async \(e: React.ChangeEvent<HTMLInputElement>\) => \{.*?\};\n\s*reader.readAsDataURL\(e.target.files\[0\]\);\n\s*\}\n\s*\};', handler_code, content, flags=re.DOTALL)

# Add UI for signature
sig_ui = """
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
"""

content = content.replace("{/* Target Kinerja */}", sig_ui + "\n          {/* Target Kinerja */}")

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
print("Done")
