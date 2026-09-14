import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Add filter option
    content = content.replace('{ pixelRatio: 2, backgroundColor: "#ffffff" }', '{ pixelRatio: 2, backgroundColor: "#ffffff", filter: (node) => { if (node.dataset && node.dataset.html2canvasIgnore === "true") return false; return true; } }')
    
    content = content.replace("""    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2
    });""", """    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      filter: (node) => { if (node.dataset && node.dataset.html2canvasIgnore === "true") return false; return true; }
    });""")
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Filter added in {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            replace_in_file(os.path.join(root, file))

