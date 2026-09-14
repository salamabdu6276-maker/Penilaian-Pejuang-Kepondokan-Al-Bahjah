import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace('submissionsCount: count,', 'submissionsCount: count,\n         expectedCount,')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Done")
