import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target = """  const [dokumenUrls, setDokumenUrls] = React.useState<string[]>([]);"""
replacement = """  const [dokumenUrls, setDokumenUrls] = React.useState<string[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);"""

content = content.replace(target, replacement)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
