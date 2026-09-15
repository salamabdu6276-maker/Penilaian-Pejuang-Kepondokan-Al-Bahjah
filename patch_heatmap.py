import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """  const heatmapData = React.useMemo(() => {
    return activePejuangList.map(p => {
      const pSubs = monthSubmissions.filter(s => s.pejuangId === p.id);
      return {
        pejuang: p,
        w1: pSubs.find(s => s.pekan === 1)?.percentage,
        w2: pSubs.find(s => s.pekan === 2)?.percentage,
        w3: pSubs.find(s => s.pekan === 3)?.percentage,
        w4: pSubs.find(s => s.pekan === 4)?.percentage,
        w5: pSubs.find(s => s.pekan === 5)?.percentage,
      }
    });
  }, [activePejuangList, monthSubmissions]);"""

new_code = """  const heatmapData = React.useMemo(() => {
    const data = activePejuangList.map(p => {
      const pSubs = monthSubmissions.filter(s => s.pejuangId === p.id);
      return {
        pejuang: p,
        w1: pSubs.find(s => s.pekan === 1)?.percentage,
        w2: pSubs.find(s => s.pekan === 2)?.percentage,
        w3: pSubs.find(s => s.pekan === 3)?.percentage,
        w4: pSubs.find(s => s.pekan === 4)?.percentage,
        w5: pSubs.find(s => s.pekan === 5)?.percentage,
      }
    });
    
    return data.sort((a, b) => {
      if (heatmapSortBy === "name") {
        return a.pejuang.nama.localeCompare(b.pejuang.nama);
      } else {
        const valA = a[`w${selectedWeek}` as keyof typeof a] as number | undefined || -1;
        const valB = b[`w${selectedWeek}` as keyof typeof b] as number | undefined || -1;
        return valB - valA;
      }
    });
  }, [activePejuangList, monthSubmissions, heatmapSortBy, selectedWeek]);"""

content = content.replace(target, new_code)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
