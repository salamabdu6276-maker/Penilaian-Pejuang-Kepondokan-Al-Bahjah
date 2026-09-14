import re

with open('src/components/CertificateModal.tsx', 'r') as f:
    content = f.read()

if 'import { translateText }' not in content:
    content = content.replace('import { Award, Download, X } from \'lucide-react\';', 'import { Award, Download, X } from \'lucide-react\';\nimport { translateText } from "../utils/translate";')

replacements = {
    "`Sertifikat_Pejuang_Terbaik_${pejuang.nama.replace(/\\s+/g, '_')}_${periodStr.replace(/\\s+/g, '_')}.pdf`": '`${translateText("Sertifikat")}_${translateText(pejuang.nama).replace(/\\s+/g, "_")}_${translateText(periodStr).replace(/\\s+/g, "_")}.pdf`'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/components/CertificateModal.tsx', 'w') as f:
    f.write(content)
