import re

with open('src/components/ChecklistFormInput.tsx', 'r') as f:
    content = f.read()

# 1. Add handleDuplicatePreviousWeek function before handleDuplicateFormat
target_func = """  const handleDuplicateFormat = () => {"""
replacement_func = """  const handleDuplicatePreviousWeek = () => {
    let targetWeek = selectedWeek - 1;
    let targetMonth = selectedMonth;
    let targetYear = selectedYear;
    
    if (targetWeek === 0) {
      targetMonth -= 1;
      if (targetMonth === 0) {
        targetMonth = 12;
        targetYear -= 1;
      }
      // find the latest week in the previous month (5 or 4) for this pejuang
      const prevMonthSubs = existingSubmissions.filter(s => 
        s.pejuangId === selectedPejuangId && 
        s.bulan === targetMonth && 
        s.tahun === targetYear
      );
      if (prevMonthSubs.length > 0) {
        targetWeek = Math.max(...prevMonthSubs.map(s => s.pekan));
      } else {
        targetWeek = 4; // default assumption if no data
      }
    }

    const prevSubmission = existingSubmissions.find(
      s => s.pejuangId === selectedPejuangId && 
           s.bulan === targetMonth && 
           s.tahun === targetYear && 
           s.pekan === targetWeek
    );

    if (!prevSubmission) {
      alert(`Tidak ditemukan data submission untuk Pekan ${targetWeek} bulan ${GREGORIAN_MONTHS_ID[targetMonth - 1]} ${targetYear}.`);
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menyalin format (termasuk Checklist Rencana) dari Pekan ${targetWeek}? Realisasi akan di-reset.`)) {
      return;
    }

    const prevWeekInfo = getWeekPeriodString(targetYear, targetMonth, targetWeek);

    const newTasks = tasks.map((t, idx) => {
      // try to match by taskId or index
      const prevTask = prevSubmission.tasks.find(pt => pt.taskId === t.taskId) || prevSubmission.tasks[idx];
      if (!prevTask) return t;

      const newRencana: Record<number, boolean> = {};
      const newRealisasi: Record<number, boolean> = {};
      
      weekInfo.dates.forEach((date, i) => {
        const prevDate = prevWeekInfo.dates[i];
        newRencana[date] = prevDate ? !!prevTask.rencanaChecks[prevDate] : false;
        newRealisasi[date] = false; // Reset realisasi for new week
      });
      
      return {
         ...t,
         waktu: prevTask.waktu,
         uraian: prevTask.uraian,
         kategori: prevTask.kategori,
         rencanaChecks: newRencana,
         realisasiChecks: newRealisasi
      };
    });

    setTasks(newTasks);
    alert(`Berhasil menyalin format dari Pekan ${targetWeek}!`);
  };

  const handleDuplicateFormat = () => {"""

content = content.replace(target_func, replacement_func)

with open('src/components/ChecklistFormInput.tsx', 'w') as f:
    f.write(content)
