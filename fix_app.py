import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Header by replacing the exact props
old_header_start = """      <div className="print:hidden">
        <Header
        role={role}
        onRoleChange={setRole}
        notifications={notifications}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />"""

new_header_fixed = """      <div className="print:hidden">
        <Header
        role={role}
        onRoleChange={setRole}
        notifications={notifications}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />
      </div>"""

content = content.replace(old_header_start, new_header_fixed)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Fixed App.tsx")
