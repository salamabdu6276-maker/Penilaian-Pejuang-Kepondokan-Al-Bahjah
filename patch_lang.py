import re

with open('src/components/LanguageSwitcher.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="fixed bottom-6 left-6 z-50 print:hidden"', 'className="fixed bottom-[5.5rem] md:bottom-6 left-6 z-50 print:hidden"')

with open('src/components/LanguageSwitcher.tsx', 'w') as f:
    f.write(content)
