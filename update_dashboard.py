import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_badge = """                      {r.count < r.expectedCount && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200" title={`Hanya mengisi ${r.count} dari ${r.expectedCount} pekan yang dinilai (Tidak Istiqomah)`}>
                          Tidak Istiqomah ({r.count}/{r.expectedCount})
                        </span>
                      )}"""

new_badge = """                      {r.count < r.expectedCount && (
                        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${r.count < 3 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`} title={`Hanya mengisi ${r.count} dari ${r.expectedCount} pekan yang dinilai`}>
                          {r.count < 3 ? 'Kurang Istiqomah' : 'Tidak Lengkap'} ({r.count}/{r.expectedCount})
                        </span>
                      )}"""

content = content.replace(old_badge, new_badge)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Done updating Dashboard.tsx")
