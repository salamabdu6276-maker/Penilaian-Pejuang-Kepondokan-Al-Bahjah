import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">',
    '<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
