with open('src/utils/export.ts', 'r') as f:
    content = f.read()

import re

# We can just write a better regex or use replace more carefully.
target_csv = """export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);"""

replace_csv = """export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;

  const translatedData = data.map(row => {
    const newRow: Record<string, any> = {};
    for (const key in row) {
      newRow[translateText(key)] = typeof row[key] === 'string' ? translateText(row[key]) : row[key];
    }
    return newRow;
  });

  const headers = Object.keys(translatedData[0]);"""

if target_csv in content:
    content = content.replace(target_csv, replace_csv)
    content = content.replace("for (const row of data) {", "for (const row of translatedData) {")
else:
    # If it failed, let's just do a manual replace
    content = re.sub(r'export function exportToCSV\(data: Record<string, any>\[\], filename: string\) \{\s+if \(\!data \|\| data\.length === 0\) return;\s+const headers = Object\.keys\(data\[0\]\);', replace_csv, content)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
