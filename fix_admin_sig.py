import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Replace state
content = re.sub(r'const \[appLogo, setAppLogo\] = useState<string \| null>\(null\);', 
                 'const [appLogo, setAppLogo] = useState<string | null>(null);\n  const [appSignature, setAppSignature] = useState<string | null>(null);', 
                 content)

# Replace data loading
content = re.sub(r'const logo = await fetchAppLogo\(\);\n\s*if \(logo\) setAppLogo\(logo\);',
                 'const logo = await fetchAppLogo();\n      if (logo) setAppLogo(logo);\n      const sig = await fetchSignatureLogo();\n      if (sig) setAppSignature(sig);',
                 content)

# Replace handler
content = re.sub(r'const handleLogoUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{.*?\};\n\s*reader\.readAsDataURL\(e\.target\.files\[0\]\);\n\s*\}\n\s*\};',
                 '''const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setAppLogo(base64);
        await saveAppLogo(base64);
        alert("Logo berhasil disimpan!");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setAppSignature(base64);
        await saveSignatureLogo(base64);
        alert("Tanda Tangan berhasil disimpan!");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };''', content, flags=re.DOTALL)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
print("Done")
