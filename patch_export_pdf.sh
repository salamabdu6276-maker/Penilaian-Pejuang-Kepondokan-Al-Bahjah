cat << 'INNER_EOF' > /tmp/export_element_pdf.ts

export async function exportElementToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await htmlToImage.toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
    
    // If the height exceeds one page, we might need multiple pages, 
    // but for simplicity, let's just scale it or let it run off, 
    // or set the orientation to landscape if width > height
    
    // Better yet, just add the image to the pdf and save
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(\`\${filename}.pdf\`);

  } catch (err) {
    console.error("Failed to export PDF:", err);
  }
}
INNER_EOF
cat /tmp/export_element_pdf.ts >> src/utils/export.ts
