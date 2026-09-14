import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Add getWeeksInMonth import
if "getWeeksInMonth" not in content:
    content = content.replace('import { translateText } from "./translate";', 'import { translateText } from "./translate";\nimport { getWeeksInMonth } from "./hijri";')

old_logic = """  let totalWeeks = monthSubmissions.length;
  let totalPct = 0;
  monthSubmissions.forEach(sub => { totalPct += sub.percentage; });
  const avgPct = totalWeeks > 0 ? Math.round(totalPct / totalWeeks) : 0;"""

new_logic = """  let submittedWeeks = monthSubmissions.length;
  let totalPct = 0;
  monthSubmissions.forEach(sub => { totalPct += sub.percentage; });
  
  let expectedWeeks = submittedWeeks;
  if (submittedWeeks > 0) {
    const y = monthSubmissions[0].tahun;
    const m = monthSubmissions[0].bulan;
    expectedWeeks = getWeeksInMonth(y, m);
  }
  
  const avgPct = expectedWeeks > 0 ? Math.round(totalPct / expectedWeeks) : 0;"""

content = content.replace(old_logic, new_logic)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done export.ts avg")
