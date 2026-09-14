import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Make sure fetchSignatureLogo is imported
if "fetchSignatureLogo" not in content:
    content = content.replace("import { fetchAppLogo } from \"../services/dbService\";", "import { fetchAppLogo, fetchSignatureLogo } from \"../services/dbService\";")

# Patch exportFormToPDF
# Look for the signature logic
old_form_signature = """
    const finalY = doc.autoTable.previous.finalY + 20;
    
    doc.setFont("helvetica", "normal");
    doc.text(translateText("Mengetahui,"), 30, finalY - 5);
    doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 30, finalY);
    doc.text(translateText("Cabang Cirebon 1"), 30, finalY + 4);
    doc.text(translateText(pejuang?.amanah || "Pejuang Kepondokan"), 150, finalY);

    doc.setFont("helvetica", "bold");
    try {
      const ttdBase64 = await getBase64ImageFromUrl("/ttd.png");
      if (ttdBase64) {
        doc.addImage(ttdBase64, "PNG", 30, finalY + 6, 35, 15);
      }
    } catch(err) {}
    doc.text(translateText(translateText("Ustadz Muhammad Hamdani")), 30, finalY + 24);
    doc.text(translateText(pejuang?.nama || "Nama Pejuang"), 150, finalY + 24);
"""

new_form_signature = """
    const finalY = (doc as any).autoTable.previous.finalY + 20;
    
    doc.setFont("helvetica", "normal");
    doc.text(translateText("Diperiksa Oleh,"), 30, finalY - 5);
    doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 30, finalY);
    doc.text(translateText("Cabang Cirebon 1"), 30, finalY + 4);
    
    doc.text(translateText("Pejuang Ybs,"), 140, finalY - 5);

    try {
      const ttdBase64 = await fetchSignatureLogo();
      if (ttdBase64) {
        doc.addImage(ttdBase64, "PNG", 30, finalY + 6, 35, 15);
      }
    } catch(err) {}
    
    doc.setFont("helvetica", "bold");
    doc.text(translateText("Ustadz M Hamdani, B.Sc"), 30, finalY + 24);
    doc.text(translateText(pejuang?.nama || "Nama Pejuang"), 140, finalY + 24);
"""

if "const finalY = doc.autoTable.previous.finalY + 20;" in content:
    content = content.replace(old_form_signature.strip(), new_form_signature.strip())
else:
    # Let's find it with regex if exact string is slightly off
    match = re.search(r'const finalY = \(?doc as any\)?\.autoTable\.previous\.finalY \+ 20;.*?doc\.text\(translateText\(pejuang\?\.nama \|\| "Nama Pejuang"\), 150, finalY \+ 24\);', content, re.DOTALL)
    if match:
        content = content.replace(match.group(0), new_form_signature.strip())

# Patch exportMonthlyPejuangToPDF
# Look for the Diperiksa Oleh section
old_monthly_signature = """
  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${translateText("Cirebon")}, ${currentDate}`, 145, ttdY);
  doc.text(translateText("Diperiksa Oleh,"), 145, ttdY + 5);
  doc.text(translateText("Mudir / Divisi Kepondokan"), 145, ttdY + 30);
"""

new_monthly_signature = """
  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${translateText("Cirebon")}, ${currentDate}`, 30, ttdY);
  doc.text(translateText("Diperiksa Oleh,"), 30, ttdY + 5);
  doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 30, ttdY + 10);
  doc.text(translateText("Cabang Cirebon 1"), 30, ttdY + 15);
  
  doc.text(translateText("Pejuang Ybs,"), 140, ttdY + 5);

  try {
    const ttdBase64 = await fetchSignatureLogo();
    if (ttdBase64) {
      doc.addImage(ttdBase64, "PNG", 30, ttdY + 18, 35, 15);
    }
  } catch (err) {}

  doc.setFont("helvetica", "bold");
  doc.text(translateText("Ustadz M Hamdani, B.Sc"), 30, ttdY + 38);
  doc.text(translateText(pejuang?.nama || ""), 140, ttdY + 38);
"""

if "doc.text(translateText(\"Diperiksa Oleh,\"), 145, ttdY + 5);" in content:
    content = content.replace(old_monthly_signature.strip(), new_monthly_signature.strip())
else:
    match = re.search(r'const currentDate = new Date\(\)\.toLocaleDateString\(.*?doc\.text\(translateText\("Mudir / Divisi Kepondokan"\), 145, ttdY \+ 30\);', content, re.DOTALL)
    if match:
        content = content.replace(match.group(0), new_monthly_signature.strip())


with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
