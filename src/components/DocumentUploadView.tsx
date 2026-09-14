import { triggerHaptic } from '../utils/haptics';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pejuang, DocumentUpload } from "../types";
import { fetchDocumentUploads, saveDocumentUpload } from "../services/dbService";
import { Upload, Image as ImageIcon, Save, CheckCircle2, FileUp, Search } from "lucide-react";
import { handleFileUpload } from "../utils/file";

interface DocumentUploadViewProps {
  pejuangList: Pejuang[];
}

export const DocumentUploadView: React.FC<DocumentUploadViewProps> = ({ pejuangList }) => {
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [selectedPejuangId, setSelectedPejuangId] = useState("");
  const [foto1, setFoto1] = useState("");
  const [foto2, setFoto2] = useState("");
  const [foto3, setFoto3] = useState("");
  const [status, setStatus] = useState<'Sudah Setor' | 'Belum Menyerahkan'>("Belum Menyerahkan");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "completed">("idle");
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentDate = new Date();
  const [bulan, setBulan] = useState(currentDate.getMonth() + 1);
  const [tahun, setTahun] = useState(currentDate.getFullYear());
  const [pekan, setPekan] = useState(1);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchDocumentUploads();
      setDocuments(data);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPejuangId) return;

    const pejuang = pejuangList.find(p => p.id === selectedPejuangId);
    if (!pejuang) return;

    setUploadStatus("uploading");
    const newDoc: DocumentUpload = {
      id: `doc_${Date.now()}`,
      pejuangId: pejuang.id,
      pejuangNama: pejuang.nama,
      subDivisi: pejuang.subDivisi,
      foto1,
      foto2,
      foto3,
      bulan,
      tahun,
      pekan,
      status,
      waktuSetor: new Date().toISOString()
    };

    await saveDocumentUpload(newDoc);
    setDocuments(prev => [newDoc, ...prev]);
      triggerHaptic("success");
    
    setFoto1("");
    setFoto2("");
    setFoto3("");
    setStatus("Belum Menyerahkan");
    setSelectedPejuangId("");
    
    if (fileInputRef1.current) fileInputRef1.current.value = '';
    if (fileInputRef2.current) fileInputRef2.current.value = '';
    if (fileInputRef3.current) fileInputRef3.current.value = '';
    
    
    alert("Dokumen berhasil disimpan!");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
            Dokumentasi Fisik
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2.5 flex items-center gap-2">
            <FileUp className="w-6 h-6 text-emerald-600" />
            Upload Dokumen Fisik Form Checklist
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700/50">
            Lampirkan bukti fisik checklist yang telah diisi secara manual untuk arsip digital.
          </p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pejuang</label>
              <select
                value={selectedPejuangId}
                onChange={(e) => setSelectedPejuangId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">-- Pilih Pejuang --</option>
                {pejuangList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama} ({p.subDivisi})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Bulan</label>
                <select value={bulan} onChange={e => setBulan(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500">
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tahun</label>
                <input type="number" value={tahun} onChange={e => setTahun(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pekan</label>
                <select value={pekan} onChange={e => setPekan(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500">
                  <option value={1}>Pekan 1</option>
                  <option value={2}>Pekan 2</option>
                  <option value={3}>Pekan 3</option>
                  <option value={4}>Pekan 4</option>
                  <option value={5}>Pekan 5</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status Penyerahan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Belum Menyerahkan">Belum Menyerahkan</option>
                <option value="Sudah Setor">Sudah Setor</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> Foto Dokumen 1
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef1}
                onChange={(e) => handleFileUpload(e, setFoto1)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-sm"
              />
              {foto1 && <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"><img src={foto1} className="w-full h-full object-cover" /></div>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> Foto Dokumen 2 (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef2}
                onChange={(e) => handleFileUpload(e, setFoto2)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-sm"
              />
              {foto2 && <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"><img src={foto2} className="w-full h-full object-cover" /></div>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> Foto Dokumen 3 (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef3}
                onChange={(e) => handleFileUpload(e, setFoto3)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-sm"
              />
              {foto3 && <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"><img src={foto3} className="w-full h-full object-cover" /></div>}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <button
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
            </button>
          </div>
        </form>
      </div>

      {/* History */}
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
        {documents.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada dokumen tersimpan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-y border-slate-200 dark:border-slate-700 text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama Pejuang</th>
                  <th className="py-3 px-4">Sub Divisi</th>
                  <th className="py-3 px-4">Periode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {documents.filter(d => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return d.pejuangNama.toLowerCase().includes(q) || 
                         d.subDivisi.toLowerCase().includes(q) ||
                         `bulan ${d.bulan}`.includes(q) ||
                         `pekan ${d.pekan}`.includes(q) ||
                         String(d.tahun).includes(q);
                }).map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-xs">{new Date(d.waktuSetor!).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{d.pejuangNama}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">{d.subDivisi}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">Bulan {d.bulan}/{d.tahun} Pekan {d.pekan}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                        d.status === 'Sudah Setor' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex flex-wrap gap-2">
                      {d.foto1 && (
                        <a href={d.foto1} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:opacity-80 transition-opacity shadow-sm bg-slate-100 dark:bg-slate-700" title="Lihat Foto 1">
                          <img src={d.foto1} className="w-full h-full object-cover" alt="Foto 1" />
                        </a>
                      )}
                      {d.foto2 && (
                        <a href={d.foto2} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:opacity-80 transition-opacity shadow-sm bg-slate-100 dark:bg-slate-700" title="Lihat Foto 2">
                          <img src={d.foto2} className="w-full h-full object-cover" alt="Foto 2" />
                        </a>
                      )}
                      {d.foto3 && (
                        <a href={d.foto3} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:opacity-80 transition-opacity shadow-sm bg-slate-100 dark:bg-slate-700" title="Lihat Foto 3">
                          <img src={d.foto3} className="w-full h-full object-cover" alt="Foto 3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
