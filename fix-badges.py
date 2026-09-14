import re

with open('src/utils/badges.ts', 'r') as f:
    content = f.read()

old_logic = """export function calculateBadges(submissions: ChecklistFormSubmission[], pejuangId: string): Badge[] {
  const subs = submissions.filter(s => s.pejuangId === pejuangId);
  const badges: Badge[] = [];

  if (subs.length === 0) return badges;

  const avgPct = subs.reduce((sum, s) => sum + s.percentage, 0) / subs.length;"""

new_logic = """export function calculateBadges(submissions: ChecklistFormSubmission[], pejuangId: string, expectedCount?: number): Badge[] {
  const subs = submissions.filter(s => s.pejuangId === pejuangId);
  const badges: Badge[] = [];

  if (subs.length === 0) return badges;
  
  const divisor = expectedCount ? expectedCount : subs.length;
  const avgPct = subs.reduce((sum, s) => sum + s.percentage, 0) / Math.max(divisor, 1);"""

content = content.replace(old_logic, new_logic)

with open('src/utils/badges.ts', 'w') as f:
    f.write(content)
print("Done Badges")
