import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add top3Bulanan
logic = """  const top3Bulanan = React.useMemo(() => {
    const map: Record<string, { pejuang: Pejuang; totalPct: number; count: number }> = {};
    monthSubmissions.forEach(s => {
      const p = activePejuangList.find(x => x.id === s.pejuangId);
      if (p) {
        if (!map[p.id]) map[p.id] = { pejuang: p, totalPct: 0, count: 0 };
        map[p.id].totalPct += s.percentage;
        map[p.id].count += 1;
      }
    });

    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: item.count > 0 ? Math.round(item.totalPct / item.count) : 0
    }));

    return result.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [activePejuangList, monthSubmissions]);

  // Underperforming Pejuang (Performa Menurun < 75%)"""

if 'const top3Bulanan =' not in content:
    content = content.replace('  // Underperforming Pejuang (Performa Menurun < 75%)', logic)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
