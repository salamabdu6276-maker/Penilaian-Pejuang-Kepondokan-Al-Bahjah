import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

target = """          <div className="flex items-center space-x-4">
            <div className="bg-[#176a51] p-3 rounded-2xl shadow-inner border border-emerald-600/30 flex items-center justify-center">
              <img src={appLogo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>"""

replacement = """          <div className="flex items-center space-x-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-emerald-600/30 flex items-center justify-center">
              <img src={appLogo} alt="Logo" className="w-11 h-11 object-contain drop-shadow-sm" />
            </div>"""

content = content.replace(target, replacement)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)

