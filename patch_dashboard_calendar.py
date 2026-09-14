import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add import
import_statement = "import { HijriCalendarWidget } from './HijriCalendarWidget';\n"
if "HijriCalendarWidget" not in content:
    content = content.replace('import { MonthlyHeatmap } from "./MonthlyHeatmap";', import_statement + 'import { MonthlyHeatmap } from "./MonthlyHeatmap";')

# Replace the simple hijri bar with the new widget
target_hijri = """      {/* HIJRI WIDGET */}
      <div className="bg-emerald-800 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-emerald-200" />
          <div>
            <h3 className="font-bold text-sm sm:text-base">{hijriDate.formatted}</h3>
            <p className="text-emerald-200 text-[10px] sm:text-xs font-medium">Penanggalan Hijriyah</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-emerald-200 font-medium">Tanggal Masehi</p>
          <p className="font-bold text-sm">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>"""

new_hijri = """      {/* HIJRI WIDGET */}
      <HijriCalendarWidget />"""

if target_hijri in content:
    content = content.replace(target_hijri, new_hijri)
else:
    # Let's try a regex or just find the div
    print("WARNING: target_hijri not found exactly. Will attempt regex replace.")
    pass

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
