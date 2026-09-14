import re

with open('src/services/dbService.ts', 'r') as f:
    content = f.read()

content = content.replace('import { doc, getDoc, setDoc } from "firebase/firestore";\n', '')

with open('src/services/dbService.ts', 'w') as f:
    f.write(content)
