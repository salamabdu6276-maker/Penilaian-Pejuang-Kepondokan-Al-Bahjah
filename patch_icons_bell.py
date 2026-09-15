import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

if 'BellRing,' not in content:
    content = content.replace('import { MessageCircle, Phone, \n  Users,', 'import { MessageCircle, Phone, BellRing, \n  Users,')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
