import re

with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

content = content.replace('setIsLoading(false);', '')

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
