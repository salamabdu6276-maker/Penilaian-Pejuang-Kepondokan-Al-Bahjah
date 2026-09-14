import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add state
state_code = """
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [overviewViewType, setOverviewViewType] = useState<"weekly" | "monthly" | "quarterly">("weekly");
"""
content = re.sub(r'const \[selectedYear, setSelectedYear\] = useState\(new Date\(\).getFullYear\(\)\);', state_code, content)

# Replace performanceOverviewData
old_overview_data = """  // Performance Overview Data (Current Month by Week)
  const performanceOverviewData = React.useMemo(() => {
    const data = [
      { name: 'Pekan 1', Performa: 0, count: 0 },
      { name: 'Pekan 2', Performa: 0, count: 0 },
      { name: 'Pekan 3', Performa: 0, count: 0 },
      { name: 'Pekan 4', Performa: 0, count: 0 },
      { name: 'Pekan 5', Performa: 0, count: 0 }
    ];
    
    monthSubmissions.forEach(s => {
      if (s.pekan >= 1 && s.pekan <= 5 && activePejuangList.some(p => p.id === s.pejuangId)) {
        data[s.pekan - 1].Performa += s.percentage;
        data[s.pekan - 1].count += 1;
      }
    });

    data.forEach(d => {
      if (d.count > 0) d.Performa = Math.round(d.Performa / d.count);
    });
    return data;
  }, [monthSubmissions, activePejuangList]);"""

new_overview_data = """  // Performance Overview Data (Toggle: Weekly, Monthly, Quarterly)
  const performanceOverviewData = React.useMemo(() => {
    if (overviewViewType === "weekly") {
      const data = [
        { name: 'Pekan 1', Performa: 0, count: 0 },
        { name: 'Pekan 2', Performa: 0, count: 0 },
        { name: 'Pekan 3', Performa: 0, count: 0 },
        { name: 'Pekan 4', Performa: 0, count: 0 },
        { name: 'Pekan 5', Performa: 0, count: 0 }
      ];
      
      monthSubmissions.forEach(s => {
        if (s.pekan >= 1 && s.pekan <= 5 && activePejuangList.some(p => p.id === s.pejuangId)) {
          data[s.pekan - 1].Performa += s.percentage;
          data[s.pekan - 1].count += 1;
        }
      });

      data.forEach(d => {
        if (d.count > 0) d.Performa = Math.round(d.Performa / d.count);
      });
      return data;
    } else if (overviewViewType === "monthly") {
      const data = GREGORIAN_MONTHS_ID.map(month => ({ name: month.substring(0, 3), Performa: 0, count: 0 }));
      
      submissions.forEach(s => {
        if (s.tahun === selectedYear && s.bulan >= 1 && s.bulan <= 12 && activePejuangList.some(p => p.id === s.pejuangId)) {
          data[s.bulan - 1].Performa += s.percentage;
          data[s.bulan - 1].count += 1;
        }
      });
      
      data.forEach(d => {
        if (d.count > 0) d.Performa = Math.round(d.Performa / d.count);
      });
      return data;
    } else if (overviewViewType === "quarterly") {
      const data = [
        { name: 'Q1 (Jan-Mar)', Performa: 0, count: 0 },
        { name: 'Q2 (Apr-Jun)', Performa: 0, count: 0 },
        { name: 'Q3 (Jul-Sep)', Performa: 0, count: 0 },
        { name: 'Q4 (Oct-Dec)', Performa: 0, count: 0 }
      ];
      
      submissions.forEach(s => {
        if (s.tahun === selectedYear && activePejuangList.some(p => p.id === s.pejuangId)) {
          const quarter = Math.ceil(s.bulan / 3);
          if (quarter >= 1 && quarter <= 4) {
            data[quarter - 1].Performa += s.percentage;
            data[quarter - 1].count += 1;
          }
        }
      });
      
      data.forEach(d => {
        if (d.count > 0) d.Performa = Math.round(d.Performa / d.count);
      });
      return data;
    }
    return [];
  }, [overviewViewType, monthSubmissions, submissions, activePejuangList, selectedYear]);"""

content = content.replace(old_overview_data, new_overview_data)

# Update UI to include toggle
old_ui = """      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              Performance Overview: Rata-rata Performa per Pekan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rata-rata persentase performa pejuang pada {GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}</p>
          </div>
        </div>"""

new_ui = """      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              Performance Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rata-rata persentase performa pejuang berdasarkan waktu</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button onClick={() => setOverviewViewType('weekly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${overviewViewType === 'weekly' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Pekan (Bulan Ini)</button>
            <button onClick={() => setOverviewViewType('monthly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${overviewViewType === 'monthly' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Bulan (Tahun Ini)</button>
            <button onClick={() => setOverviewViewType('quarterly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${overviewViewType === 'quarterly' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Kuartal (Tahun Ini)</button>
          </div>
        </div>"""

content = content.replace(old_ui, new_ui)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Done")
