import re

with open('src/components/ChecklistFormInput.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Download, Upload, Copy, Save, AlertCircle, Plus, Trash2, Settings, Lock } from 'lucide-react';", "import { Download, Upload, Copy, Save, AlertCircle, Plus, Trash2, Settings, Lock } from 'lucide-react';\nimport { triggerHaptic } from '../utils/haptics';")

content = content.replace(
    'onSubmit(payload);',
    'triggerHaptic("success");\n    onSubmit(payload);'
)

with open('src/components/ChecklistFormInput.tsx', 'w') as f:
    f.write(content)
