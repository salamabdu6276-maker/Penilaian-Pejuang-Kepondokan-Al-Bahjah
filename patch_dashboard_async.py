import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make handleExportCSV async
content = content.replace('const handleExportCSV = () => {', 'const handleExportCSV = async () => {\n    await import("../utils/export").then(m => m.prepareTranslations());')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
