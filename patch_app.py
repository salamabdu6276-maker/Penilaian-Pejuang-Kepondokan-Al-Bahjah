import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Wrap Header
old_header = """      {/* Top Header */}
      <Header"""
new_header = """      {/* Top Header */}
      <div className="print:hidden">
        <Header"""
content = content.replace(old_header, new_header)

old_header_end = """        onNotificationRead={markNotificationRead}
      />"""
new_header_end = """        onNotificationRead={markNotificationRead}
      />
      </div>"""
content = content.replace(old_header_end, new_header_end)

# Floating language switcher
old_lang = """      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">"""
new_lang = """      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">"""
content = content.replace(old_lang, new_lang)

# Navigation
old_nav = """      {/* Main Navigation Tabs */}
      <Navigation"""
new_nav = """      {/* Main Navigation Tabs */}
      <div className="print:hidden">
      <Navigation"""
content = content.replace(old_nav, new_nav)

old_nav_end = """        onTabChange={setActiveTab}
        role={role}
      />"""
new_nav_end = """        onTabChange={setActiveTab}
        role={role}
      />
      </div>"""
content = content.replace(old_nav_end, new_nav_end)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx")
