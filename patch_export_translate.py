import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Fix translate wrapper
import_stmt = 'import { translateText } from "./translate";'
new_import = 'import { translateText } from "./translate";\nimport { createRoot } from "react-dom/client";'
content = content.replace(import_stmt, new_import)

wrapper = """// Force translate before export
async function waitTranslate() {
    return new Promise(resolve => setTimeout(resolve, 500)); // allow google translate to process DOM
}"""

if wrapper not in content:
    content = content + "\n" + wrapper

# Wait... google translate won't translate PDF text nodes directly.
# The `translateText` function already tries to read from the DOM, but it relies on React rendering elements with `data-key`.
# Currently `exportToCSV` and others call `translateText` directly.
# Let's check how translateText works.
