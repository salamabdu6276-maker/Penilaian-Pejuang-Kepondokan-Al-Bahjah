import re

with open('src/components/LanguageSwitcher.tsx', 'r') as f:
    content = f.read()

content = content.replace('window.googleTranslateElementInit = () => {', '(window as any).googleTranslateElementInit = () => {')
content = content.replace('new window.google.translate.TranslateElement(', 'new (window as any).google.translate.TranslateElement(')

with open('src/components/LanguageSwitcher.tsx', 'w') as f:
    f.write(content)
