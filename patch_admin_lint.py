import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Fix the lint error regarding ChecklistFormSubmission status types
# Type is probably 'verified' | 'submitted' | 'draft' rather than 'tuntas' | 'perbaikan'

target_status = """                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        sub.status === 'tuntas' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400' :
                        sub.status === 'perbaikan' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400' :
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                      }`}>"""

new_status = """                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        sub.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400' :
                        sub.status === 'submitted' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400' :
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                      }`}>"""

content = content.replace(target_status, new_status)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
