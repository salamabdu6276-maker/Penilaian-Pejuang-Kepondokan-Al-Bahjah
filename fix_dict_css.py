with open('src/components/TranslationDictionary.tsx', 'r') as f:
    content = f.read()

content = content.replace("style={{ display: 'none' }}", "style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden' }}")

with open('src/components/TranslationDictionary.tsx', 'w') as f:
    f.write(content)

print("Dictionary css patched!")
