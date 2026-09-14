import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

ranking_code = """              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Peringkat Divisi:</span>
                <span className="font-bold text-indigo-700">{rekapData.filter(d => d.pejuang.subDivisi === activePejuang.subDivisi).findIndex(d => d.pejuang.id === activePejuang.id) !== -1 ? `#${rekapData.filter(d => d.pejuang.subDivisi === activePejuang.subDivisi).findIndex(d => d.pejuang.id === activePejuang.id) + 1} dari ${rekapData.filter(d => d.pejuang.subDivisi === activePejuang.subDivisi).length}` : "-"}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Peringkat Keseluruhan:</span>
                <span className="font-bold text-blue-700">{rekapData.findIndex(d => d.pejuang.id === activePejuang.id) !== -1 ? `#${rekapData.findIndex(d => d.pejuang.id === activePejuang.id) + 1} dari ${rekapData.length}` : "-"}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Predikat:</span>"""

content = content.replace(
"""              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Predikat:</span>""",
ranking_code
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("done")
