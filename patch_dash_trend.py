import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

if 'import { PejuangWeeklyTrend }' not in content:
    content = content.replace(
        'import { SholatAttendanceRecap } from "./SholatAttendanceRecap";',
        'import { SholatAttendanceRecap } from "./SholatAttendanceRecap";\nimport { PejuangWeeklyTrend } from "./PejuangWeeklyTrend";'
    )

target = '        {/* Top 3 Divisions 6-Month Trajectory (6 Cols) */}'
replacement = '''        {/* Weekly Trend Line (6 Cols) */}
        <div className="lg:col-span-6">
          <PejuangWeeklyTrend pejuangList={pejuangList} submissions={submissions} />
        </div>

        {/* Top 3 Divisions 6-Month Trajectory (6 Cols) */}'''

if target in content and 'PejuangWeeklyTrend pejuangList' not in content:
    content = content.replace(target, replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
