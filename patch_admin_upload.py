import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

target = """  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await handleFileUpload(e.target.files[0]);
      setAppLogo(url);
      await saveAppLogo(url);
      alert("Logo berhasil diperbarui! Muat ulang halaman jika logo belum berubah di semua tempat.");
      window.dispatchEvent(new Event("logo-updated"));
    }
  };"""

replace = """  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, async (url: string) => {
      setAppLogo(url);
      await saveAppLogo(url);
      alert("Logo berhasil diperbarui! Muat ulang halaman jika logo belum berubah di semua tempat.");
      window.dispatchEvent(new Event("logo-updated"));
    });
  };"""

content = content.replace(target, replace)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
