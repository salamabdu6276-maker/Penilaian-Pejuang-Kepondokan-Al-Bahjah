import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Make handlers async and await the translations
content = content.replace('const handleExportCSV = () => {', 'const handleExportCSV = async () => {\n    await import("../utils/export").then(m => m.prepareTranslations());')
content = content.replace('const handleExportPDF = () => {', 'const handleExportPDF = async () => {\n    await import("../utils/export").then(m => m.prepareTranslations());')
content = content.replace('const handleExportSummaryPDF = () => {', 'const handleExportSummaryPDF = async () => {\n    await import("../utils/export").then(m => m.prepareTranslations());')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
