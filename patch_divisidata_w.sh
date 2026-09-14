cat << 'INNER_EOF' > /tmp/divisidata.tsx
  const divisiData = React.useMemo(() => {
    if (reportType !== "divisi") return [];
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");
    return divPejuangs.map(p => {
      const getW = (wk: number) => {
         const s = submissions.find(s => s.pejuangId === p.id && s.pekan === wk && s.bulan === selectedMonth && s.tahun === selectedYear);
         return s ? s.percentage : "-";
      };
      
      const w1 = getW(1);
      const w2 = getW(2);
      const w3 = getW(3);
      const w4 = getW(4);
      const w5 = getW(5);

      const sBulan = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      const count = sBulan.length;
      const performa = count > 0 ? Math.round(sBulan.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;
      
      return { 
         pejuang: p, 
         w1, w2, w3, w4, w5, 
         performa, 
         submissionsCount: count,
         evaluasi: performa >= 91 ? "A" : performa >= 76 ? "B" : performa >= 40 ? "C" : "D"
      };
    }).sort((a, b) => b.performa - a.performa);
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);
INNER_EOF
