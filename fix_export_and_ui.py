import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

content = content.replace('${totalWeeks}', '${submittedWeeks} / ${expectedWeeks}')

with open('src/utils/export.ts', 'w') as f:
    f.write(content)

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add display of (count/expectedCount) to the UI when reportType === "bulan" for pejuang
old_ui = """              <p><span className="font-bold">PERFORMA:</span> <span className="text-emerald-800 font-extrabold">{targetSubmission ? `${targetSubmission.percentage}%` : '0%'}</span></p>"""

new_ui = """              <p><span className="font-bold">PERFORMA:</span> <span className="text-emerald-800 font-extrabold">{targetSubmission ? `${targetSubmission.percentage}%` : '0%'}</span></p>
              {reportType === "bulan" && targetSubmission && (
                <p><span className="font-bold">KEAKTIFAN:</span> <span className={`${targetSubmission.submissionsCount < targetSubmission.expectedCount ? 'text-rose-600' : 'text-emerald-700'} font-bold`}>{targetSubmission.submissionsCount} dari {targetSubmission.expectedCount} Pekan Terisi</span></p>
              )}"""

content = content.replace(old_ui, new_ui)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
