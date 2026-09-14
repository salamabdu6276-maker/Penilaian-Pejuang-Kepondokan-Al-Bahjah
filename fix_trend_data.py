import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

old_code = """
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

new_code = """
  const pejuangTrendData = React.useMemo(() => {
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
"""

content = content.replace(old_code, new_code)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
