import re

with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

target = """            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2"
                  >
                    <span>Uploading...</span>
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-emerald-400"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Dokumen</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>"""

new = """            <button
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

content = content.replace(target, new)

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
print("Updated DocumentUploadView button animation")
