import React, { useEffect, useState, useMemo } from 'react';
import { Pejuang } from '../types';
import { fetchSholatAttendances } from '../services/dbService';
import { Loader2, Activity, Download } from 'lucide-react';
import { GREGORIAN_MONTHS_ID } from '../utils/hijri';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface Props {
  pejuangList: Pejuang[];
  selectedMonth: number;
  selectedYear: number;
}

export const SholatAttendanceRecap: React.FC<Props> = ({ pejuangList, selectedMonth, selectedYear }) => {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localMonth, setLocalMonth] = useState(selectedMonth);
  const [localYear, setLocalYear] = useState(selectedYear);

  useEffect(() => {
    setLocalMonth(selectedMonth);
    setLocalYear(selectedYear);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSholatAttendances();
        setAttendances(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const aggregatedData = useMemo(() => {
    const monthStr = `${localYear}-${String(localMonth).padStart(2, '0')}`;
    const filtered = attendances.filter(a => a.date && a.date.startsWith(monthStr));
    
    // Group by pejuangId
    const grouped: Record<string, any> = {};
    pejuangList.forEach(p => {
      if (p.status === 'aktif') {
        grouped[p.id] = { pejuang: p, dzuhur: 0, ashar: 0, maghrib: 0, isya: 0, qiyamul_lail: 0, subuh: 0, totalDays: 0 };
      }
    });

    const datesPerPejuang: Record<string, Set<string>> = {};

    filtered.forEach(a => {
      if (grouped[a.pejuangId]) {
        if (!datesPerPejuang[a.pejuangId]) datesPerPejuang[a.pejuangId] = new Set();
        datesPerPejuang[a.pejuangId].add(a.date);
        
        if (a.dzuhur) grouped[a.pejuangId].dzuhur++;
        if (a.ashar) grouped[a.pejuangId].ashar++;
        if (a.maghrib) grouped[a.pejuangId].maghrib++;
        if (a.isya) grouped[a.pejuangId].isya++;
        if (a.qiyamul_lail) grouped[a.pejuangId].qiyamul_lail++;
        if (a.subuh) grouped[a.pejuangId].subuh++;
      }
    });

    return Object.values(grouped).map(item => {
      item.totalDays = datesPerPejuang[item.pejuang.id]?.size || 0;
      return item;
    }).sort((a, b) => b.totalDays - a.totalDays);

  }, [attendances, localMonth, localYear, pejuangList]);

  const chartData = useMemo(() => {
    let subuh = 0, dzuhur = 0, ashar = 0, maghrib = 0, isya = 0, qiyamul_lail = 0;
    
    aggregatedData.forEach(row => {
      subuh += row.subuh;
      dzuhur += row.dzuhur;
      ashar += row.ashar;
      maghrib += row.maghrib;
      isya += row.isya;
      qiyamul_lail += row.qiyamul_lail;
    });

    return [
      { name: 'Subuh', total: subuh, fill: '#8b5cf6' },
      { name: 'Dzuhur', total: dzuhur, fill: '#f59e0b' },
      { name: 'Ashar', total: ashar, fill: '#f97316' },
      { name: 'Maghrib', total: maghrib, fill: '#ef4444' },
      { name: 'Isya', total: isya, fill: '#3b82f6' },
      { name: 'Qiyamul Lail', total: qiyamul_lail, fill: '#10b981' }
    ];
  }, [aggregatedData]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const monthName = GREGORIAN_MONTHS_ID[localMonth - 1];
    
    doc.setFontSize(16);
    doc.text(`Rekap Kehadiran Sholat - ${monthName} ${localYear}`, 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    const tableData = aggregatedData.filter(d => d.totalDays > 0).map((row, index) => [
      index + 1,
      row.pejuang.nama,
      row.totalDays,
      row.subuh,
      row.dzuhur,
      row.ashar,
      row.maghrib,
      row.isya,
      row.qiyamul_lail
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['No', 'Nama Pejuang', 'Hari', 'Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Q.Lail']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129] }, // emerald-500
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' },
        8: { halign: 'center' },
      }
    });

    doc.save(`Rekap_Sholat_${monthName}_${localYear}.pdf`);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 dark:text-white">Rekap Kehadiran Sholat</h3>
        </div>
        <div className="flex space-x-2">
          {aggregatedData.length > 0 && aggregatedData.some(d => d.totalDays > 0) && (
            <button
              onClick={handleExportPDF}
              className="bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-sm"
              title="Export ke PDF"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}
          <select
            value={localMonth}
            onChange={(e) => setLocalMonth(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            {GREGORIAN_MONTHS_ID.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={localYear}
            onChange={(e) => setLocalYear(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      
      {aggregatedData.length > 0 && aggregatedData.some(d => d.totalDays > 0) ? (
        <div className="space-y-6">
          <div className="h-[280px] bg-slate-50 dark:bg-slate-700/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col">
            <div className="mb-4 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Kehadiran Keseluruhan Bulan Ini</h4>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <th className="py-2 font-semibold">Pejuang</th>
                <th className="py-2 font-semibold text-center">Subuh</th>
                <th className="py-2 font-semibold text-center">Dzuhur</th>
                <th className="py-2 font-semibold text-center">Ashar</th>
                <th className="py-2 font-semibold text-center">Maghrib</th>
                <th className="py-2 font-semibold text-center">Isya</th>
                <th className="py-2 font-semibold text-center">Qiyamul Lail</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.filter(d => d.totalDays > 0).map((row, idx) => (
                <tr key={row.pejuang.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {row.pejuang.nama}
                    <div className="text-[10px] text-slate-400 font-normal">{row.totalDays} hari tercatat</div>
                  </td>
                  <td className="py-3 text-sm text-center text-slate-600 dark:text-slate-300">{row.subuh}</td>
                  <td className="py-3 text-sm text-center text-slate-600 dark:text-slate-300">{row.dzuhur}</td>
                  <td className="py-3 text-sm text-center text-slate-600 dark:text-slate-300">{row.ashar}</td>
                  <td className="py-3 text-sm text-center text-slate-600 dark:text-slate-300">{row.maghrib}</td>
                  <td className="py-3 text-sm text-center text-slate-600 dark:text-slate-300">{row.isya}</td>
                  <td className="py-3 text-sm text-center text-slate-600 dark:text-slate-300">{row.qiyamul_lail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          Belum ada data kehadiran sholat untuk bulan {GREGORIAN_MONTHS_ID[localMonth - 1]} {localYear}.
        </div>
      )}
    </div>
  );
}
