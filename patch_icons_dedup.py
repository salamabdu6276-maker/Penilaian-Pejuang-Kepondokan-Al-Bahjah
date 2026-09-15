import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { MessageCircle, Phone, X, \n  Users,',
    'import { MessageCircle, Phone, \n  Users,'
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
