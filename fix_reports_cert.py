import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add missing imports if they failed
if 'CertificateModal' not in content[:500]:
    content = content.replace("import { Download, Search, Filter, Printer } from 'lucide-react';", "import { Download, Search, Filter, Printer, Award } from 'lucide-react';\nimport CertificateModal from './CertificateModal';")

# Ensure states exist
if 'const [certModalOpen' not in content:
    content = content.replace('const [searchQuery, setSearchQuery] = useState("");', 'const [searchQuery, setSearchQuery] = useState("");\n  const [certModalOpen, setCertModalOpen] = useState(false);\n  const [selectedCertData, setSelectedCertData] = useState<{name: string, divisi: string, performa: number} | null>(null);')

# Let's fix the multiple replacements issues
with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)

