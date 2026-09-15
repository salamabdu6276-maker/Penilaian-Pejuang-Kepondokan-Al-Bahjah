import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Extract Activity Timeline
activity_regex = re.compile(r'(?s)\s*<div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 mb-6">[^<]*<h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">[^<]*<Activity className="w-4 h-4 text-emerald-600" />[^<]*Activity Timeline[^<]*</h3>.*?</div>\s*</div>')
# Actually, let's just find it via string manipulation.

start_timeline = content.find('Activity Timeline')
if start_timeline != -1:
    # Need to go back to the wrapping div
    block_start = content.rfind('<div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 mb-6">', 0, start_timeline)
    
    # Let's just find the whole section
    start_str = '{/* ACTIVITY TIMELINE */}'
    # Wait, does the comment exist? Let's check.
