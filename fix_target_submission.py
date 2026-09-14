import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

old_block = """      const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;

      return {
        ...firstSub,
        pekan: 99,
        periodeStr: reportType === "bulan" 
          ? `Sebulan Penuh (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`
          : `Rentang Tanggal (${startDate} s/d ${endDate})`,
        dates: allDates,
        tasks: Array.from(mergedTasksMap.values()).sort((a, b) => a.no - b.no),
        totalChecked,
        totalPossible,
        percentage
      };"""

new_block = """      let totalPercentageSum = 0;
      filteredSubs.forEach(sub => {
        totalPercentageSum += (sub.percentage || 0);
      });
      const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
      const percentage = Math.round(totalPercentageSum / expectedWeeks);

      return {
        ...firstSub,
        pekan: 99,
        periodeStr: reportType === "bulan" 
          ? `Sebulan Penuh (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`
          : `Rentang Tanggal (${startDate} s/d ${endDate})`,
        dates: allDates,
        tasks: Array.from(mergedTasksMap.values()).sort((a, b) => a.no - b.no),
        totalChecked,
        totalPossible,
        percentage,
        submissionsCount: filteredSubs.length,
        expectedCount: expectedWeeks
      };"""

content = content.replace(old_block, new_block)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
