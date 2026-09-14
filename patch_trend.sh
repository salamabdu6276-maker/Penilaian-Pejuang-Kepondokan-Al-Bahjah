cat << 'INNER_EOF' > /tmp/trend.tsx
  const trendData = React.useMemo(() => {
    if (reportType !== "divisi") return [];
    
    const divPejuangs = pejuangList.filter(p => p.subDivisi === selectedDivisi && p.status === "aktif");
    const divPejuangIds = new Set(divPejuangs.map(p => p.id));
    
    const months = [];
    let currentM = selectedMonth;
    let currentY = selectedYear;
    
    for (let i = 0; i < 3; i++) {
      months.unshift({ month: currentM, year: currentY });
      currentM--;
      if (currentM < 1) {
        currentM = 12;
        currentY--;
      }
    }
    
    return months.map(m => {
      const monthSubs = submissions.filter(s => s.bulan === m.month && s.tahun === m.year && divPejuangIds.has(s.pejuangId));
      let totalPercentage = 0;
      let count = 0;
      
      divPejuangs.forEach(p => {
         const pSubs = monthSubs.filter(s => s.pejuangId === p.id);
         if (pSubs.length > 0) {
           totalPercentage += pSubs.reduce((sum, s) => sum + s.percentage, 0) / pSubs.length;
           count++;
         }
      });
      
      const avg = count > 0 ? Math.round(totalPercentage / count) : 0;
      return {
        name: `${GREGORIAN_MONTHS_ID[m.month - 1].substring(0, 3)} ${m.year}`,
        RataRata: avg
      };
    });
  }, [reportType, selectedDivisi, pejuangList, submissions, selectedMonth, selectedYear]);
INNER_EOF
sed -i -e '/const categoryData = React.useMemo/i\' -e "$(cat /tmp/trend.tsx | sed 's/$/\\/')" src/components/ReportsView.tsx
sed -i 's/\\$//g' src/components/ReportsView.tsx
