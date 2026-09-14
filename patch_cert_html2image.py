import re

with open('src/components/CertificateModal.tsx', 'r') as f:
    content = f.read()

# Replace import
content = content.replace("import html2canvas from 'html2canvas';", "import * as htmlToImage from 'html-to-image';")

# Replace html2canvas logic
target_logic = """      const canvas = await html2canvas(certElement, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);"""

replacement_logic = """      const imgData = await htmlToImage.toJpeg(certElement, { pixelRatio: 2, backgroundColor: '#ffffff' });"""

content = content.replace(target_logic, replacement_logic)

with open('src/components/CertificateModal.tsx', 'w') as f:
    f.write(content)
