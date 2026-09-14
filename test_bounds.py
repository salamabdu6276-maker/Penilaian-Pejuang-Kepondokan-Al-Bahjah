import re

with open('src/components/Dashboard.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const Dashboard:' in line or 'const Dashboard =' in line:
        print(f"Dashboard starts at: {i}")
    if 'const top3Bulanan =' in line:
        print(f"top3Bulanan starts at: {i}")
    if 'export default Dashboard' in line:
        print(f"export at: {i}")
