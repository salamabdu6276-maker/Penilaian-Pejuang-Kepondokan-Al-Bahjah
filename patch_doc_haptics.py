import re

with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

# Add missing import to the very top
import_str = "import { triggerHaptic } from '../utils/haptics';\n"
if "triggerHaptic" not in content[:500]:
    content = import_str + content

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
