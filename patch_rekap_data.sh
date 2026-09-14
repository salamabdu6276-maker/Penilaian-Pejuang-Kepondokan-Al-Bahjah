cat << 'INNER_EOF' > /tmp/rekapdata.tsx
  const rekapData = React.useMemo(() => {
    if (reportType !== "bulan" && reportType !== "pekan" && reportType !== "rentang") return [];
    
    return pejuangList.filter(p => p.status === "aktif").map(p => {
      let filteredSubs = [];
      if (reportType === "bulan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "pekan") {
        filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
      } else if (reportType === "rentang") {
        if (startDate && endDate) {
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime() + 86400000;
          filteredSubs = submissions.filter(s => {
            if (!s.updatedAt || s.pejuangId !== p.id) return false;
            const subTime = new Date(s.updatedAt).getTime();
            return subTime >= start && subTime < end;
          });
        }
      }
      
      const count = filteredSubs.length;
      const performa = count > 0 ? Math.round(filteredSubs.reduce((sum, s) => sum + s.percentage, 0) / count) : 0;
      
      // Calculate W1-W5 if reportType is bulan
      const getW = (wk: number) => {
         const s = submissions.find(s => s.pejuangId === p.id && s.pekan === wk && s.bulan === selectedMonth && s.tahun === selectedYear);
         return s ? s.percentage : "-";
      };
      
      return { 
         pejuang: p, 
         w1: reportType === "bulan" ? getW(1) : "-",
         w2: reportType === "bulan" ? getW(2) : "-",
         w3: reportType === "bulan" ? getW(3) : "-",
         w4: reportType === "bulan" ? getW(4) : "-",
         w5: reportType === "bulan" ? getW(5) : "-",
         performa, 
         evaluasi: performa >= 91 ? "A" : performa >= 76 ? "B" : performa >= 40 ? "C" : "D"
      };
    }).sort((a, b) => b.performa - a.performa);
  }, [reportType, pejuangList, submissions, selectedMonth, selectedYear, selectedWeek, startDate, endDate]);
INNER_EOF
