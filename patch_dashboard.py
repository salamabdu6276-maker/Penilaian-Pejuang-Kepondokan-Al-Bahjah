import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace('import { MonthlyHeatmap } from "./MonthlyHeatmap";', 'import { MonthlyHeatmap } from "./MonthlyHeatmap";\nimport { DailyFocus } from "./DailyFocus";')

# We can put Daily Focus in a grid alongside Top Performers, or below it.
# Let's find Top Performers
target = """      {/* TOP 3 PERFORMERS (BULANAN) */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">"""

replacement = """      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* TOP 3 PERFORMERS (BULANAN) */}
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">"""

content = content.replace(target, replacement)

# Now close the grid after Top Performers
target_close = """          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm italic">
            Belum ada data cukup untuk menentukan Top Performers bulan ini.
          </div>
        )}
      </div>"""

replacement_close = """          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm italic">
            Belum ada data cukup untuk menentukan Top Performers bulan ini.
          </div>
        )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <DailyFocus />
        </div>
      </div>"""

content = content.replace(target_close, replacement_close)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
