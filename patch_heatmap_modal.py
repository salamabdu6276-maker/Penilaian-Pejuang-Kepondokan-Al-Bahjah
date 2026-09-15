import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """      {/* MODAL HIStORICAL PERFORMANCE */}"""

# We'll calculate the bar chart data based on tasks: grouped by kategori
new_modal = """      {/* MODAL HEATMAP ACTIVITIES BAR CHART */}
      {heatmapModalSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Detail Kegiatan - {heatmapModalSubmission.pejuangNama}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pekan {heatmapModalSubmission.pekan} • Bulan {heatmapModalSubmission.bulan} • {heatmapModalSubmission.percentage}%</p>
              </div>
              <button 
                onClick={() => setHeatmapModalSubmission(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  // Aggregate tasks by Kategori
                  const catMap: Record<string, { totalPossible: number, totalChecked: number }> = {};
                  heatmapModalSubmission.tasks.forEach(t => {
                     const cat = t.kategori || "A";
                     if (!catMap[cat]) catMap[cat] = { totalPossible: 0, totalChecked: 0 };
                     
                     // count how many days were checked vs possible
                     const daysCount = heatmapModalSubmission.dates.length;
                     catMap[cat].totalPossible += daysCount;
                     
                     let checks = 0;
                     heatmapModalSubmission.dates.forEach(d => {
                        if (t.realisasiChecks[d]) checks++;
                     });
                     catMap[cat].totalChecked += checks;
                  });
                  
                  const barData = Object.entries(catMap).map(([cat, data]) => ({
                     name: `Kategori ${cat}`,
                     Persentase: data.totalPossible > 0 ? Math.round((data.totalChecked / data.totalPossible) * 100) : 0,
                     Checked: data.totalChecked,
                     Possible: data.totalPossible
                  })).sort((a,b) => a.name.localeCompare(b.name));
                  
                  return (
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === "Persentase") return [`${value}% (${props.payload.Checked}/${props.payload.Possible})`, 'Ketercapaian'];
                          return [value, name];
                        }}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="Persentase" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Persentase >= 80 ? '#10b981' : entry.Persentase >= 60 ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  )
                })()}
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700/50">
               <button 
                  onClick={() => setHeatmapModalSubmission(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
               >
                  Tutup
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HIStORICAL PERFORMANCE */}"""

content = content.replace(target, new_modal)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
