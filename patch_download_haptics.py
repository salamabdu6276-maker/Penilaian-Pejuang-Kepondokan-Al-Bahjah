import re
with open('src/components/AnimatedDownloadButton.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Download, CheckCircle2 } from 'lucide-react';", "import { Download, CheckCircle2 } from 'lucide-react';\nimport { triggerHaptic } from '../utils/haptics';")

content = content.replace(
    'setStatus("downloading");',
    'setStatus("downloading");\n    triggerHaptic("medium");'
)

content = content.replace(
    'setStatus("done");',
    'setStatus("done");\n        triggerHaptic("success");'
)

with open('src/components/AnimatedDownloadButton.tsx', 'w') as f:
    f.write(content)
