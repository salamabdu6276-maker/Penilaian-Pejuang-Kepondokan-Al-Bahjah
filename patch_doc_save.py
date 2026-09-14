import re

with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

target = """  const [status, setStatus] = useState<'Sudah Setor' | 'Belum Menyerahkan'>("Belum Menyerahkan");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");"""

new = """  const [status, setStatus] = useState<'Sudah Setor' | 'Belum Menyerahkan'>("Belum Menyerahkan");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "completed">("idle");
  const [searchQuery, setSearchQuery] = useState("");"""

content = content.replace(target, new)


target_save = """    await saveDocumentUpload(newDoc);
    setDocuments(prev => [newDoc, ...prev]);
    
    // Reset form except period
    setSelectedPejuangId("");
    setFoto1("");
    setFoto2("");
    setFoto3("");
    setStatus("Belum Menyerahkan");
    setIsLoading(false);
    
    alert("Dokumen berhasil disimpan!");"""

new_save = """    // Simulate progress for animation
    setTimeout(async () => {
      await saveDocumentUpload(newDoc);
      setDocuments(prev => [newDoc, ...prev]);
      
      setUploadStatus("completed");
      setTimeout(() => {
        // Reset form except period
        setSelectedPejuangId("");
        setFoto1("");
        setFoto2("");
        setFoto3("");
        setStatus("Belum Menyerahkan");
        setUploadStatus("idle");
      }, 2000);
    }, 1500);"""

content = content.replace(target_save, new_save)

target_btn = """            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-800 disabled:cursor-wait text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center space-x-2 w-full absolute inset-0 z-10"
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-emerald-500 z-0"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <span className="relative z-10">Uploading...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center space-x-2 relative z-10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Dokumen</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Dummy spacing since absolute children collapse button height */}
              <div className="opacity-0 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Simpan Dokumen</span>
              </div>
            </button>"""

new_btn = """            <button
              type="submit"
              disabled={uploadStatus !== "idle"}
              className="relative overflow-hidden w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-800 disabled:cursor-wait text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {uploadStatus === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center space-x-2 relative z-10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Dokumen</span>
                  </motion.div>
                )}
                {uploadStatus === "uploading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center space-x-2 w-full absolute inset-0 z-10"
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-emerald-500 z-0"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <span className="relative z-10">Uploading...</span>
                  </motion.div>
                )}
                {uploadStatus === "completed" && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center space-x-2 w-full absolute inset-0 z-10 bg-slate-900"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-white">Completed</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Dummy spacing since absolute children collapse button height */}
              <div className="opacity-0 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Simpan Dokumen</span>
              </div>
            </button>"""

content = content.replace(target_btn, new_btn)

# replace setIsLoading(true) with setUploadStatus('uploading')
content = content.replace('setIsLoading(true);', 'setUploadStatus("uploading");')

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
print("Updated DocumentUploadView state")
