import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """  // Performance Overview Data (Current Month by Week)
  const performanceOverviewData = React.useMemo(() => {
    const data = [
      { name: 'Pekan 1', Performa: 0, count: 0 },
      { name: 'Pekan 2', Performa: 0, count: 0 },
      { name: 'Pekan 3', Performa: 0, count: 0 },
      { name: 'Pekan 4', Performa: 0, count: 0 },
      { name: 'Pekan 5', Performa: 0, count: 0 }
    ];
    
    monthSubmissions.forEach(s => {
      if (s.pekan >= 1 && s.pekan <= 5 && activePejuangList.some(p => p.id === s.pejuangId)) {
        data[s.pekan - 1].Performa += s.percentage;
        data[s.pekan - 1].count += 1;
      }
    });

    return data.map(d => ({
      name: d.name,
      Performa: d.count > 0 ? Math.round(d.Performa / d.count) : 0,
      Count: d.count
    }));
  }, [monthSubmissions, activePejuangList]);"""

new_code = """  // Performance Overview Data
  const performanceOverviewData = React.useMemo(() => {
    const data: { name: string; Performa: number; count: number }[] = [];
    
    if (overviewViewType === 'weekly') {
      for (let i = 1; i <= 5; i++) {
        data.push({ name: `Pekan ${i}`, Performa: 0, count: 0 });
      }
      monthSubmissions.forEach(s => {
        if (s.pekan >= 1 && s.pekan <= 5 && activePejuangList.some(p => p.id === s.pejuangId)) {
          data[s.pekan - 1].Performa += s.percentage;
          data[s.pekan - 1].count += 1;
        }
      });
    } else if (overviewViewType === 'monthly') {
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      for (let i = 0; i < 12; i++) {
        data.push({ name: months[i], Performa: 0, count: 0 });
      }
      submissions.forEach(s => {
        if (s.tahun === selectedYear && s.bulan >= 1 && s.bulan <= 12 && activePejuangList.some(p => p.id === s.pejuangId)) {
          data[s.bulan - 1].Performa += s.percentage;
          data[s.bulan - 1].count += 1;
        }
      });
    } else if (overviewViewType === 'quarterly') {
      data.push({ name: 'Q1 (Jan-Mar)', Performa: 0, count: 0 });
      data.push({ name: 'Q2 (Apr-Jun)', Performa: 0, count: 0 });
      data.push({ name: 'Q3 (Jul-Sep)', Performa: 0, count: 0 });
      data.push({ name: 'Q4 (Okt-Des)', Performa: 0, count: 0 });
      
      submissions.forEach(s => {
        if (s.tahun === selectedYear && activePejuangList.some(p => p.id === s.pejuangId)) {
          let qIdx = -1;
          if (s.bulan >= 1 && s.bulan <= 3) qIdx = 0;
          else if (s.bulan >= 4 && s.bulan <= 6) qIdx = 1;
          else if (s.bulan >= 7 && s.bulan <= 9) qIdx = 2;
          else if (s.bulan >= 10 && s.bulan <= 12) qIdx = 3;
          
          if (qIdx !== -1) {
            data[qIdx].Performa += s.percentage;
            data[qIdx].count += 1;
          }
        }
      });
    }

    return data.map(d => ({
      name: d.name,
      Performa: d.count > 0 ? Math.round(d.Performa / d.count) : 0,
      Count: d.count
    }));
  }, [overviewViewType, monthSubmissions, submissions, activePejuangList, selectedYear]);"""

content = content.replace(target, new_code)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
