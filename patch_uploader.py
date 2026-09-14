import re

with open('src/components/SholatAttendanceUploader.tsx', 'r') as f:
    content = f.read()

content = content.replace("import * as pdfjsLib from 'pdfjs-dist';", "import * as pdfjsLib from 'pdfjs-dist';\nimport pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';")
content = content.replace("pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;", "pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;")

with open('src/components/SholatAttendanceUploader.tsx', 'w') as f:
    f.write(content)
