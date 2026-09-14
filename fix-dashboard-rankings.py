import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add getWeeksInMonth import
if "getWeeksInMonth" not in content:
    content = content.replace('import { GREGORIAN_MONTHS_ID } from "../utils/hijri";', 'import { GREGORIAN_MONTHS_ID, getWeeksInMonth } from "../utils/hijri";')

# We need to replace the scoring logic in rankings and top3Bulanan
old_rankings_logic = """    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: item.count > 0 ? Math.round(item.totalPct / item.count) : 0,"""

new_rankings_logic = """    const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
    const expectedCount = rankingPeriod === "pekan" ? 1 : totalWeeksInMonth;
    
    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: Math.round(item.totalPct / expectedCount),
      count: item.count,
      expectedCount,"""

content = content.replace(old_rankings_logic, new_rankings_logic)

old_top3_logic = """    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: item.count > 0 ? Math.round(item.totalPct / item.count) : 0
    }));"""

new_top3_logic = """    const totalWeeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: Math.round(item.totalPct / totalWeeksInMonth),
      count: item.count,
      expectedCount: totalWeeksInMonth
    }));"""

content = content.replace(old_top3_logic, new_top3_logic)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Done Dashboard")
