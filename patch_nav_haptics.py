import re

with open('src/components/Navigation.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { Role } from "../types";', 'import { Role } from "../types";\nimport { triggerHaptic } from "../utils/haptics";')

content = content.replace(
    'onClick={() => !isDisabled && onTabChange(tab.id as TabType)}',
    'onClick={() => { if (!isDisabled) { triggerHaptic("light"); onTabChange(tab.id as TabType); } }}'
)

with open('src/components/Navigation.tsx', 'w') as f:
    f.write(content)
