import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

data_logic = """  // Top 3 Divisions 6-Month Trajectory
  const top3Divisions6MonthData = React.useMemo(() => {
    // Determine the last 6 months (including current month)
    const monthsData: { year: number, month: number, name: string }[] = [];
    let cMonth = selectedMonth;
    let cYear = selectedYear;
    for (let i = 0; i < 6; i++) {
      monthsData.unshift({ year: cYear, month: cMonth, name: `${GREGORIAN_MONTHS_ID[cMonth - 1].substring(0,3)} ${cYear.toString().substring(2)}` });
      cMonth--;
      if (cMonth < 1) {
        cMonth = 12;
        cYear--;
      }
    }

    // Calculate total average for all divisions in the last 6 months to find top 3
    const divTotals: Record<string, { totalPct: number, count: number }> = {};
    submissions.forEach(s => {
      // Check if submission is in the 6 month window
      if (monthsData.some(m => m.year === s.tahun && m.month === s.bulan)) {
        if (!divTotals[s.subDivisi]) divTotals[s.subDivisi] = { totalPct: 0, count: 0 };
        divTotals[s.subDivisi].totalPct += s.percentage;
        divTotals[s.subDivisi].count += 1;
      }
    });

    const topDivs = Object.entries(divTotals)
      .map(([divisi, data]) => ({ divisi, avg: data.totalPct / data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3)
      .map(d => d.divisi);

    // If no data, return empty
    if (topDivs.length === 0) return { data: [], topDivs: [] };

    // Format data for LineChart
    const chartData = monthsData.map(mInfo => {
      const point: any = { month: mInfo.name };
      topDivs.forEach(div => {
        const divSubs = submissions.filter(s => s.tahun === mInfo.year && s.bulan === mInfo.month && s.subDivisi === div);
        const avg = divSubs.length > 0 ? Math.round(divSubs.reduce((acc, curr) => acc + curr.percentage, 0) / divSubs.length) : 0;
        point[div] = avg;
      });
      return point;
    });

    return { data: chartData, topDivs };
  }, [submissions, selectedMonth, selectedYear]);"""

# Insert data logic before `// Underperforming Pejuang`
if "top3Divisions6MonthData" not in content:
    target_data = "  // Underperforming Pejuang (Performa Menurun < 75%)"
    content = content.replace(target_data, data_logic + "\n\n" + target_data)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
