import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Fix exportRekapToPDF import
content = content.replace("exportRekapToPDF, ", "")

# Fix reportType === "pejuang" in the "bulan|pekan|rentang" block
content = content.replace('else if (reportType === "pekan" || reportType === "pejuang") {', 'else if (reportType === "pekan") {')

# Fix reportType === "bulan" inside reportType === "divisi" block
# Look at line 1304, 1319
# We have 
# {reportType === "bulan" && <th className="border border-slate-300 dark:border-slate-600 p-2">Aksi</th>}
# Let's remove it because this table is inside reportType === "divisi" block!
# But wait, earlier agent might have copy-pasted the table.
# Let's just remove the Aksi column header and the td.
content = re.sub(r'\{reportType === "bulan" && <th className="border border-slate-300 dark:border-slate-600 p-2">Aksi</th>\}', '', content)
content = re.sub(r'\{reportType === "bulan" && \(\s*<td className="border border-slate-200 dark:border-slate-700 p-2 text-center">.*?</td>\s*\)\}', '', content, flags=re.DOTALL)

# Fix reportType === "bulan" on line 1376. Wait, line 1376 is inside reportType === "pejuang".
# 1353: {reportType === "pejuang" && activePejuang && (
# 1376: <span>{reportType === "bulan" ? "Performa Bulanan:" : `Performa Pekan ${selectedWeek}:`}</span>
# We can just change it to reportType === "pejuang" or remove the condition since it's always pejuang here.
content = re.sub(r'<span>\{reportType === "bulan" \? "Performa Bulanan:" : `Performa Pekan \$\{selectedWeek\}:`\}</span>', r'<span>{`Performa Pekan ${selectedWeek}:`}</span>', content)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
