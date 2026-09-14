import re

with open('src/components/ChecklistFormInput.tsx', 'r') as f:
    content = f.read()

target = """    const newTasks = tasks.map((t, idx) => {
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
    });"""

replacement = """    const newTasks = prevSubmission.tasks.map((prevTask, idx) => {
      const newRencana: Record<number, boolean> = {};
      const newRealisasi: Record<number, boolean> = {};
      
      weekInfo.dates.forEach((date, i) => {
        const prevDate = prevWeekInfo.dates[i];
        // if prevDate is undefined, it means previous week had fewer days, default to false
        newRencana[date] = prevDate ? !!prevTask.rencanaChecks[prevDate] : false;
        newRealisasi[date] = false; // Reset realisasi for new week
      });
      
      return {
         ...prevTask,
         rencanaChecks: newRencana,
         realisasiChecks: newRealisasi
      };
    });"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/ChecklistFormInput.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
