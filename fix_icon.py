import re

with open('src/components/ChecklistFormInput.tsx', 'r') as f:
    content = f.read()

content = content.replace('<RotateCcw className="w-3.5 h-3.5" />\n              <span>Duplikat Pekan Sblm</span>', '<Copy className="w-3.5 h-3.5" />\n              <span>Duplikat Pekan Sblm</span>')

with open('src/components/ChecklistFormInput.tsx', 'w') as f:
    f.write(content)
