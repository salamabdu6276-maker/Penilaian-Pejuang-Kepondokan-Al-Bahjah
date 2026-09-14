with open('src/components/TranslationDictionary.tsx', 'r') as f:
    content = f.read()

if '"Ustadz Muhammad Hamdani"' not in content:
    content = content.replace('"Laporan Bulanan",', '"Ustadz Muhammad Hamdani",\n  "Laporan Bulanan",')

with open('src/components/TranslationDictionary.tsx', 'w') as f:
    f.write(content)

print("Ustadz added to dict")
