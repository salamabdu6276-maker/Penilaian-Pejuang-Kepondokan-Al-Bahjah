import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

state_target = '  const [endDate, setEndDate] = useState<string>("");'
state_replace = '  const [endDate, setEndDate] = useState<string>("");\n  const [certModalOpen, setCertModalOpen] = useState(false);\n  const [selectedCertData, setSelectedCertData] = useState<{name: string, divisi: string, performa: number} | null>(null);'

if 'const [certModalOpen' not in content:
    content = content.replace(state_target, state_replace)

import_target = "import { Download, Printer } from 'lucide-react';"
import_replace = "import { Download, Printer, Award } from 'lucide-react';\nimport CertificateModal from './CertificateModal';"

if 'import CertificateModal' not in content:
    content = content.replace(import_target, import_replace)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
