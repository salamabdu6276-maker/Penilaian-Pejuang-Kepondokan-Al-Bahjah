import re

with open('src/utils/hijri.ts', 'r') as f:
    content = f.read()

func = """
export function getWeeksInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  return daysInMonth > 28 ? 5 : 4;
}
"""

if "getWeeksInMonth" not in content:
    content += func

with open('src/utils/hijri.ts', 'w') as f:
    f.write(content)
