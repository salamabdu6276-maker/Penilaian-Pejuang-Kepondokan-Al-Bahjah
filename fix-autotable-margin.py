import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Add margin to autoTable call in exportSummaryToPDF
# It currently has:
#   autoTable(doc, {
#     startY: 55,
#     head: tableHead,
#     body: tableBody,

content = re.sub(r'startY: 55,', 'startY: 55,\n    margin: { left: 10, right: 10 },', content)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
