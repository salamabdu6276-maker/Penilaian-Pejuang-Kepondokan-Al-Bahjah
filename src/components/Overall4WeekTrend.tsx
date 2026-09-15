import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';
import { ChecklistFormSubmission } from '../types';

interface Props {
  submissions: ChecklistFormSubmission[];
}

export const Overall4WeekTrend: React.FC<Props> = ({ submissions }) => {
  const chartData = useMemo(() => {
    if (submissions.length === 0) return [];
    
    // Group all submissions by Year-Month-Week
    const grouped: Record<string, { totalScore: number; count: number; label: string; dateSort: number }> = {};
    
    submissions.forEach(s => {
      // 99 means bulanan, skip for weekly trend
      if (s.pekan === 99 || s.pekan === 0) return;
      
      const key = `${s.tahun}-${String(s.bulan).padStart(2, '0')}-W${s.pekan}`;
      if (!grouped[key]) {
        grouped[key] = {
          totalScore: 0,
          count: 0,
          label: `Bln ${s.bulan} Pkn ${s.pekan}`,
          dateSort: (s.tahun * 10000) + (s.bulan * 100) + s.pekan
        };
      }
      grouped[key].totalScore += s.percentage;
      grouped[key].count += 1;
    });

    const arr = Object.values(grouped).sort((a, b) => a.dateSort - b.dateSort);
    // Take the last 4 items (4 weeks)
    const last4 = arr.slice(-4);
    
    return last4.map(item => ({
      name: item.label,
      "Rata-Rata": Math.round(item.totalScore / item.count)
    }));
  }, [submissions]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Tren Rata-Rata Keseluruhan (4 Pekan Terakhir)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi rata-rata performa seluruh pejuang yang sudah submit.
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">
          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      
      <div className="h-64 mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRata" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                labelStyle={{ fontWeight: 'bold', color: '#334155' }}
                formatter={(value: number) => [`${value}%`, 'Skor Rata-Rata']}
              />
              <Area type="monotone" dataKey="Rata-Rata" stroke="#10b981" fillOpacity={1} fill="url(#colorRata)" strokeWidth={3} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data cukup untuk tren 4 pekan.</p>
          </div>
        )}
      </div>
    </div>
  );
};
