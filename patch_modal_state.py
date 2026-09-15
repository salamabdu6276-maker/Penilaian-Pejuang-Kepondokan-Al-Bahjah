import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const [historyModalPejuang, setHistoryModalPejuang] = useState<Pejuang | null>(null);',
    'const [historyModalPejuang, setHistoryModalPejuang] = useState<Pejuang | null>(null);\n  const [heatmapModalSubmission, setHeatmapModalSubmission] = useState<ChecklistFormSubmission | null>(null);'
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
