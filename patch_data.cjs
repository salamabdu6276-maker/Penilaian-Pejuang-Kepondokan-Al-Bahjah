const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const search = `  }, [submissions, activePejuangList]);

  // Ranking calculation`;
const replacement = `  }, [submissions, activePejuangList]);

  // Performance Overview Data (Current Month by Week)
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
  }, [monthSubmissions, activePejuangList]);

  // Ranking calculation`;

if(code.includes(search)) {
  code = code.replace(search, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log('Replaced successfully');
} else {
  console.log('Not found');
}
