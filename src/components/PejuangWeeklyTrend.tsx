import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, User } from 'lucide-react';
import { Pejuang, ChecklistFormSubmission } from '../types';

interface Props {
  pejuangList: Pejuang[];
  submissions: ChecklistFormSubmission[];
}

export const PejuangWeeklyTrend: React.FC<Props> = ({ pejuangList, submissions }) => {
  const activePejuang = pejuangList.filter(p => p.status === 'aktif');
  const [selectedPejuangId, setSelectedPejuangId] = useState<string>(activePejuang.length > 0 ? activePejuang[0].id : '');

  const chartData = useMemo(() => {
    if (!selectedPejuangId) return [];

    // Find submissions for the selected pejuang
    const pejuangSubmissions = submissions.filter(s => s.pejuangId === selectedPejuangId);

    // Sort by year, month, pekan ascending
    pejuangSubmissions.sort((a, b) => {
      if (a.tahun !== b.tahun) return a.tahun - b.tahun;
      if (a.bulan !== b.bulan) return a.bulan - b.bulan;
      return a.pekan - b.pekan;
    });

    // Take the last 5 submissions
    const last5 = pejuangSubmissions.slice(-5);

    return last5.map(s => ({
      name: `Bln ${s.bulan} Pkn ${s.pekan}`,
      persentase: s.percentage,
      periodeStr: s.periodeStr
    }));
  }, [selectedPejuangId, submissions]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Tren Performa Pejuang (5 Pekan Terakhir)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lacak perkembangan persentase performa individu.</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-slate-400" />
          <select
            value={selectedPejuangId}
            onChange={(e) => setSelectedPejuangId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            {activePejuang.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-64 mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                labelStyle={{ fontWeight: 'bold', color: '#334155' }}
                formatter={(value: number) => [`${value}%`, 'Persentase']}
                labelFormatter={(label, payload) => {
                   if (payload && payload.length > 0) {
                     return payload[0].payload.periodeStr;
                   }
                   return label;
                }}
              />
              <Line type="monotone" dataKey="persentase" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data tervalidasi untuk pejuang ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};
