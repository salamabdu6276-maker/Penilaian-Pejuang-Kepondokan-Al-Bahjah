import os
import re

components = ['src/components/Dashboard.tsx', 'src/components/ReportsView.tsx', 'src/components/AdminSettings.tsx', 'src/components/Navigation.tsx', 'src/components/ChecklistFormInput.tsx']

for file in components:
    with open(file, 'r') as f:
        content = f.read()

    # Apply some common dark mode classes
    content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
    content = content.replace('text-slate-900', 'text-slate-900 dark:text-slate-100')
    content = content.replace('text-slate-800', 'text-slate-800 dark:text-slate-200')
    content = content.replace('text-slate-700', 'text-slate-700 dark:text-slate-300')
    content = content.replace('text-slate-600', 'text-slate-600 dark:text-slate-400')
    content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
    content = content.replace('bg-slate-50', 'bg-slate-50 dark:bg-slate-700/50')
    content = content.replace('bg-slate-100', 'bg-slate-100 dark:bg-slate-700')
    content = content.replace('border-slate-200', 'border-slate-200 dark:border-slate-700')
    content = content.replace('border-slate-100', 'border-slate-100 dark:border-slate-700/50')
    content = content.replace('border-slate-300', 'border-slate-300 dark:border-slate-600')

    # Remove duplicates like dark:bg-slate-800 dark:bg-slate-800
    content = content.replace('bg-white dark:bg-slate-800 dark:bg-slate-800', 'bg-white dark:bg-slate-800')

    with open(file, 'w') as f:
        f.write(content)

