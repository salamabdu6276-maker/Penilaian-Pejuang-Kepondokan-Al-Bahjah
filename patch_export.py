import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# For `exportSummaryToPDF`, let's add logic to pass `submissionsCount` and `expectedCount` from `ReportsView.tsx` 
# into `exportSummaryToPDF`, or we can add it to the name string in `summaryData` in `ReportsView.tsx` itself.
