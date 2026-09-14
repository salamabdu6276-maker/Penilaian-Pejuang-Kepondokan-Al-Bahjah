import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-800 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg hover:scale-110 transition-transform"', 'className="fixed bottom-[5.5rem] md:bottom-6 right-6 z-50 p-3 rounded-full bg-slate-800 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg hover:scale-110 transition-transform"')

with open('src/App.tsx', 'w') as f:
    f.write(content)
