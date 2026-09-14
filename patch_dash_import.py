import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { MonthlyHeatmap } from "./MonthlyHeatmap";', 'import { MonthlyHeatmap } from "./MonthlyHeatmap";\nimport { SholatAttendanceUploader } from "./SholatAttendanceUploader";')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
