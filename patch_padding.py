import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('pb-24 md:pb-6', 'pb-36 md:pb-6')

with open('src/App.tsx', 'w') as f:
    f.write(content)
