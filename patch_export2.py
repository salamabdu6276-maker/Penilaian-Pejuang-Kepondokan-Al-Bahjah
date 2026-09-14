import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

old_export_text = """  doc.text(`${translateText("Total Form Pekan")}: ${submittedWeeks} / ${expectedWeeks}`, 130, 60);"""
new_export_text = """  let weekStatus = "";
  if (submittedWeeks < expectedWeeks) {
     weekStatus = submittedWeeks < 3 ? " (Kurang Istiqomah)" : " (Tidak Lengkap)";
  }
  doc.text(`${translateText("Total Form Pekan")}: ${submittedWeeks} / ${expectedWeeks}${weekStatus}`, 130, 60);"""

content = content.replace(old_export_text, new_export_text)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Updated export.ts")
