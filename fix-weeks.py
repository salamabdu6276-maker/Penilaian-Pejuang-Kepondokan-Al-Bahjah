import re

with open('src/utils/hijri.ts', 'r') as f:
    content = f.read()

old_func = """export function getWeeksInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  return daysInMonth > 28 ? 5 : 4;
}"""

new_func = """export function getWeeksInMonth(year: number, month: number): number {
  // Selalu 5 pekan sesuai dengan form checklist
  return 5;
}"""

content = content.replace(old_func, new_func)

with open('src/utils/hijri.ts', 'w') as f:
    f.write(content)
print("Done")
