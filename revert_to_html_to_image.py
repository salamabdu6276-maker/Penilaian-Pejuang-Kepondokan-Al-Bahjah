import os

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'html2canvas' not in content:
        return
        
    # Replace import
    content = content.replace('import html2canvas from "html2canvas";', 'import * as htmlToImage from "html-to-image";')
    content = content.replace("import html2canvas from 'html2canvas';", "import * as htmlToImage from 'html-to-image';")
    
    # Replace calls
    content = content.replace('(await html2canvas(chartEl, { scale: 2, backgroundColor: "#ffffff", useCORS: true })).toDataURL("image/png");', 'await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });')
    
    content = content.replace('(await html2canvas(certElement, { scale: 2, backgroundColor: "#ffffff", useCORS: true })).toDataURL("image/jpeg");', 'await htmlToImage.toJpeg(certElement, { pixelRatio: 2, backgroundColor: "#ffffff" });')
    content = content.replace("(await html2canvas(certElement, { scale: 2, backgroundColor: '#ffffff', useCORS: true })).toDataURL('image/jpeg');", "await htmlToImage.toJpeg(certElement, { pixelRatio: 2, backgroundColor: '#ffffff' });")
    
    # For exportElementToImage in export.ts
    content = content.replace("""    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
    const dataUrl = canvas.toDataURL('image/png');""", """    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2
    });""")

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Reverted in {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            replace_in_file(os.path.join(root, file))

