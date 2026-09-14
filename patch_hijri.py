import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = "new Intl.DateTimeFormat('id-ID-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())"
replace = "hijriDate.formatted"

content = content.replace(target, replace)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

