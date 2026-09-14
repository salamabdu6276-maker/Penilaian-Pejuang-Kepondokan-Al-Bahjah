import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

trend_target = """  const pejuangTrendData = React.useMemo(() => {
    if (reportType !== "pejuang" || !activePejuang) return [];
    
    const pejuangMonthSubs = submissions.filter(s => s.pejuangId === activePejuang.id && s.bulan === selectedMonth && s.tahun === selectedYear);
    const trend = [];
    for (let i = 1; i <= 5; i++) {
      const sub = pejuangMonthSubs.find(s => s.pekan === i);
      trend.push({
        name: `Pekan ${i}`,
        Performa: sub ? sub.percentage : 0
      });
    }
    return trend;
  }, [reportType, activePejuang, submissions, selectedMonth, selectedYear]);"""

new_trend = """  const pejuangTrendData = React.useMemo(() => {
    if (reportType !== "pejuang" || !activePejuang) return [];
    
    const pejuangMonthSubs = submissions.filter(s => s.pejuangId === activePejuang.id && s.bulan === selectedMonth && s.tahun === selectedYear);
    const trend = [];
    for (let i = 1; i <= 5; i++) {
      const sub = pejuangMonthSubs.find(s => s.pekan === i);
      trend.push({
        name: `Pekan ${i}`,
        Performa: sub ? sub.percentage : 0
      });
    }
    return trend;
  }, [reportType, activePejuang, submissions, selectedMonth, selectedYear]);

  const pejuang6MonthTrendData = React.useMemo(() => {
    if (reportType !== "pejuang" || !activePejuang) return [];
    
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i;
      let y = selectedYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      const monthSubs = submissions.filter(s => s.pejuangId === activePejuang.id && s.bulan === m && s.tahun === y);
      const count = monthSubs.length;
      const expectedCount = getWeeksInMonth(y, m);
      const performa = Math.round(monthSubs.reduce((sum, s) => sum + s.percentage, 0) / expectedCount);
      trend.push({
        name: `${GREGORIAN_MONTHS_ID[m - 1].substring(0,3)} ${y}`,
        Performa: performa || 0
      });
    }
    return trend;
  }, [reportType, activePejuang, submissions, selectedMonth, selectedYear]);"""
content = content.replace(trend_target, new_trend)

chart_target = """            <div id="pejuang-monthly-trend-chart" className="h-56 w-full pt-2 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pejuangTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Performa" stroke="#047857" strokeWidth={3} dot={{ r: 4, fill: "#047857" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>"""

new_chart = """            <div id="pejuang-monthly-trend-chart" className="h-56 w-full pt-2 bg-white flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-56">
                <h4 className="text-xs font-bold text-center text-slate-500 mb-2">Performa Mingguan (Bulan Ini)</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pejuangTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Performa" stroke="#047857" strokeWidth={3} dot={{ r: 4, fill: "#047857" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 h-56">
                <h4 className="text-xs font-bold text-center text-slate-500 mb-2">Tren Performa 6 Bulan Terakhir</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pejuang6MonthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Performa" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: "#0ea5e9" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>"""
content = content.replace(chart_target, new_chart)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Updated trend")
