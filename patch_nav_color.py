import re

with open('src/components/Navigation.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "color: isActive ? 'var(--tw-colors-emerald-600)' : 'currentColor'",
    "color: isActive ? 'var(--tw-colors-emerald-600)' : 'var(--tw-colors-slate-500)'"
)

with open('src/components/Navigation.tsx', 'w') as f:
    f.write(content)
