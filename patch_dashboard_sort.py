import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add sort state
state_target = """  const [selectedDrilldownPejuang, setSelectedDrilldownPejuang] = useState<Pejuang | null>(null);"""
new_state = """  const [selectedDrilldownPejuang, setSelectedDrilldownPejuang] = useState<Pejuang | null>(null);
  const [heatmapSortBy, setHeatmapSortBy] = useState<"name" | "performance">("performance");"""
content = content.replace(state_target, new_state)

# Update heatmapData
heatmap_target = """  // Heatmap Data (Pejuang vs Week for current month)
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
      };
    });
  }, [activePejuangList, monthSubmissions]);"""

new_heatmap = """  // Heatmap Data (Pejuang vs Week for current month)
  const heatmapData = React.useMemo(() => {
    const data = activePejuangList.map(p => {
      const pSubs = monthSubmissions.filter(s => s.pejuangId === p.id);
      return {
        pejuang: p,
        w1: pSubs.find(s => s.pekan === 1)?.percentage,
        w2: pSubs.find(s => s.pekan === 2)?.percentage,
        w3: pSubs.find(s => s.pekan === 3)?.percentage,
        w4: pSubs.find(s => s.pekan === 4)?.percentage,
        w5: pSubs.find(s => s.pekan === 5)?.percentage,
        currentWeekScore: pSubs.find(s => s.pekan === selectedWeek)?.percentage || 0
      };
    });

    if (heatmapSortBy === "name") {
      return data.sort((a, b) => a.pejuang.nama.localeCompare(b.pejuang.nama));
    } else {
      return data.sort((a, b) => b.currentWeekScore - a.currentWeekScore);
    }
  }, [activePejuangList, monthSubmissions, heatmapSortBy, selectedWeek]);"""
content = content.replace(heatmap_target, new_heatmap)

# Add Toggle to Heatmap Header
header_target = """        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Consistency Heatmap (Bulan Ini)</h3>
          </div>
        </div>"""

new_header = """        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Consistency Heatmap (Bulan Ini)</h3>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button 
              onClick={() => setHeatmapSortBy("performance")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${heatmapSortBy === "performance" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              By Performa (Pekan {selectedWeek})
            </button>
            <button 
              onClick={() => setHeatmapSortBy("name")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${heatmapSortBy === "name" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Alphabetical
            </button>
          </div>
        </div>"""
content = content.replace(header_target, new_header)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Updated Dashboard sorting")
