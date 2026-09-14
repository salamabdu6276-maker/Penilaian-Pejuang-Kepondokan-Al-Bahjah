import re
with open('src/components/AnimatedDeleteButton.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Trash2 } from 'lucide-react';", "import { Trash2 } from 'lucide-react';\nimport { triggerHaptic } from '../utils/haptics';")

content = content.replace(
    'if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {',
    'triggerHaptic("heavy");\n    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {'
)
with open('src/components/AnimatedDeleteButton.tsx', 'w') as f:
    f.write(content)
