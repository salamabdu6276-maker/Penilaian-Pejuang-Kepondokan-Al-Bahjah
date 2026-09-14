import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """      {/* YEARLY HEATMAP & 12-WEEK TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* 12-Week Trend Chart (12 Cols) */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">"""

replacement = """      {/* YEARLY HEATMAP & 12-WEEK TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Top 3 Divisions 6-Month Trajectory (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Tren 6 Bulan: Top 3 Divisi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pergerakan rata-rata persentase performa</p>
            </div>
          </div>
          <div className="h-64">
            {top3Divisions6MonthData.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={top3Divisions6MonthData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  {top3Divisions6MonthData.topDivs[0] && (
                    <Line type="monotone" dataKey={top3Divisions6MonthData.topDivs[0]} stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  )}
                  {top3Divisions6MonthData.topDivs[1] && (
                    <Line type="monotone" dataKey={top3Divisions6MonthData.topDivs[1]} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  )}
                  {top3Divisions6MonthData.topDivs[2] && (
                    <Line type="monotone" dataKey={top3Divisions6MonthData.topDivs[2]} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data untuk periode ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* 12-Week Trend Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">"""

if "Tren 6 Bulan: Top 3 Divisi" not in content:
    content = content.replace(target, replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
