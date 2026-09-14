import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# We need to pre-render the strings so google translate can translate them BEFORE we extract text for PDF.
# But `translateText` uses `span[data-key="..."]` which are placed by some translation wrapper?
# Wait, do we have a TranslationDictionary component?
