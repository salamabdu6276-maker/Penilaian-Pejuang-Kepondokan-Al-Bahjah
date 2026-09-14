import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# find selectedMonth state
target = "const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);"
new_target = "const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);\n  const [sholatRefreshKey, setSholatRefreshKey] = useState(0);"

if target in content and "sholatRefreshKey" not in content:
    content = content.replace(target, new_target)

# replace uploader
content = content.replace('<SholatAttendanceUploader pejuangList={pejuangList} />', '<SholatAttendanceUploader pejuangList={pejuangList} onUploadSuccess={() => setSholatRefreshKey(prev => prev + 1)} />')

# replace recap
content = content.replace('<SholatAttendanceRecap pejuangList={pejuangList} selectedMonth={selectedMonth} selectedYear={selectedYear} />', '<SholatAttendanceRecap key={sholatRefreshKey} pejuangList={pejuangList} selectedMonth={selectedMonth} selectedYear={selectedYear} />')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
