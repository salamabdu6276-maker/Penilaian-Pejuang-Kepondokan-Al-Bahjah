import re

with open('src/components/LanguageSwitcher.tsx', 'r') as f:
    content = f.read()

new_langs = """const languages = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ar', name: 'Bahasa Arab', flag: '🇸🇦' },
  { code: 'de', name: 'Bahasa Jerman', flag: '🇩🇪' },
  { code: 'ja', name: 'Bahasa Jepang', flag: '🇯🇵' },
  { code: 'en', name: 'Bahasa Inggris', flag: '🇬🇧' },
  { code: 'zh-CN', name: 'Bahasa Mandarin', flag: '🇨🇳' },
  { code: 'ru', name: 'Bahasa Rusia', flag: '🇷🇺' },
  { code: 'es', name: 'Bahasa Spanyol', flag: '🇪🇸' },
  { code: 'ko', name: 'Bahasa Korea', flag: '🇰🇷' },
  { code: 'fr', name: 'Bahasa Prancis', flag: '🇫🇷' },
];"""

old_langs = """const languages = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ar', name: 'Bahasa Arab', flag: '🇸🇦' },
  { code: 'de', name: 'Bahasa Jerman', flag: '🇩🇪' },
  { code: 'ja', name: 'Bahasa Jepang', flag: '🇯🇵' },
  { code: 'en', name: 'Bahasa Inggris', flag: '🇬🇧' },
];"""

content = content.replace(old_langs, new_langs)
content = content.replace("includedLanguages: 'id,ar,de,ja,en',", "includedLanguages: 'id,ar,de,ja,en,zh-CN,ru,es,ko,fr',")

with open('src/components/LanguageSwitcher.tsx', 'w') as f:
    f.write(content)

