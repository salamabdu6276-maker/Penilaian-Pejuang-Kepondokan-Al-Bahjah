import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

import_statement = "import { Overall4WeekTrend } from './Overall4WeekTrend';\n"
if "Overall4WeekTrend" not in content:
    content = content.replace('import { PejuangWeeklyTrend } from "./PejuangWeeklyTrend";', import_statement + 'import { PejuangWeeklyTrend } from "./PejuangWeeklyTrend";')

target_str = """        {/* Weekly Trend Line (6 Cols) */}
        <div className="lg:col-span-6">
          <PejuangWeeklyTrend pejuangList={pejuangList} submissions={submissions} />
        </div>"""

new_str = """        {/* Weekly Trend Line (6 Cols) */}
        <div className="lg:col-span-6">
          <PejuangWeeklyTrend pejuangList={pejuangList} submissions={submissions} />
        </div>
        
        {/* Overall 4 Week Trend Line (6 Cols) */}
        <div className="lg:col-span-6">
          <Overall4WeekTrend submissions={submissions} />
        </div>"""

content = content.replace(target_str, new_str)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
