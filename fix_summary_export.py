import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Fix Excel button
old_excel_logic = """                    filteredSubs.forEach(sub => {
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;"""

new_excel_logic = """                    let totalPercentageSum = 0;
                    filteredSubs.forEach(sub => {
                      totalPercentageSum += (sub.percentage || 0);
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const expectedWeeks = reportType === "bulan" ? getWeeksInMonth(selectedYear, selectedMonth) : Math.max(1, filteredSubs.length);
                    const percentage = reportType === "bulan" || reportType === "rentang" ? Math.round(totalPercentageSum / expectedWeeks) : (totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0);"""

content = content.replace(old_excel_logic, new_excel_logic)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

print("Done fixing export logic")
