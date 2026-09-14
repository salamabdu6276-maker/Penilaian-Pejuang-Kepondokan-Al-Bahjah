cat << 'INNER_EOF' > /tmp/admin_target.tsx
  const [weeklyTarget, setWeeklyTarget] = useState<number>(() => {
    return Number(localStorage.getItem("weeklyTarget")) || 80;
  });

  const handleSaveTarget = () => {
    localStorage.setItem("weeklyTarget", weeklyTarget.toString());
    alert("Target ketercapaian berhasil disimpan!");
  };
INNER_EOF
sed -i -e '/\/\/ Pejuang Form State/i\' -e "$(cat /tmp/admin_target.tsx | sed 's/$/\\/')" src/components/AdminSettings.tsx
sed -i 's/\\$//g' src/components/AdminSettings.tsx
