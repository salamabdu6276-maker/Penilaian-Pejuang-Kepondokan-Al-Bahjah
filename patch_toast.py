import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4"', 'className="fixed bottom-[5.5rem] md:bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4"')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
