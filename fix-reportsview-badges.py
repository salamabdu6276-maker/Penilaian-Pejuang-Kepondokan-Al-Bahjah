import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

replacement1 = """<td className="border border-slate-200 dark:border-slate-700 p-2 font-medium text-slate-800 dark:text-slate-200 text-left">
                      {d.pejuang.nama}
                      {d.submissionsCount < d.expectedCount && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200" title={`Hanya mengisi ${d.submissionsCount} dari ${d.expectedCount} pekan yang dinilai`}>
                          Tidak Istiqomah ({d.submissionsCount}/{d.expectedCount})
                        </span>
                      )}
                    </td>"""

content = content.replace('<td className="border border-slate-200 dark:border-slate-700 p-2 font-medium text-slate-800 dark:text-slate-200 text-left">{d.pejuang.nama}</td>', replacement1)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done ReportsView Badges")
