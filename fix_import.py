import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { getWeekPeriodString } from "../utils/hijri";', 'import { getWeekPeriodString } from "../utils/hijri";\nimport CertificateModal from "./CertificateModal";')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
