import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace('<span>Print Summary</span>', '<span>Print Preview</span>')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
