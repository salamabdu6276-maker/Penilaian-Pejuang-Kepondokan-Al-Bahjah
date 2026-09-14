import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Add state and effect
new_state = """  const [appLogo, setAppLogo] = useState<string>("/logo.png");
  const [appSignature, setAppSignature] = useState<string | null>(null);

  React.useEffect(() => {
    fetchAppLogo().then(url => {
      if (url) setAppLogo(url);
    });
    fetchSignatureLogo().then(url => {
      if (url) setAppSignature(url);
    });
  }, []);"""

content = re.sub(r'  const \[appLogo, setAppLogo\] = useState<string>\("/logo\.png"\);\n  React\.useEffect\(\(\) => \{\n    fetchAppLogo\(\)\.then\(url => \{\n      if \(url\) setAppLogo\(url\);\n    \}\);\n  \}, \[\]\);', new_state, content)

# Add handler
new_handler = """  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, async (url: string) => {
      setAppLogo(url);
      await saveAppLogo(url);
      alert("Logo berhasil diperbarui! Muat ulang halaman jika logo belum berubah di semua tempat.");
      window.dispatchEvent(new Event("logo-updated"));
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, async (url: string) => {
      setAppSignature(url);
      await saveSignatureLogo(url);
      alert("Tanda tangan berhasil diperbarui!");
    });
  };"""

content = re.sub(r'  const handleLogoUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{\n    handleFileUpload\(e, async \(url: string\) => \{\n      setAppLogo\(url\);\n      await saveAppLogo\(url\);\n      alert\("Logo berhasil diperbarui! Muat ulang halaman jika logo belum berubah di semua tempat\."\);\n      window\.dispatchEvent\(new Event\("logo-updated"\)\);\n    \}\);\n  \};', new_handler, content)

# Also ensure fetchSignatureLogo and saveSignatureLogo are imported
if "fetchSignatureLogo" not in content:
    content = content.replace("fetchAppLogo, saveAppLogo", "fetchAppLogo, saveAppLogo, fetchSignatureLogo, saveSignatureLogo")

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
print("Done")
