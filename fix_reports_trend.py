import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Let's generate data for the trend chart
trend_data_code = """
  const pejuangTrendData = React.useMemo(() => {
    if (reportType !== "pejuang" || !activePejuang) return [];
    const trend = [];
    for (let i = 1; i <= 5; i++) {
      const sub = monthSubmissions.find(s => s.pekan === i);
      trend.push({
        name: `Pekan ${i}`,
        Performa: sub ? sub.percentage : 0
      });
    }
    return trend;
  }, [reportType, activePejuang, monthSubmissions]);
"""

content = content.replace("  const categoryData = React.useMemo(() => {", trend_data_code + "\n  const categoryData = React.useMemo(() => {")

trend_chart_ui = """
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 mt-6 lg:mt-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Grafik Perkembangan Performa (Bulan Ini)
            </h3>
            <div id="pejuang-monthly-trend-chart" className="h-56 w-full pt-2 bg-white">
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
          </div>
"""

content = content.replace(
    "          {/* Activity Category Graph (8 Cols) */}",
    trend_chart_ui + "\n          {/* Activity Category Graph (8 Cols) */}"
)

# And make sure LineChart and Line are imported from recharts
content = content.replace(
    "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';",
    "import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';"
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
