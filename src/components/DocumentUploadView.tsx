import { triggerHaptic } from '../utils/haptics';
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pejuang, DocumentUpload } from "../types";
import { fetchDocumentUploads, saveDocumentUpload, deleteDocumentUpload } from "../services/dbService";
import { 
  Upload, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  FileUp, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  FileText,
  Filter,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Check,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  Download
} from "lucide-react";
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
  const [subDivisiFilter, setSubDivisiFilter] = useState("semua");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  const currentDate = new Date();
  const [bulan, setBulan] = useState(currentDate.getMonth() + 1);
  const [tahun, setTahun] = useState(currentDate.getFullYear());
  const [pekan, setPekan] = useState(1);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  // Edit modal states
  const [editingDoc, setEditingDoc] = useState<DocumentUpload | null>(null);
  const [editingPejuangId, setEditingPejuangId] = useState("");
  const [editingBulan, setEditingBulan] = useState(1);
  const [editingTahun, setEditingTahun] = useState(currentDate.getFullYear());
  const [editingPekan, setEditingPekan] = useState(1);
  const [editingStatus, setEditingStatus] = useState<'Sudah Setor' | 'Belum Menyerahkan'>('Sudah Setor');
  const [editingFoto1, setEditingFoto1] = useState("");
  const [editingFoto2, setEditingFoto2] = useState("");
  const [editingFoto3, setEditingFoto3] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const editFileInputRef1 = useRef<HTMLInputElement>(null);
  const editFileInputRef2 = useRef<HTMLInputElement>(null);
  const editFileInputRef3 = useRef<HTMLInputElement>(null);

  // Delete modal states
  const [deletingDoc, setDeletingDoc] = useState<DocumentUpload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Photo Preview Lightbox states
  const [previewDoc, setPreviewDoc] = useState<{
    pejuangNama: string;
    subDivisi: string;
    periode: string;
    status: string;
    images: { url: string; label: string }[];
  } | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [previewRotation, setPreviewRotation] = useState<number>(0);

  const handleOpenPreview = (doc: DocumentUpload, initialSlot: 1 | 2 | 3 = 1) => {
    const images: { url: string; label: string }[] = [];
    if (doc.foto1) images.push({ url: doc.foto1, label: 'Foto 1 (Halaman 1)' });
    if (doc.foto2) images.push({ url: doc.foto2, label: 'Foto 2 (Halaman 2)' });
    if (doc.foto3) images.push({ url: doc.foto3, label: 'Foto 3 (Halaman 3)' });

    if (images.length === 0) return;

    let targetIndex = 0;
    if (initialSlot === 1 && doc.foto1) {
      targetIndex = images.findIndex(img => img.url === doc.foto1);
    } else if (initialSlot === 2 && doc.foto2) {
      targetIndex = images.findIndex(img => img.url === doc.foto2);
    } else if (initialSlot === 3 && doc.foto3) {
      targetIndex = images.findIndex(img => img.url === doc.foto3);
    }
    if (targetIndex < 0) targetIndex = 0;

    setPreviewDoc({
      pejuangNama: doc.pejuangNama,
      subDivisi: doc.subDivisi,
      periode: `Bulan ${doc.bulan}/${doc.tahun} • Pekan ${doc.pekan}`,
      status: doc.status,
      images
    });
    setPreviewIndex(targetIndex);
    setPreviewZoom(1);
    setPreviewRotation(0);
    triggerHaptic("light");
  };

  const handleClosePreview = () => {
    setPreviewDoc(null);
    setPreviewZoom(1);
    setPreviewRotation(0);
  };

  // Keyboard navigation for photo preview
  useEffect(() => {
    if (!previewDoc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePreview();
      } else if (e.key === 'ArrowRight') {
        setPreviewIndex(prev => (prev + 1) % previewDoc.images.length);
        setPreviewZoom(1);
        setPreviewRotation(0);
      } else if (e.key === 'ArrowLeft') {
        setPreviewIndex(prev => (prev - 1 + previewDoc.images.length) % previewDoc.images.length);
        setPreviewZoom(1);
        setPreviewRotation(0);
      } else if (e.key === '+' || e.key === '=') {
        setPreviewZoom(prev => Math.min(prev + 0.25, 3));
      } else if (e.key === '-') {
        setPreviewZoom(prev => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        setPreviewZoom(1);
        setPreviewRotation(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewDoc]);

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

  const handleOpenEditModal = (doc: DocumentUpload) => {
    setEditingDoc(doc);
    setEditingPejuangId(doc.pejuangId);
    setEditingBulan(doc.bulan);
    setEditingTahun(doc.tahun);
    setEditingPekan(doc.pekan);
    setEditingStatus(doc.status);
    setEditingFoto1(doc.foto1 || "");
    setEditingFoto2(doc.foto2 || "");
    setEditingFoto3(doc.foto3 || "");
    triggerHaptic("light");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editingPejuangId) return;

    const pejuang = pejuangList.find(p => p.id === editingPejuangId);
    if (!pejuang) return;

    setIsSavingEdit(true);
    try {
      const updatedDoc: DocumentUpload = {
        ...editingDoc,
        pejuangId: pejuang.id,
        pejuangNama: pejuang.nama,
        subDivisi: pejuang.subDivisi,
        bulan: Number(editingBulan),
        tahun: Number(editingTahun),
        pekan: Number(editingPekan),
        status: editingStatus,
        foto1: editingFoto1 || undefined,
        foto2: editingFoto2 || undefined,
        foto3: editingFoto3 || undefined,
      };

      await saveDocumentUpload(updatedDoc);
      setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
      triggerHaptic("success");
      setEditingDoc(null);
    } catch (err) {
      console.error("Error updating document:", err);
      alert("Gagal memperbarui dokumen.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDoc) return;
    setIsDeleting(true);
    try {
      await deleteDocumentUpload(deletingDoc.id);
      setDocuments(prev => prev.filter(d => d.id !== deletingDoc.id));
      triggerHaptic("success");
      setDeletingDoc(null);
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Gagal menghapus dokumen.");
    } finally {
      setIsDeleting(false);
    }
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
        {(() => {
          const subDivisiList = Array.from(new Set(pejuangList.map(p => p.subDivisi).filter(Boolean)));

          const filteredDocuments = documents.filter(d => {
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || (
              d.pejuangNama.toLowerCase().includes(q) ||
              d.subDivisi.toLowerCase().includes(q) ||
              `bulan ${d.bulan}`.includes(q) ||
              `pekan ${d.pekan}`.includes(q) ||
              String(d.tahun).includes(q) ||
              d.status.toLowerCase().includes(q)
            );

            const matchesDivisi = subDivisiFilter === "semua" || d.subDivisi === subDivisiFilter;
            return matchesSearch && matchesDivisi;
          });

          const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / itemsPerPage));
          const validCurrentPage = Math.min(currentPage, totalPages);
          const startIndex = (validCurrentPage - 1) * itemsPerPage;
          const paginatedDocs = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

          const getPageNumbers = () => {
            const pages: (number | string)[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              if (validCurrentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
              } else if (validCurrentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
              } else {
                pages.push(1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages);
              }
            }
            return pages;
          };

          return (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50 gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Riwayat Dokumen Fisik</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Daftar arsip foto bukti checklist yang telah diunggah oleh pengurus.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Filter Sub Divisi */}
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={subDivisiFilter}
                      onChange={(e) => {
                        setSubDivisiFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="semua">Semua Divisi</option>
                      {subDivisiList.map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari nama, bulan, pekan..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm w-full sm:w-56 focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {/* Total Count Badge */}
                  <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider whitespace-nowrap">
                    {filteredDocuments.length} Dokumen
                  </span>
                </div>
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak ada dokumen yang sesuai.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {searchQuery || subDivisiFilter !== "semua" ? "Coba ubah kata kunci pencarian atau filter sub divisi." : "Belum ada riwayat dokumen fisik yang tersimpan."}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="py-3 px-4">Tanggal Setor</th>
                          <th className="py-3 px-4">Nama Pejuang</th>
                          <th className="py-3 px-4">Sub Divisi</th>
                          <th className="py-3 px-4">Periode Form</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Dokumen Fisik</th>
                          <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {paginatedDocs.map(d => (
                          <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                              {new Date(d.waktuSetor!).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{d.pejuangNama}</td>
                            <td className="py-3 px-4 text-xs font-medium text-slate-600 dark:text-slate-300">{d.subDivisi}</td>
                            <td className="py-3 px-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              Bulan {d.bulan}/{d.tahun} &bull; Pekan {d.pekan}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold inline-flex items-center gap-1 ${
                                d.status === 'Sudah Setor' 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'Sudah Setor' ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                {d.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-2">
                                {d.foto1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPreview(d, 1)}
                                    className="relative group block w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:scale-110 hover:border-emerald-500 transition-all shadow-2xs bg-slate-100 dark:bg-slate-700 cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none"
                                    title="Klik untuk pratinjau Foto 1"
                                  >
                                    <img src={d.foto1} className="w-full h-full object-cover" alt="Foto 1" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                      <Eye className="w-3.5 h-3.5" />
                                    </div>
                                  </button>
                                )}
                                {d.foto2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPreview(d, 2)}
                                    className="relative group block w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:scale-110 hover:border-emerald-500 transition-all shadow-2xs bg-slate-100 dark:bg-slate-700 cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none"
                                    title="Klik untuk pratinjau Foto 2"
                                  >
                                    <img src={d.foto2} className="w-full h-full object-cover" alt="Foto 2" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                      <Eye className="w-3.5 h-3.5" />
                                    </div>
                                  </button>
                                )}
                                {d.foto3 && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPreview(d, 3)}
                                    className="relative group block w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:scale-110 hover:border-emerald-500 transition-all shadow-2xs bg-slate-100 dark:bg-slate-700 cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none"
                                    title="Klik untuk pratinjau Foto 3"
                                  >
                                    <img src={d.foto3} className="w-full h-full object-cover" alt="Foto 3" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                      <Eye className="w-3.5 h-3.5" />
                                    </div>
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(d)}
                                  className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
                                  title="Edit Dokumen"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeletingDoc(d);
                                    triggerHaptic("medium");
                                  }}
                                  className="p-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg border border-rose-200 dark:border-rose-800 transition-colors shadow-2xs"
                                  title="Hapus Dokumen"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION CONTROLS */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: Summary Info & Items Per Page */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span>
                        Menampilkan <strong className="text-slate-800 dark:text-slate-200">{filteredDocuments.length > 0 ? startIndex + 1 : 0}</strong> - <strong className="text-slate-800 dark:text-slate-200">{Math.min(startIndex + itemsPerPage, filteredDocuments.length)}</strong> dari <strong className="text-slate-800 dark:text-slate-200">{filteredDocuments.length}</strong> dokumen
                      </span>

                      <div className="flex items-center gap-1.5 ml-0 sm:ml-2 pl-0 sm:pl-3 border-l-0 sm:border-l border-slate-200 dark:border-slate-700">
                        <span>Tampilkan:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          <option value={5}>5 baris</option>
                          <option value={10}>10 baris</option>
                          <option value={20}>20 baris</option>
                          <option value={50}>50 baris</option>
                        </select>
                      </div>
                    </div>

                    {/* Right: Page Navigation Buttons */}
                    <div className="flex items-center gap-1">
                      {/* First Page */}
                      <button
                        type="button"
                        disabled={validCurrentPage === 1}
                        onClick={() => {
                          setCurrentPage(1);
                          triggerHaptic('light');
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                        title="Halaman Pertama"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      {/* Prev */}
                      <button
                        type="button"
                        disabled={validCurrentPage === 1}
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1));
                          triggerHaptic('light');
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                        title="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page Number Buttons */}
                      <div className="flex items-center gap-1 mx-1">
                        {getPageNumbers().map((pg, idx) => {
                          if (pg === '...') {
                            return (
                              <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-400">
                                ...
                              </span>
                            );
                          }
                          const isCurrent = pg === validCurrentPage;
                          return (
                            <button
                              key={`page-${pg}`}
                              type="button"
                              onClick={() => {
                                setCurrentPage(Number(pg));
                                triggerHaptic('light');
                              }}
                              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {pg}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next */}
                      <button
                        type="button"
                        disabled={validCurrentPage === totalPages}
                        onClick={() => {
                          setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          triggerHaptic('light');
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                        title="Halaman Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Last Page */}
                      <button
                        type="button"
                        disabled={validCurrentPage === totalPages}
                        onClick={() => {
                          setCurrentPage(totalPages);
                          triggerHaptic('light');
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                        title="Halaman Terakhir"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* EDIT DOCUMENT MODAL */}
      <AnimatePresence>
        {editingDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-700 relative my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Edit Dokumen Fisik
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Perbarui data pejuang, periode form, status, atau foto arsip fisik.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Nama Pejuang */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Nama Pejuang
                  </label>
                  <select
                    value={editingPejuangId}
                    onChange={(e) => setEditingPejuangId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  >
                    <option value="" disabled>Pilih Pejuang</option>
                    {pejuangList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.subDivisi})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Periode (Bulan, Tahun, Pekan) */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Bulan
                    </label>
                    <select
                      value={editingBulan}
                      onChange={(e) => setEditingBulan(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>
                          {new Date(2024, m - 1).toLocaleString('id-ID', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Tahun
                    </label>
                    <input
                      type="number"
                      min={2020}
                      max={2035}
                      value={editingTahun}
                      onChange={(e) => setEditingTahun(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Pekan Ke-
                    </label>
                    <select
                      value={editingPekan}
                      onChange={(e) => setEditingPekan(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {[1, 2, 3, 4, 5].map(p => (
                        <option key={p} value={p}>Pekan {p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Penyerahan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Status Penyerahan Dokumen
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingStatus('Sudah Setor')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        editingStatus === 'Sudah Setor'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Sudah Setor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingStatus('Belum Menyerahkan')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        editingStatus === 'Belum Menyerahkan'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Belum Menyerahkan</span>
                    </button>
                  </div>
                </div>

                {/* Foto Dokumen Fisik (3 Slots) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Foto Bukti Fisik Form Checklist (Maks. 3 Foto)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Slot 1 */}
                    <div className="relative border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 bg-slate-50 dark:bg-slate-700/30 flex flex-col items-center justify-center min-h-[140px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Foto 1 (Utama)</span>
                      {editingFoto1 ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                          <img src={editingFoto1} alt="Foto 1" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEditingFoto1("")}
                            className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                            title="Hapus Foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => editFileInputRef1.current?.click()}
                          className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                        >
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold">Unggah Foto 1</span>
                        </button>
                      )}
                      <input
                        ref={editFileInputRef1}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setEditingFoto1)}
                      />
                    </div>

                    {/* Slot 2 */}
                    <div className="relative border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 bg-slate-50 dark:bg-slate-700/30 flex flex-col items-center justify-center min-h-[140px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Foto 2 (Opsional)</span>
                      {editingFoto2 ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                          <img src={editingFoto2} alt="Foto 2" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEditingFoto2("")}
                            className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                            title="Hapus Foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => editFileInputRef2.current?.click()}
                          className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                        >
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold">Unggah Foto 2</span>
                        </button>
                      )}
                      <input
                        ref={editFileInputRef2}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setEditingFoto2)}
                      />
                    </div>

                    {/* Slot 3 */}
                    <div className="relative border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 bg-slate-50 dark:bg-slate-700/30 flex flex-col items-center justify-center min-h-[140px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Foto 3 (Opsional)</span>
                      {editingFoto3 ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                          <img src={editingFoto3} alt="Foto 3" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEditingFoto3("")}
                            className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                            title="Hapus Foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => editFileInputRef3.current?.click()}
                          className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                        >
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold">Unggah Foto 3</span>
                        </button>
                      )}
                      <input
                        ref={editFileInputRef3}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setEditingFoto3)}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDoc(null)}
                    disabled={isSavingEdit}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                  >
                    {isSavingEdit ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center relative"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Hapus Arsip Dokumen?
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus arsip dokumen fisik milik <strong className="text-slate-800 dark:text-slate-200">{deletingDoc.pejuangNama}</strong> ({deletingDoc.subDivisi}) untuk periode <span className="font-semibold text-emerald-600">Bulan {deletingDoc.bulan}/{deletingDoc.tahun} Pekan {deletingDoc.pekan}</span>?
                <br />
                <span className="text-rose-500 font-medium">Tindakan ini permanen dan tidak dapat dipulihkan.</span>
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeletingDoc(null)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IN-APP PHOTO PREVIEW LIGHTBOX MODAL */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClosePreview();
            }}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white shadow-xl">
              {/* Document Meta */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold truncate text-slate-100">
                      {previewDoc.pejuangNama}
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 shrink-0">
                      {previewDoc.subDivisi}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      previewDoc.status === 'Sudah Setor'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                    }`}>
                      {previewDoc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {previewDoc.periode} &bull; {previewDoc.images[previewIndex]?.label || `Foto ${previewIndex + 1}`}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Photo Counter Badge */}
                {previewDoc.images.length > 1 && (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hidden sm:inline-block">
                    {previewIndex + 1} / {previewDoc.images.length}
                  </span>
                )}

                {/* Zoom Out */}
                <button
                  type="button"
                  onClick={() => setPreviewZoom(prev => Math.max(0.5, prev - 0.25))}
                  disabled={previewZoom <= 0.5}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Perkecil (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Zoom Level Indicator */}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewZoom(1);
                    setPreviewRotation(0);
                  }}
                  className="text-xs font-mono font-bold px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Klik untuk reset zoom (100%)"
                >
                  {Math.round(previewZoom * 100)}%
                </button>

                {/* Zoom In */}
                <button
                  type="button"
                  onClick={() => setPreviewZoom(prev => Math.min(3, prev + 0.25))}
                  disabled={previewZoom >= 3}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Perbesar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Rotate */}
                <button
                  type="button"
                  onClick={() => setPreviewRotation(prev => (prev + 90) % 360)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Putar 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Download */}
                {previewDoc.images[previewIndex]?.url && (
                  <a
                    href={previewDoc.images[previewIndex].url}
                    download={`Dokumen_${previewDoc.pejuangNama.replace(/\s+/g, '_')}_Foto${previewIndex + 1}.jpg`}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Unduh Gambar"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors ml-1"
                  title="Tutup Pratinjau (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Stage: Image Viewing Area with Next/Prev navigation */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-3 sm:my-4">
              {/* Previous Button */}
              {previewDoc.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewIndex(prev => (prev - 1 + previewDoc.images.length) % previewDoc.images.length);
                    setPreviewZoom(1);
                    setPreviewRotation(0);
                    triggerHaptic("light");
                  }}
                  className="absolute left-2 sm:left-6 z-10 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm shadow-xl hover:scale-110 transition-all"
                  title="Foto Sebelumnya (←)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Main Image */}
              <div 
                className="max-w-full max-h-full flex items-center justify-center p-2 transition-transform duration-150 ease-out"
                style={{
                  transform: `scale(${previewZoom}) rotate(${previewRotation}deg)`
                }}
              >
                <img
                  src={previewDoc.images[previewIndex]?.url}
                  alt={previewDoc.images[previewIndex]?.label || "Dokumen"}
                  className="max-h-[75vh] max-w-[88vw] object-contain rounded-xl shadow-2xl border border-slate-800 select-none"
                  draggable={false}
                />
              </div>

              {/* Next Button */}
              {previewDoc.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewIndex(prev => (prev + 1) % previewDoc.images.length);
                    setPreviewZoom(1);
                    setPreviewRotation(0);
                    triggerHaptic("light");
                  }}
                  className="absolute right-2 sm:right-6 z-10 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm shadow-xl hover:scale-110 transition-all"
                  title="Foto Selanjutnya (→)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Bottom Strip: Thumbnails & Quick Guide */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-white">
              {/* Thumbnail Selector */}
              {previewDoc.images.length > 1 ? (
                <div className="flex items-center gap-2">
                  {previewDoc.images.map((img, idx) => {
                    const isActive = idx === previewIndex;
                    return (
                      <button
                        key={`thumb-${idx}`}
                        type="button"
                        onClick={() => {
                          setPreviewIndex(idx);
                          setPreviewZoom(1);
                          setPreviewRotation(0);
                          triggerHaptic("light");
                        }}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          isActive 
                            ? 'border-emerald-500 scale-105 shadow-md' 
                            : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                        title={img.label}
                      >
                        <img src={img.url} className="w-12 h-10 object-cover" alt={`Thumb ${idx + 1}`} />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center font-bold">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-medium">
                  {previewDoc.images[0]?.label || "Foto Dokumen"}
                </div>
              )}

              {/* Keyboard Hints */}
              <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
                <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">Esc</kbd> Tutup</span>
                {previewDoc.images.length > 1 && (
                  <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">← / →</kbd> Ganti Foto</span>
                )}
                <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">+ / -</kbd> Zoom</span>
                <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-slate-300">0</kbd> Reset</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
