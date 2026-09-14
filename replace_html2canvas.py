import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'html-to-image' not in content:
        return
        
    # Replace import
    content = content.replace('import * as htmlToImage from "html-to-image";', 'import html2canvas from "html2canvas";')
    content = content.replace("import * as htmlToImage from 'html-to-image';", "import html2canvas from 'html2canvas';")
    
    # Replace calls
    content = content.replace('await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });', '(await html2canvas(chartEl, { scale: 2, backgroundColor: "#ffffff", useCORS: true })).toDataURL("image/png");')
    
    content = content.replace('await htmlToImage.toJpeg(certElement, { pixelRatio: 2, backgroundColor: "#ffffff" });', '(await html2canvas(certElement, { scale: 2, backgroundColor: "#ffffff", useCORS: true })).toDataURL("image/jpeg");')
    content = content.replace("await htmlToImage.toJpeg(certElement, { pixelRatio: 2, backgroundColor: '#ffffff' });", "(await html2canvas(certElement, { scale: 2, backgroundColor: '#ffffff', useCORS: true })).toDataURL('image/jpeg');")
    
    # For exportElementToImage in export.ts
    content = content.replace("""    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2
    });""", """    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
    const dataUrl = canvas.toDataURL('image/png');""")

    content = content.replace("""    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    });""", """    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
    const dataUrl = canvas.toDataURL('image/png');""")
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Replaced in {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            replace_in_file(os.path.join(root, file))

