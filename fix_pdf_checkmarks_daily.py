import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Let's ensure the table mapping maps perfectly
if "const checkCols = dates.map(d => (task.realisasiChecks?.[d] ? \"v\" : \"x\"));" in content:
    print("Checkmark mapping is correct")
else:
    print("Checkmark mapping missing")
