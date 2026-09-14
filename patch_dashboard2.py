import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# 2. Add Yearly Summary data and Heatmap state
target_memo = """  // Weekly Trend Chart Data"""
replacement_memo = """  // Yearly Summary Data (Average score per Sub-Divisi per Month)
  const yearlySummaryData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // Get unique active sub divisi
    const activeSubDivisi = Array.from(new Set(activePejuangList.map(p => p.subDivisi || "Lainnya")));
    
    return months.map(m => {
      const dataPoint: any = { name: GREGORIAN_MONTHS_ID[m - 1].substring(0,3) };
      
      activeSubDivisi.forEach(sd => {
        const subs = submissions.filter(s => s.bulan === m && s.tahun === selectedYear && activePejuangList.find(p => p.id === s.pejuangId)?.subDivisi === sd);
        const avg = subs.length > 0 ? Math.round(subs.reduce((acc, curr) => acc + curr.percentage, 0) / subs.length) : 0;
        dataPoint[sd] = avg;
      });
      
      return dataPoint;
    });
  }, [submissions, selectedYear, activePejuangList]);

  // Heatmap Data (Pejuang vs Week for current month)
  const heatmapData = React.useMemo(() => {
    return activePejuangList.map(p => {
      const pSubs = monthSubmissions.filter(s => s.pejuangId === p.id);
      return {
        pejuang: p,
        w1: pSubs.find(s => s.pekan === 1)?.percentage,
        w2: pSubs.find(s => s.pekan === 2)?.percentage,
        w3: pSubs.find(s => s.pekan === 3)?.percentage,
        w4: pSubs.find(s => s.pekan === 4)?.percentage,
        w5: pSubs.find(s => s.pekan === 5)?.percentage,
      }
    });
  }, [activePejuangList, monthSubmissions]);

  // Weekly Trend Chart Data"""
if 'Yearly Summary Data' not in content:
    content = content.replace(target_memo, replacement_memo)

# 3. Add UI components below "METRICS CARDS"
target_ui = """      {/* 3 MONTHS DIVISION CHART */}"""
replacement_ui = """      {/* YEARLY SUMMARY CHART */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Yearly Summary - Performa Divisi</h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200 uppercase">
            Tahun {selectedYear}
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlySummaryData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                cursor={{fill: 'rgba(226, 232, 240, 0.2)'}}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {Array.from(new Set(activePejuangList.map(p => p.subDivisi || "Lainnya"))).map((sd, idx) => {
                const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
                return <Bar key={sd} dataKey={sd} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONSISTENCY HEATMAP */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 mb-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Consistency Heatmap (Bulan Ini)</h3>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="p-2 text-xs font-bold text-slate-500 w-48 truncate">Nama Pejuang</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 1</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 2</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 3</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 4</th>
                <th className="p-2 text-xs font-bold text-center text-slate-500">Pekan 5</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.pejuang.id}>
                  <td className="p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] bg-slate-50 dark:bg-slate-700/30 rounded-md">
                    {row.pejuang.nama}
                  </td>
                  {[row.w1, row.w2, row.w3, row.w4, row.w5].map((val, idx) => {
                    let bgClass = "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
                    if (val !== undefined) {
                      if (val >= 90) bgClass = "bg-emerald-500 text-white";
                      else if (val >= 75) bgClass = "bg-emerald-400 text-emerald-950";
                      else if (val >= 50) bgClass = "bg-emerald-300 text-emerald-950";
                      else bgClass = "bg-emerald-200 text-emerald-950";
                    }
                    return (
                      <td key={idx} className={`p-2 text-[10px] font-bold text-center rounded-md ${bgClass} transition-colors`}>
                        {val !== undefined ? `${val}%` : '-'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 MONTHS DIVISION CHART */}"""
if 'YEARLY SUMMARY CHART' not in content:
    content = content.replace(target_ui, replacement_ui)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
