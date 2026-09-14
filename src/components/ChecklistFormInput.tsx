import React, { useState, useEffect } from "react";
import { 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Calendar, 
  User, 
  FileCheck, 
  Clock, 
  Tag, 
  AlertCircle, Copy 
} from "lucide-react";
import { 
  Pejuang, 
  ChecklistFormSubmission, 
  TaskRecord, 
  ChecklistTask 
} from "../types";
import { DEFAULT_CHECKLIST_TASKS } from "../utils/defaultTasks";
import { getWeekPeriodString, GREGORIAN_MONTHS_ID } from "../utils/hijri";

interface ChecklistFormInputProps {
  pejuangList: Pejuang[];
  onSaveSubmission: (submission: ChecklistFormSubmission) => void;
  existingSubmissions: ChecklistFormSubmission[];
}

export const ChecklistFormInput: React.FC<ChecklistFormInputProps> = ({
  pejuangList,
  onSaveSubmission,
  existingSubmissions
}) => {
  const [selectedPejuangId, setSelectedPejuangId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Juni
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Form tasks state
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [newTaskWaktu, setNewTaskWaktu] = useState("");
  const [newTaskUraian, setNewTaskUraian] = useState("");
  const [newTaskKategori, setNewTaskKategori] = useState("A");

  // Duplicate Modal State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateTargetPejuangs, setDuplicateTargetPejuangs] = useState<string[]>([]);


  // Get active week metadata (dates array and period string)
  const weekInfo = getWeekPeriodString(selectedYear, selectedMonth, selectedWeek);

  // Selected pejuang object
  const activePejuang = pejuangList.find(p => p.id === selectedPejuangId);

  // Initialize or load existing checklist when pejuang, month, year, or week changes
  useEffect(() => {
    if (!selectedPejuangId) {
      if (pejuangList.length > 0) {
        setSelectedPejuangId(pejuangList[0].id);
      }
      return;
    }

    // Look for an existing submission for this pejuang, month, year, week
    const existing = existingSubmissions.find(
      s => s.pejuangId === selectedPejuangId &&
           s.bulan === selectedMonth &&
           s.tahun === selectedYear &&
           s.pekan === selectedWeek
    );

    if (existing) {
      setTasks(existing.tasks.map(t => ({
        ...t,
        rencanaChecks: t.rencanaChecks || (t as any).checks || {},
        realisasiChecks: t.realisasiChecks || (t as any).checks || {}
      })));
    } else {
      // Create new default tasks structure
      const initial: TaskRecord[] = DEFAULT_CHECKLIST_TASKS.map(t => ({
        taskId: t.id,
        no: t.no,
        waktu: t.waktu,
        uraian: t.uraian,
        kategori: t.kategori,
        catatan: "",
        rencanaChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {}),
        realisasiChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {})
      }));
      setTasks(initial);
    }
  }, [selectedPejuangId, selectedMonth, selectedYear, selectedWeek, pejuangList, existingSubmissions]);

  // Toggle checkmark for a task and day (Rencana)
  const handleToggleRencana = (taskIndex: number, dayNum: number) => {
    setTasks(prev => {
      const copy = [...prev];
      const task = { ...copy[taskIndex] };
      const current = { ...task.rencanaChecks };
      current[dayNum] = !current[dayNum];
      task.rencanaChecks = current;
      copy[taskIndex] = task;
      return copy;
    });
  };

  // Toggle checkmark for a task and day (Realisasi)
  const handleToggleRealisasi = (taskIndex: number, dayNum: number) => {
    setTasks(prev => {
      const copy = [...prev];
      const task = { ...copy[taskIndex] };
      const current = { ...task.realisasiChecks };
      current[dayNum] = !current[dayNum];
      task.realisasiChecks = current;
      copy[taskIndex] = task;
      return copy;
    });
  };

  
  // Toggle all days for a task (Rencana)
  const handleToggleAllRencanaForTask = (taskIndex: number) => {
    setTasks(prev => {
      const copy = [...prev];
      const task = { ...copy[taskIndex] };
      const allChecked = weekInfo.dates.every(d => task.rencanaChecks?.[d]);
      const newChecks: Record<number, boolean> = {};
      weekInfo.dates.forEach(d => {
        newChecks[d] = !allChecked;
      });
      task.rencanaChecks = newChecks;
      copy[taskIndex] = task;
      return copy;
    });
  };

  // Toggle all days for a task (Realisasi)
  const handleToggleAllDaysForTask = (taskIndex: number) => {
    setTasks(prev => {
      const copy = [...prev];
      const task = { ...copy[taskIndex] };
      const allChecked = weekInfo.dates.every(d => task.realisasiChecks?.[d]);
      const newChecks: Record<number, boolean> = {};
      weekInfo.dates.forEach(d => {
        newChecks[d] = !allChecked;
      });
      task.realisasiChecks = newChecks;
      copy[taskIndex] = task;
      return copy;
    });
  };

  // Update task note
  const handleTaskNoteChange = (taskIndex: number, text: string) => {
    setTasks(prev => {
      const copy = [...prev];
      copy[taskIndex] = { ...copy[taskIndex], catatan: text };
      return copy;
    });
  };

  // Add custom activity
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskUraian.trim()) return;

    const newTask: TaskRecord = {
      taskId: `custom-${Date.now()}`,
      no: tasks.length + 1,
      waktu: newTaskWaktu || "Sesuai Jadwal",
      uraian: newTaskUraian,
      kategori: newTaskKategori,
      catatan: "",
      rencanaChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {}),
      realisasiChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {})
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskWaktu("");
    setNewTaskUraian("");
    setNewTaskKategori("A");
  };

  // Remove activity
  const handleRemoveTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index).map((t, idx) => ({ ...t, no: idx + 1 })));
  };

  // Reset to default tasks
  const handleResetToDefault = () => {
    if (confirm("Kembalikan daftar kegiatan ke 10 tugas standar Al-Bahjah?")) {
      const initial: TaskRecord[] = DEFAULT_CHECKLIST_TASKS.map(t => ({
        taskId: t.id,
        no: t.no,
        waktu: t.waktu,
        uraian: t.uraian,
        kategori: t.kategori,
        catatan: "",
        rencanaChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {}),
        realisasiChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {})
      }));
      setTasks(initial);
    }
  };

  // Calculate statistics
  let totalPossibleChecks = 0;
  let totalChecked = 0;
  const categoryCounts: Record<string, number> = {};

  tasks.forEach(t => {
    weekInfo.dates.forEach(d => {
      const isRencana = t.rencanaChecks && t.rencanaChecks[d];
      const isRealisasi = t.realisasiChecks && t.realisasiChecks[d];

      if (isRencana) {
        totalPossibleChecks++;
        if (isRealisasi) {
          totalChecked++;
          categoryCounts[t.kategori] = (categoryCounts[t.kategori] || 0) + 1;
        }
      }
    });
  });

  const percentage = totalPossibleChecks > 0 ? Math.round((totalChecked / totalPossibleChecks) * 100) : 0;

  // Determine highest category
  let kategoriTertinggi = "A";
  let maxCatCount = -1;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      kategoriTertinggi = cat;
    }
  });


  const handleDuplicatePreviousWeek = () => {
    let targetWeek = selectedWeek - 1;
    let targetMonth = selectedMonth;
    let targetYear = selectedYear;
    
    if (targetWeek === 0) {
      targetMonth -= 1;
      if (targetMonth === 0) {
        targetMonth = 12;
        targetYear -= 1;
      }
      // find the latest week in the previous month (5 or 4) for this pejuang
      const prevMonthSubs = existingSubmissions.filter(s => 
        s.pejuangId === selectedPejuangId && 
        s.bulan === targetMonth && 
        s.tahun === targetYear
      );
      if (prevMonthSubs.length > 0) {
        targetWeek = Math.max(...prevMonthSubs.map(s => s.pekan));
      } else {
        targetWeek = 4; // default assumption if no data
      }
    }

    const prevSubmission = existingSubmissions.find(
      s => s.pejuangId === selectedPejuangId && 
           s.bulan === targetMonth && 
           s.tahun === targetYear && 
           s.pekan === targetWeek
    );

    if (!prevSubmission) {
      alert(`Tidak ditemukan data submission untuk Pekan ${targetWeek} bulan ${GREGORIAN_MONTHS_ID[targetMonth - 1]} ${targetYear}.`);
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menyalin format (termasuk Checklist Rencana) dari Pekan ${targetWeek}? Realisasi akan di-reset.`)) {
      return;
    }

    const prevWeekInfo = getWeekPeriodString(targetYear, targetMonth, targetWeek);

    const newTasks = prevSubmission.tasks.map((prevTask, idx) => {
      const newRencana: Record<number, boolean> = {};
      const newRealisasi: Record<number, boolean> = {};
      
      weekInfo.dates.forEach((date, i) => {
        const prevDate = prevWeekInfo.dates[i];
        // if prevDate is undefined, it means previous week had fewer days, default to false
        newRencana[date] = prevDate ? !!prevTask.rencanaChecks[prevDate] : false;
        newRealisasi[date] = false; // Reset realisasi for new week
      });
      
      return {
         ...prevTask,
         rencanaChecks: newRencana,
         realisasiChecks: newRealisasi
      };
    });

    setTasks(newTasks);
    alert(`Berhasil menyalin format dari Pekan ${targetWeek}!`);
  };

  const handleDuplicatePreviousMonth = () => {
    let targetMonth = selectedMonth - 1;
    let targetYear = selectedYear;
    
    if (targetMonth === 0) {
      targetMonth = 12;
      targetYear -= 1;
    }

    const prevMonthSubmission = existingSubmissions.find(
      s => s.pejuangId === selectedPejuangId && 
           s.bulan === targetMonth && 
           s.tahun === targetYear && 
           s.pekan === selectedWeek
    );

    if (!prevMonthSubmission) {
      alert(`Tidak ditemukan data submission untuk Pekan ${selectedWeek} bulan ${GREGORIAN_MONTHS_ID[targetMonth - 1]} ${targetYear}.`);
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menyalin format (termasuk Checklist Rencana) dari Pekan ${selectedWeek} Bulan ${GREGORIAN_MONTHS_ID[targetMonth - 1]}? Realisasi akan di-reset.`)) {
      return;
    }

    const prevWeekInfo = getWeekPeriodString(targetYear, targetMonth, selectedWeek);

    const newTasks = prevMonthSubmission.tasks.map((prevTask, idx) => {
      const newRencana: Record<number, boolean> = {};
      const newRealisasi: Record<number, boolean> = {};
      
      weekInfo.dates.forEach((date, i) => {
        const prevDate = prevWeekInfo.dates[i];
        newRencana[date] = prevDate ? !!prevTask.rencanaChecks[prevDate] : false;
        newRealisasi[date] = false;
      });
      
      return { 
         ...prevTask, 
         rencanaChecks: newRencana, 
         realisasiChecks: newRealisasi
      };
    });

    setTasks(newTasks);
    alert(`Berhasil menyalin format dari Bulan ${GREGORIAN_MONTHS_ID[targetMonth - 1]}!`);
  };

  const handleDuplicateFormat = () => {
    if (duplicateTargetPejuangs.length === 0) {
      alert("Pilih minimal satu pejuang target.");
      return;
    }
    
    // Copy the format (tasks and rencana, but clear realisasi) to selected pejuangs
    duplicateTargetPejuangs.forEach(targetId => {
      const targetPejuang = pejuangList.find(p => p.id === targetId);
      if (!targetPejuang) return;
      
      const newTasks = tasks.map(t => ({
        ...t,
        realisasiChecks: weekInfo.dates.reduce((acc, d) => ({ ...acc, [d]: false }), {})
      }));
      
      const submissionId = `sub_${targetPejuang.id}_${selectedYear}_${selectedMonth}_w${selectedWeek}`;
      const submission = {
        id: submissionId,
        pejuangId: targetPejuang.id,
        pejuangNama: targetPejuang.nama,
        subDivisi: targetPejuang.subDivisi,
        amanah: targetPejuang.amanah,
        bulan: selectedMonth,
        tahun: selectedYear,
        pekan: selectedWeek,
        periodeStr: weekInfo.str,
        dates: weekInfo.dates,
        tasks: newTasks,
        totalChecked: 0,
        totalPossible: totalPossibleChecks,
        percentage: 0,
        kategoriTertinggi: "A",
        status: "draft" as any,
        updatedAt: new Date().toISOString()
      };
      onSaveSubmission(submission);
    });
    
    setShowDuplicateModal(false);
    setDuplicateTargetPejuangs([]);
    alert(`Berhasil menduplikat format form ke ${duplicateTargetPejuangs.length} Pejuang.`);
  };

  // Submit form
  const handleSaveForm = () => {
    if (!activePejuang) {
      alert("Silakan pilih Pejuang terlebih dahulu.");
      return;
    }

    const submissionId = `sub_${activePejuang.id}_${selectedYear}_${selectedMonth}_w${selectedWeek}`;

    const submission: ChecklistFormSubmission = {
      id: submissionId,
      pejuangId: activePejuang.id,
      pejuangNama: activePejuang.nama,
      subDivisi: activePejuang.subDivisi,
      amanah: activePejuang.amanah,
      bulan: selectedMonth,
      tahun: selectedYear,
      pekan: selectedWeek,
      periodeStr: weekInfo.str,
      dates: weekInfo.dates,
      tasks,
      totalChecked,
      totalPossible: totalPossibleChecks,
      percentage,
      kategoriTertinggi,
      status: "submitted",
      updatedAt: new Date().toISOString()
    };

    onSaveSubmission(submission);
    alert(`Alhamdulillah! Form Checklist harian untuk ${activePejuang.nama} (Pekan ${selectedWeek}) berhasil disimpan ke Firebase.`);
  };

  return (
    <div id="checklist-input-view" className="space-y-6 pb-12">
      
      {/* Header Form Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Form Checklist Pengurus Kepondokan
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Input Checklist Harian Pejuang (Rencana & Realisasi)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Isi data checklist kegiatan rutin bulanan secara presisi sesuai periode pekan
            </p>
          </div>

          <button
            id="btn-duplicate-checklist"
            onClick={() => setShowDuplicateModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all border border-blue-500"
          >
            <Plus className="w-4 h-4" />
            <span>Duplikat Format Checklist</span>
          </button>
        </div>

        {/* Inputs Selection: Pejuang, Month, Year, Pekan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pejuang Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Nama Pejuang
            </label>
            {pejuangList.length === 0 ? (
              <div className="text-xs text-rose-600 font-bold p-2 bg-rose-50 border border-rose-200 rounded-lg">
                Belum ada data pejuang. Tambahkan di menu Setting Admin.
              </div>
            ) : (
              <select
                id="select-pejuang"
                value={selectedPejuangId}
                onChange={(e) => setSelectedPejuangId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-bold text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
              >
                {pejuangList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama} ({p.subDivisi})</option>
                ))}
              </select>
            )}
          </div>

          {/* Amanah & Sub Divisi Info Box */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Amanah & Sub Divisi</label>
            <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold truncate">
              {activePejuang ? `${activePejuang.amanah} • ${activePejuang.subDivisi}` : "Pilih Pejuang"}
            </div>
          </div>

          {/* Month & Year */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Bulan & Tahun
            </label>
            <div className="grid grid-cols-2 gap-1">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl p-2.5"
              >
                {GREGORIAN_MONTHS_ID.map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl p-2.5"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          </div>

          {/* Pekan Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Periode Pekan</label>
            <select
              id="select-pekan"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>Pekan 1 (Tanggal 01 - 07)</option>
              <option value={2}>Pekan 2 (Tanggal 08 - 14)</option>
              <option value={3}>Pekan 3 (Tanggal 15 - 21)</option>
              <option value={4}>Pekan 4 (Tanggal 22 - 28)</option>
              <option value={5}>Pekan 5 (Tanggal 29 - 31)</option>
            </select>
          </div>

        </div>

        {/* Live Score Banner */}
        <div className="bg-emerald-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-700/80 rounded-xl font-bold text-lg text-amber-300 border border-emerald-500/50">
              {percentage}%
            </div>
            <div>
              <p className="text-xs text-emerald-200 font-medium">Periode: {weekInfo.str}</p>
              <h4 className="font-bold text-sm">
                Ketercapaian: {totalChecked} dari {totalPossibleChecks} Ceklis Terisi
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-lg">
              Kat. Utama: {kategoriTertinggi}
            </span>
            <button
              type="button"
              onClick={handleDuplicatePreviousMonth}
              className="text-xs bg-emerald-700 hover:bg-emerald-600 text-emerald-100 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors border border-emerald-500"
              title="Salin rencana & format dari bulan sebelumnya (pekan yang sama)"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplikat Bln Sblm</span>
            </button>
            <button
              type="button"
              onClick={handleDuplicatePreviousWeek}
              className="text-xs bg-emerald-700 hover:bg-emerald-600 text-emerald-100 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors border border-emerald-500"
              title="Salin rencana & format dari pekan sebelumnya"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplikat Pekan Sblm</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors border border-emerald-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 10 Tugas</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHECKLIST TABLE PRINTABLE FORMAT */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Tabel Form Checklist Kepondokan
          </h3>
          <span className="text-xs text-slate-300 italic">
            Centang √ sesuai realisasi pelaksanaan tugas harian
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200 border-collapse">
            <thead>
              <tr className="bg-emerald-800 text-white font-bold border-b border-emerald-900">
                <th className="py-3 px-2 text-center w-8 border-r border-emerald-700">No</th>
                <th className="py-3 px-2 w-28 border-r border-emerald-700">Waktu</th>
                <th className="py-3 px-3 min-w-[240px] border-r border-emerald-700">Uraian Tugas / Kegiatan</th>
                
                {/* Date Columns Header */}
                <th className="py-2 px-1 text-center bg-emerald-900 border-r border-emerald-700" colSpan={weekInfo.dates.length}>
                  <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Ceklis (Rencana & Realisasi)</div>
                  <div className="flex justify-center gap-1 mt-1">
                    {weekInfo.dates.map(d => (
                      <span key={d} className="w-10 text-center font-bold text-xs bg-emerald-800/80 rounded py-0.5">
                        {String(d).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </th>

                <th className="py-3 px-2 text-center w-12 border-r border-emerald-700">Kat.</th>
                <th className="py-3 px-3 min-w-[180px] border-r border-emerald-700">Catatan / Keterangan</th>
                <th className="py-3 px-2 text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:bg-slate-800">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6 + weekInfo.dates.length} className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                    Belum ada daftar kegiatan. Tambahkan kegiatan di bawah atau muat ulang 10 tugas standar Al-Bahjah.
                  </td>
                </tr>
              ) : (
                tasks.map((task, idx) => {
                  const isAllChecked = weekInfo.dates.every(d => task.realisasiChecks && task.realisasiChecks?.[d]);

                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-700/50/80 transition-colors">
                      <td className="py-2.5 px-2 text-center font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">
                        {task.no}
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                        {task.waktu}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col gap-2">
                          <span>{task.uraian}</span>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleAllRencanaForTask(idx)}
                              className="text-[9px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded hover:bg-amber-100 whitespace-nowrap"
                              title="Centang Semua Rencana"
                            >
                              {weekInfo.dates.every(d => task.rencanaChecks?.[d]) ? "Batal Rencana" : "Pilih Rencana"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleAllDaysForTask(idx)}
                              className="text-[9px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded hover:bg-emerald-100 whitespace-nowrap"
                              title="Centang / Hapus Semua Realisasi"
                            >
                              {isAllChecked ? "Batal Realisasi" : "Pilih Realisasi"}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Date Checkboxes */}
                      <td className="py-1.5 px-1 border-r border-slate-200 dark:border-slate-700 bg-emerald-50/20">
                        <div className="flex justify-center gap-1">
                          {weekInfo.dates.map(dayNum => {
                            const isRencana = !!(task.rencanaChecks && task.rencanaChecks[dayNum]);
                            const isRealisasi = !!(task.realisasiChecks && task.realisasiChecks[dayNum]);
                            return (
                              <div key={dayNum} className="flex flex-col space-y-1 w-10 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-0.5 shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => handleToggleRencana(idx, dayNum)}
                                  className={`w-full h-4 rounded text-[9px] font-bold flex items-center justify-center transition-all ${
                                    isRencana ? "bg-amber-400 text-slate-900 dark:text-slate-100 border border-amber-500" : "bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200"
                                  }`}
                                  title="Rencana"
                                >
                                  Rn
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleRealisasi(idx, dayNum)}
                                  className={`w-full h-4 rounded text-[9px] font-bold flex items-center justify-center transition-all ${
                                    isRealisasi ? "bg-emerald-600 text-white border border-emerald-700" : "bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200"
                                  }`}
                                  title="Realisasi"
                                >
                                  Rl
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-700 font-extrabold text-amber-800 bg-amber-50/50">
                        {task.kategori}
                      </td>

                      {/* Notes input */}
                      <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">
                        <input
                          type="text"
                          value={task.catatan}
                          onChange={(e) => handleTaskNoteChange(idx, e.target.value)}
                          placeholder="Catatan..."
                          className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Hapus Kegiatan Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CUSTOM TASK FORM */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          Tambah Kegiatan Khusus Baru
        </h4>

        <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Waktu Kegiatan</label>
            <input
              type="text"
              placeholder="e.g. 05.30-07.30 / 19.30"
              value={newTaskWaktu}
              onChange={(e) => setNewTaskWaktu(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Uraian Tugas / Kegiatan</label>
            <input
              type="text"
              required
              placeholder="e.g. Monitoring Kebersihan Asrama Santri"
              value={newTaskUraian}
              onChange={(e) => setNewTaskUraian(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Kategori</label>
            <select
              value={newTaskKategori}
              onChange={(e) => setNewTaskKategori(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
            >
              {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).concat(Array.from({length: 26}, (_, i) => 'A' + String.fromCharCode(65 + i)), Array.from({length: 3}, (_, i) => 'B' + String.fromCharCode(65 + i))).map(k => (
                <option key={k} value={k}>Kategori {k}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris</span>
            </button>
          </div>
        </form>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 pb-8">
        <button
          type="button"
          onClick={handleSaveForm}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <Save className="w-5 h-5" />
          <span>Simpan Inputan Form Checklist</span>
        </button>
      </div>


      {/* DUPLICATE MODAL */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Duplikat Format Form Checklist</h3>
              <button 
                onClick={() => setShowDuplicateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih Pejuang lain untuk menduplikasi susunan tugas dan rencana dari <strong>{activePejuang?.nama}</strong> pada pekan ini.
            </p>
            
            <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-700/50">
              {pejuangList.filter(p => p.id !== selectedPejuangId && p.status === 'aktif').map(p => (
                <label key={p.id} className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:bg-slate-700/50">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-600 focus:ring-emerald-500"
                    checked={duplicateTargetPejuangs.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDuplicateTargetPejuangs(prev => [...prev, p.id]);
                      } else {
                        setDuplicateTargetPejuangs(prev => prev.filter(id => id !== p.id));
                      }
                    }}
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">{p.nama}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{p.subDivisi}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDuplicateModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDuplicateFormat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
              >
                Terapkan Duplikat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

