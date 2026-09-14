import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Fix exportFormToPDF
old_form_signature = """  if (finalY < 260) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
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
    doc.text(submission.pejuangNama, 150, finalY + 24);
  }"""

new_form_signature = """  if (finalY < 260) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
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
    doc.text(submission.pejuangNama, 140, finalY + 24);
  }"""
content = content.replace(old_form_signature, new_form_signature)

# Verify if fetchSignatureLogo is imported
if "fetchSignatureLogo" not in content:
    content = content.replace('import { fetchAppLogo } from "../services/dbService";', 'import { fetchAppLogo, fetchSignatureLogo } from "../services/dbService";')


# Check exportSummaryToPDF
# I'll check its signature section
match_summary = re.search(r'doc\.text\(`\$\{translateText\("Cirebon"\)\}, \$\{currentDate\}`.*?Ustadz Muhammad Hamdani.*?\)', content, re.DOTALL)
if match_summary:
    old_summary_sig = match_summary.group(0)
    new_summary_sig = """doc.text(`${translateText("Cirebon")}, ${currentDate}`, 30, ttdY);
    doc.text(translateText("Diperiksa Oleh,"), 30, ttdY + 5);
    doc.text(translateText("Kepala Pondok Pesantren Al-Bahjah"), 30, ttdY + 10);
    doc.text(translateText("Cabang Cirebon 1"), 30, ttdY + 15);
    
    try {
      const ttdBase64 = await fetchSignatureLogo();
      if (ttdBase64) {
        doc.addImage(ttdBase64, "PNG", 30, ttdY + 18, 35, 15);
      }
    } catch(err) {}
    
    doc.setFont("helvetica", "bold");
    doc.text(translateText("Ustadz M Hamdani, B.Sc"), 30, ttdY + 38);"""
    content = content.replace(old_summary_sig, new_summary_sig)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("Done")
