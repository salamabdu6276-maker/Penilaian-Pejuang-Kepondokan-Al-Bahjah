sed -i -e '/const categoryData = React.useMemo/i\
  const divisiData = React.useMemo(() => {\
    if (reportType !== "divisi") return [];\
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");\
    return divPejuangs.map(p => {\
      let filtered = [];\
      if (selectedWeek === 99) {\
         filtered = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);\
      } else {\
         filtered = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);\
      }\
      const count = filtered.length;\
      const avg = count > 0 ? Math.round(filtered.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;\
      return { pejuang: p, performa: avg, submissionsCount: count };\
    }).sort((a, b) => b.performa - a.performa);\
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear, selectedWeek]);\
' src/components/ReportsView.tsx
