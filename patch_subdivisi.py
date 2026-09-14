import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# 1. Add subdivisiData calculation
calc_target = """  const rekapData = React.useMemo(() => {"""
new_calc = """  const subdivisiAverages = React.useMemo(() => {
    const map: Record<string, { total: number, count: number }> = {};
    pejuangList.forEach(p => {
      if (p.status === "aktif") {
        if (!map[p.subDivisi]) map[p.subDivisi] = { total: 0, count: 0 };
      }
    });

    const rekap = pejuangList.filter(p => p.status === "aktif").map(p => {
      let filteredSubs = [];
      if (reportType === "bulan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "pekan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "rentang") {
        if (startDate && endDate) {
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime() + 86400000;
          filteredSubs = submissions.filter(s => {
            if (!s.updatedAt || s.pejuangId !== p.id) return false;
            const subTime = new Date(s.updatedAt).getTime();
            return subTime >= start && subTime < end;
          });
        }
      }
      
      const count = filteredSubs.length;
      const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
      const expectedCount = reportType === "bulan" ? totalWeeksInMonth : reportType === "pekan" ? 1 : Math.max(1, count);
      const performa = Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);
      return { subDivisi: p.subDivisi, performa };
    });

    rekap.forEach(r => {
      if (map[r.subDivisi]) {
        map[r.subDivisi].total += r.performa;
        map[r.subDivisi].count += 1;
      }
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      Performa: data.count > 0 ? Math.round(data.total / data.count) : 0
    })).sort((a, b) => b.Performa - a.Performa);
  }, [pejuangList, submissions, reportType, selectedMonth, selectedYear, selectedWeek, startDate, endDate]);

  const rekapData = React.useMemo(() => {"""
content = content.replace(calc_target, new_calc)

# 2. Update the charts grid from 1 col to 2 cols and add SubDivisi chart
charts_target = """          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Grafik Top 5 Pejuang (Rata-Rata Tertinggi)</h4>"""
new_charts = """          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Top 5 Pejuang</h4>
                <div className="flex gap-2 print:hidden" data-html2canvas-ignore="true">
                  <button onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportSummaryToPDF(summaryData, reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` : 'Periode', 'Top 5 Pejuang Terbaik');
                  }} className="text-[10px] bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold hover:bg-rose-200">PDF</button>
                  <button onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportToExcel(summaryData, 'Top_5_Pejuang');
                  }} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200">Excel</button>
                </div>
              </div>"""
content = content.replace(charts_target, new_charts)

subdiv_chart_addition = """                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>"""
new_subdiv = """                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm text-center">Rata-Rata Performa Sub-Divisi</h4>
              <div className="h-72 w-full bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subdivisiAverages} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} formatter={(value) => [`${value}%`, 'Rata-rata']} />
                    <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" />
                    <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                      {subdivisiAverages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.Performa >= weeklyTarget ? "#3b82f6" : "#f59e0b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>"""
content = content.replace(subdiv_chart_addition, new_subdiv)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Updated Charts")
