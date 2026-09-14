import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add warning for inconsistent submission in top 5 list
# Look for: r.pejuang.subDivisi
# and add a warning badge

replacement = """r.pejuang.subDivisi}
                      {r.count < r.expectedCount && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200" title={`Hanya mengisi ${r.count} dari ${r.expectedCount} pekan yang dinilai (Tidak Istiqomah)`}>
                          Tidak Istiqomah ({r.count}/{r.expectedCount})
                        </span>
                      )}"""

content = content.replace("r.pejuang.subDivisi}", replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Done Dashboard UI")
