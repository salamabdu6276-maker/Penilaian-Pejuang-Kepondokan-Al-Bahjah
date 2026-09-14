import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

anchor = "  const unreadCount = notifications.filter(n => !n.isRead).length;"
if "useAppLogo()" not in content:
    content = content.replace(anchor, "  const appLogo = useAppLogo();\n" + anchor)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)

