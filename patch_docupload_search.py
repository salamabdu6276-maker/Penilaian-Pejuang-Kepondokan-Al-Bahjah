import re

with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

target1 = """import { Upload, Image as ImageIcon, Save, CheckCircle2, FileUp } from "lucide-react";"""
replacement1 = """import { Upload, Image as ImageIcon, Save, CheckCircle2, FileUp, Search } from "lucide-react";"""
content = content.replace(target1, replacement1)

target2 = """  const [isLoading, setIsLoading] = useState(false);"""
replacement2 = """  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");"""
content = content.replace(target2, replacement2)

target3 = """      {/* History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
            <span>Riwayat Dokumen Fisik</span>
          </h3>
          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {documents.length} Arsip
          </span>
        </div>
        {documents.length === 0 ? ("""
replacement3 = """      {/* History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50 gap-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
            <span>Riwayat Dokumen Fisik</span>
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, bulan, atau pekan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
              />
            </div>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1.5 rounded-md uppercase tracking-wider whitespace-nowrap">
              {documents.filter(d => {
                const q = searchQuery.toLowerCase();
                return d.pejuangNama.toLowerCase().includes(q) || 
                       d.subDivisi.toLowerCase().includes(q) ||
                       `bulan ${d.bulan}`.includes(q) ||
                       `pekan ${d.pekan}`.includes(q);
              }).length} Arsip
            </span>
          </div>
        </div>
        {documents.length === 0 ? ("""
content = content.replace(target3, replacement3)

target4 = """              <tbody className="divide-y divide-slate-100">
                {documents.map(d => ("""
replacement4 = """              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {documents.filter(d => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return d.pejuangNama.toLowerCase().includes(q) || 
                         d.subDivisi.toLowerCase().includes(q) ||
                         `bulan ${d.bulan}`.includes(q) ||
                         `pekan ${d.pekan}`.includes(q) ||
                         String(d.tahun).includes(q);
                }).map(d => ("""
content = content.replace(target4, replacement4)

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
