import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

trend3bulan_code = """
  const trend3BulanDivisiData = React.useMemo(() => {
    if (reportType !== "divisi") return [];
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");
    const divPejuangIds = divPejuangs.map(p => p.id);
    
    // last 3 months including selected month
    const months = [];
    let curM = selectedMonth;
    let curY = selectedYear;
    for (let i = 0; i < 3; i++) {
      months.push({ month: curM, year: curY });
      curM -= 1;
      if (curM === 0) {
        curM = 12;
        curY -= 1;
      }
    }
    months.reverse(); // oldest to newest
    
    return months.map(m => {
      const subs = submissions.filter(s => 
        divPejuangIds.includes(s.pejuangId) && 
        s.bulan === m.month && 
        s.tahun === m.year
      );
      const count = subs.length;
      const totalPct = subs.reduce((sum, s) => sum + s.percentage, 0);
      const avg = count > 0 ? Math.round(totalPct / count) : 0;
      return {
        name: `${GREGORIAN_MONTHS_ID[m.month - 1].substring(0, 3)} ${m.year}`,
        RataRata: avg
      };
    });
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);

  const top3DivisiData = React.useMemo(() => {
    if (reportType !== "divisi" || divisiData.length === 0) return [];
    return [...divisiData]
      .sort((a, b) => b.performa - a.performa)
      .slice(0, 3)
      .map(d => ({
        name: d.pejuang.nama.split(" ")[0],
        Performa: d.performa
      }));
  }, [reportType, divisiData]);
"""

content = content.replace(
    "  const categoryData = React.useMemo(() => {",
    trend3bulan_code + "\n  const categoryData = React.useMemo(() => {"
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("done")
