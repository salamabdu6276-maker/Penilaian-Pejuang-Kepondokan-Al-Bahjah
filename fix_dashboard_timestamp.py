import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("a.timestamp", "a.updatedAt")
content = content.replace("b.timestamp", "b.updatedAt")
content = content.replace("s.timestamp", "s.updatedAt")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Done")
