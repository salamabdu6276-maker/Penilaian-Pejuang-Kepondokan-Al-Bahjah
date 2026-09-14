const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const search = `      {/* YEARLY HEATMAP & 12-WEEK TREND */}`;
const replacement = `      {/* PERFORMANCE OVERVIEW CURRENT MONTH */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              Performance Overview: Rata-rata Performa per Pekan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rata-rata persentase performa pejuang pada {GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}</p>
          </div>
        </div>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                formatter={(value) => [\`\${value}%\`, 'Rata-rata Performa']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                {performanceOverviewData.map((entry, index) => (
                  <Cell key={\`cell-\${index}\`} fill={entry.Performa >= 80 ? '#10b981' : entry.Performa >= 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YEARLY HEATMAP & 12-WEEK TREND */}`;

if(code.includes(search)) {
  code = code.replace(search, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log('Replaced successfully');
} else {
  console.log('Not found');
}
