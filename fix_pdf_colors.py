import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# I need to insert didParseCell into the autoTable config for exportFormToPDF
# Let's find the autoTable call for the main checklist

old_code = """    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 22, halign: "center" },
      2: { cellWidth: 60 },
      ...dates.reduce((acc, _, i) => ({ ...acc, [3 + i]: { cellWidth: 8, halign: "center" } }), {}),
      [3 + dates.length]: { cellWidth: 10, halign: "center" },
      [4 + dates.length]: { cellWidth: 25 }
    }
  });"""

new_code = """    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 22, halign: "center" },
      2: { cellWidth: 60 },
      ...dates.reduce((acc, _, i) => ({ ...acc, [3 + i]: { cellWidth: 8, halign: "center" } }), {}),
      [3 + dates.length]: { cellWidth: 10, halign: "center" },
      [4 + dates.length]: { cellWidth: 25 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index >= 3 && data.column.index < 3 + dates.length) {
        if (data.cell.raw === 'v') {
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'x') {
          data.cell.styles.textColor = [225, 29, 72];
        } else {
          data.cell.styles.textColor = [150, 150, 150];
        }
      }
    }
  });"""

content = content.replace(old_code, new_code)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
