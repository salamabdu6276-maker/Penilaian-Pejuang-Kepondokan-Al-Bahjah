import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

import_statement = "import { Overall4WeekTrend } from './Overall4WeekTrend';\n"
if "Overall4WeekTrend" not in content:
    content = content.replace('import { PejuangWeeklyTrend } from "./PejuangWeeklyTrend";', import_statement + 'import { PejuangWeeklyTrend } from "./PejuangWeeklyTrend";')

# Inject it after PejuangWeeklyTrend
target_trend = """          <PejuangWeeklyTrend pejuangList={pejuangList} submissions={submissions} />
        </div>"""

new_trend = """          <PejuangWeeklyTrend pejuangList={pejuangList} submissions={submissions} />
        </div>
        <div className="lg:col-span-6">
          <Overall4WeekTrend submissions={submissions} />
        </div>"""

content = content.replace(target_trend, new_trend)

# Since PejuangWeeklyTrend is taking lg:col-span-12 right now, wait let me check its wrapper.
# Let's inspect the surrounding code.
